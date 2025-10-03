# file: proxy_service.py
import os
import time
import json
import hmac
import base64
import hashlib
import asyncio
from typing import Optional
from urllib.parse import urlparse

import redis
import httpx
from fastapi import FastAPI, Request, HTTPException, Header, Response, status
from pydantic import BaseModel
from yt_dlp import YoutubeDL

# CONFIG (env / secrets)
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
SECRET_KEY = os.getenv("SIGN_SECRET", "very-secret-key-change-me")
PROXY_TOKEN_TTL = 300  # seconds
STREAM_CHUNK_SIZE = 256 * 1024  # 256 KB
USER_AGENT = "Mozilla/5.0 (compatible; MyDownloader/1.0)"

r = redis.from_url(REDIS_URL, decode_responses=True)
app = FastAPI(title="Video Info & Proxy Service")

# ---------- Helpers ----------
def hmac_sign(payload: str, secret: str) -> str:
    sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(sig).decode().rstrip("=")

def make_token(video_id: str, fmt_id: str, expires_at: int) -> str:
    payload = f"{video_id}|{fmt_id}|{expires_at}"
    sig = hmac_sign(payload, SECRET_KEY)
    token = base64.urlsafe_b64encode(payload.encode()).decode().rstrip("=") + "." + sig
    return token

def verify_token(token: str) -> Optional[dict]:
    try:
        payload_b64, sig = token.split(".")
        payload = base64.urlsafe_b64decode(payload_b64 + "==").decode()
        expected_sig = hmac_sign(payload, SECRET_KEY)
        if not hmac.compare_digest(sig, expected_sig):
            return None
        video_id, fmt_id, expires_at = payload.split("|")
        if int(expires_at) < int(time.time()):
            return None
        return {"video_id": video_id, "fmt_id": fmt_id, "expires_at": int(expires_at)}
    except Exception:
        return None

# ---------- Models ----------
class InfoResponse(BaseModel):
    id: str
    title: str
    formats: list

class ProxyRequest(BaseModel):
    url: str
    fmt_id: str  # format id returned by /info
    prefer_direct: Optional[bool] = False  # if True, we may return direct URL instead


# ---------- Endpoints ----------
@app.get("/info", response_model=InfoResponse)
def get_info(url: str):
    cache_key = f"info:{url}"
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)

    ydl_opts = {"quiet": True, "no_warnings": True, "skip_download": True, "force_generic_extractor": False}
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    formats = []
    for f in info.get("formats", []):
        formats.append({
            "format_id": f.get("format_id"),
            "ext": f.get("ext"),
            "resolution": f.get("resolution") or f.get("height"),
            "filesize": f.get("filesize"),
            "abr": f.get("abr"),
            "url": f.get("url"),  # may be present (direct stream URL)
            "protocol": f.get("protocol"),
        })

    resp = {"id": info.get("id"), "title": info.get("title"), "formats": formats}
    # cache metadata for 5 minutes
    r.setex(cache_key, 300, json.dumps(resp))
    return resp

@app.post("/request_proxy")
def request_proxy(body: ProxyRequest):
    # 1) Extract info to map fmt_id -> origin_url
    ydl_opts = {"quiet": True, "no_warnings": True, "skip_download": True}
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(body.url, download=False)

    # find target format
    fmt = next((f for f in info.get("formats", []) if f.get("format_id") == body.fmt_id), None)
    if not fmt:
        raise HTTPException(status_code=400, detail="format not found")

    origin_url = fmt.get("url")
    # origin_url may be None for some extractor types; in that case we could choose another strategy.

    # If prefer_direct and origin_url is set and looks stable, return it directly
    if body.prefer_direct and origin_url:
        # Optionally: sign the origin_url or return as-is
        return {"direct_url": origin_url, "expires_in": 300}

    # else create token and store mapping in Redis
    video_id = info.get("id")
    fmt_id = body.fmt_id
    expires_at = int(time.time()) + PROXY_TOKEN_TTL
    token = make_token(video_id, fmt_id, expires_at)

    key = f"proxy:{token}"
    # store origin url mapping and expiry
    r.setex(key, PROXY_TOKEN_TTL, json.dumps({"origin_url": origin_url, "created": int(time.time())}))
    return {"proxy_url": f"/proxy/{token}", "expires_in": PROXY_TOKEN_TTL}


@app.get("/proxy/{token}")
async def proxy_stream(token: str, request: Request, range: Optional[str] = Header(None)):
    # verify token
    info = verify_token(token)
    if not info:
        raise HTTPException(status_code=403, detail="invalid or expired token")

    key = f"proxy:{token}"
    mapping = r.get(key)
    if not mapping:
        raise HTTPException(status_code=404, detail="token not found or expired")
    mapping = json.loads(mapping)
    origin_url = mapping.get("origin_url")
    if not origin_url:
        raise HTTPException(status_code=500, detail="origin URL unavailable")

    # Forward Range header if client passed one
    headers = {"User-Agent": USER_AGENT}
    if range:
        headers["Range"] = range

    # stream from origin using httpx (async)
    async with httpx.AsyncClient(timeout=None, follow_redirects=True, headers=headers) as client:
        # stream mode
        try:
            upstream = await client.get(origin_url, stream=True)
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=str(e))

        # If upstream returns 206/200, we pass through status + headers
        status_code = upstream.status_code
        resp_headers = {}
        # copy some useful headers (content-type, content-length, accept-ranges, content-range)
        for h in ("content-type", "content-length", "accept-ranges", "content-range"):
            v = upstream.headers.get(h)
            if v:
                resp_headers[h] = v

        # create an async generator to forward chunks
        async def stream_generator():
            try:
                async for chunk in upstream.aiter_bytes(CHUNK_SIZE=STREAM_CHUNK_SIZE):
                    yield chunk
            finally:
                await upstream.aclose()

        return Response(content=stream_generator(), status_code=status_code, headers=resp_headers)
