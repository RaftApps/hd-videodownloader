import time
import tempfile
from fastapi import FastAPI, HTTPException, Header, Query, BackgroundTasks
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import re
import os
import requests
import tldextract
from pydantic import BaseModel
import yt_dlp
import instaloader
import uuid
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = FastAPI(title="HD Video Downloader API", version="0.0.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://hdvideodownload.xyz"],  # only your site
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


API_KEY = os.getenv("API_KEY", "default-key")
API_KEY_HEADER = "api-key"
BLOCKLIST_URL = os.getenv("BLOCKLIST_URL")
PROXY_URL = os.getenv("PROXY_URL")
DEBUG_URL = os.getenv("DEBUG_URL")
PROD_URL = os.getenv("PROD_URL")
COOKIE_FILE = os.getenv("COOKIE_FILE", "youtube_cookies.txt")

def load_blocklist():
    """
    Download and parse the blocklist into a Python set.
    Handles plain domain lists and hosts-style lists.
    """
    print("Loading blocklist...")
    blocklist = set()
    try:
        response = requests.get(BLOCKLIST_URL, timeout=10)
        response.raise_for_status()
        for line in response.text.splitlines():
            line = line.strip().lower()
            if not line or line.startswith("#"):  # skip empty or comments
                continue
            # Split on whitespace (handles "0.0.0.0 domain.com")
            parts = line.split()
            domain = parts[-1]  # always take the last part
            # Clean protocol + www
            domain = domain.replace("http://", "").replace("https://", "")
            # if domain.startswith("www."):
            #     domain = domain[4:]

            # Keep only domain part
            domain = domain.split("/")[0]
            blocklist.add(domain)

        print(f"Loaded {len(blocklist)} blocked domains.")
    except Exception as e:
        print(f"⚠️ Failed to load blocklist from {BLOCKLIST_URL}: {e}")
        # fallback minimal adult list
        blocklist = {"xnxx.com", "xvideos.com", "pornhub.com", "redtube.com", "xhamster.com"}
    return blocklist


# Load blocklist once
ADULT_BLOCKLIST = load_blocklist()


def is_adult_url(url: str) -> bool:
    url = url.strip().lower().replace("http://", "").replace("https://", "")
    if url.startswith("www."):
        url = url[4:]
    domain = url.split("/")[0]

    # Extract registered domain (e.g., xnxx.com from m.xnxx.com)
    extracted = tldextract.extract(domain)
    base_domain = f"{extracted.domain}.{extracted.suffix}"

    blocked = domain in ADULT_BLOCKLIST or base_domain in ADULT_BLOCKLIST
    print(f"Checking {domain} (base: {base_domain}) -> {blocked}")
    return blocked

tasks_progress = {}  # in-memory progress tracker

# ----------------------------
# Models
# ----------------------------
class URLRequest(BaseModel):
    url: str

class BulkURLRequest(BaseModel):
    urls: list[str]

class PlaylistRequest(BaseModel):
    url: str

# ----------------------------
# Helpers
# ----------------------------
def extract_instagram_shortcode(url):
        """Extract shortcode from Instagram URL"""
        patterns = [
            r'/p/([^/?]+)',
            r'/reel/([^/?]+)',
            r'/tv/([^/?]+)'
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
def extract_instagram_username(url):
        """Extract username from Instagram URL"""
        match = re.search(r'instagram\.com/([^/?]+)', url)
        if match:
            return match.group(1)
        return None
def verify_api_key(key: str | None):
    if key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

def detect_platform(url: str):
    url = url.lower()
    if is_adult_url(url):
        raise HTTPException(
            status_code=403,
            detail={"error": "Blocked", "message": "🚫 Adult websites are blocked by policy"}
        )
    if "youtube.com" in url or "youtu.be" in url:
        return "youtube"
    elif "instagram.com" in url:
        return "instagram"
    elif "facebook.com" in url or "fb.watch" in url:
        return "facebook"
    elif "twitter.com" in url or "x.com" in url:
        return "twitter"
    elif "tiktok.com" in url:
        return "tiktok"
    elif "pinterest.com" in url:
        return "pinterest"
    elif "linkedin.com" in url:
        return "linkedin"
    elif "snapchat.com" in url:
        return "snapchat"
    elif "reddit.com" in url:
        return "reddit"
    elif "twitch.tv" in url:
        return "twitch"
    else:
        return "unknown"
    
def delete_file_later(path: str, delay: int = 300):
    time.sleep(delay)
    try:
        if os.path.exists(path):
            os.remove(path)
            print(f"✅ Deleted temporary file: {path}")
    except Exception as e:
        print(f"⚠️ Error deleting file {path}: {e}")

# ----------------------------
# Main format extraction
# ----------------------------
def get_formats_yt(url: str):
    platform = detect_platform(url)
    # ydl_opts = {
    #     "quiet": False,
    #     "no_warnings": True,
    #     # "proxy": PROXY_URL,  # rotating proxy
    #     # "Referer": "https://www.tiktok.com/" if platform == "tiktok" else "",
    #     # "format": "bestvideo+bestaudio/best",  # force muxed playable
    #     # "merge_output_format": "mp4",  # ensure proper mux
    #     # "cookiesfrombrowser": ("chrome",),  # or "brave", "edge", etc.
    #     "http_headers": {
    #         "User-Agent": (
    #             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    #             "AppleWebKit/537.36 (KHTML, like Gecko) "
    #             "Chrome/91.0.4472.124 Safari/537.36"
    #             ),
    #         # "Referer": "https://www.tiktok.com/" if platform == "tiktok" else "",
    #         # "Accept": "*/*",
    #         # "Accept-Language": "en-US,en;q=0.9",
    #         # "Connection": "keep-alive",
    #         # "Sec-Fetch-Site": "same-origin",
    #         # "Sec-Fetch-Mode": "cors",
    #         # "Sec-Fetch-Dest": "empty",
    #     },
    # }
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "cookies": COOKIE_FILE,
        "proxy": PROXY_URL,  # rotating proxy
        "Referer": "https://www.youtube.com/" if platform == "youtube" else "",
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/91.0.4472.124 Safari/537.36"
            )
        }
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        progressive, video_only, audio_only, others = [], [], [], []

        for f in info.get("formats", []):
            vcodec, acodec = f.get("vcodec"), f.get("acodec")
            fmt = {
                "format_id": f.get("format_id"),
                "ext": f.get("ext"),
                "resolution": f.get("resolution") or f.get("height"),
                "filesize": f.get("filesize") or f.get("filesize_approx"),
                "url": f.get("url"),
            }
            if (fmt["ext"] in ["mhtml", "webpage", "dash", "m3u8"]
                or (fmt["url"] and fmt["url"].endswith(".m3u8"))):
                continue
            if vcodec != "none" and acodec != "none":
                progressive.append(fmt)
            elif vcodec != "none" and acodec == "none":
                video_only.append(fmt)
            elif vcodec == "none" and acodec != "none":
                audio_only.append(fmt)
            else:
                others.append(fmt)

        return {
            "platform": detect_platform(url),
            "title": info.get("title"),
            "uploader": info.get("uploader"),
            "thumbnail": info.get("thumbnail"),
            "duration": info.get("duration"),
            "progressive": progressive,
            "video_only": video_only,
            "audio_only": audio_only,
            "others": others
        }


def get_formats_instagram(url: str):
    try:
        loader = instaloader.Instaloader(
            download_pictures=False,
            download_videos=False,
            download_video_thumbnails=False,
            download_geotags=False,
            download_comments=False,
            save_metadata=False,
            compress_json=False
        )

        platform = "instagram"

        # Story URL
        if '/stories/' in url:
            username = extract_instagram_username(url)
            if username:
                profile = instaloader.Profile.from_username(loader.context, username)
                urls = []
                for story in loader.get_stories([profile.userid]):
                    for item in story.get_items():
                        urls.append(item.video_url or item.url)

                return {
                    "platform": platform,
                    "title": f"{username} - Stories",
                    "uploader": username,
                    "thumbnail": None,
                    "duration": None,
                    "progressive": [{"url": u, "type": "video" if u.endswith(".mp4") else "image"} for u in urls],
                    "video_only": [],
                    "audio_only": [],
                    "others": []
                }

        # Post / Reel / IGTV
        elif '/reel/' in url or '/p/' in url or '/tv/' in url:
            shortcode = extract_instagram_shortcode(url)
            post = instaloader.Post.from_shortcode(loader.context, shortcode)

            urls = []
            if post.typename == "GraphSidecar":
                for node in post.get_sidecar_nodes():
                    urls.append(node.video_url or node.display_url)
            else:
                urls.append(post.video_url if post.is_video else post.url)

            return {
                "platform": platform,
                "title": (post.caption[:100] + "...") if post.caption and len(post.caption) > 100 else post.caption,
                "uploader": post.owner_username,
                "thumbnail": post.url,
                "duration": post.video_duration if post.is_video else None,
                "progressive": [{"url": u, "type": "video" if u.endswith(".mp4") else "image"} for u in urls],
                "video_only": [],
                "audio_only": [],
                "others": []
            }

    except Exception as e:
        # If instaloader fails, retry with yt_dlp
        try:
            ydl_opts = {
                "quiet": True,
                "no_warnings": True,
                "proxy": PROXY_URL,  # rotating proxy
                "http_headers": {
                    "User-Agent": (
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/91.0.4472.124 Safari/537.36"
                    )
                }
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                progressive = []

                for f in info.get("formats", []):
                    vcodec, acodec = f.get("vcodec"), f.get("acodec")
                    if vcodec != "none" and acodec != "none":
                        progressive.append({
                            "format_id": f.get("format_id"),
                            "ext": f.get("ext"),
                            "resolution": f.get("resolution") or f.get("height"),
                            "filesize": f.get("filesize") or f.get("filesize_approx"),
                            "url": f.get("url"),
                        })

                return {
                    "platform": "instagram",
                    "title": info.get("title"),
                    "uploader": info.get("uploader"),
                    "thumbnail": info.get("thumbnail"),
                    "duration": info.get("duration"),
                    "progressive": progressive,
                    "video_only": [],
                    "audio_only": [],
                    "others": []
                }

        except Exception as e2:
            return {"status": "error", "message": f"Instagram failed. Instaloader: {str(e)} | yt_dlp: {str(e2)}"}
        
def process_tiktok(url: str, background_tasks: BackgroundTasks):
    """
    Download TikTok video server-side, return metadata + server download URL
    """
    if "tiktok.com" not in url:
        raise HTTPException(status_code=400, detail="Invalid TikTok URL")

    # Generate unique filename
    video_id = str(uuid.uuid4())
    output_template = os.path.join(DOWNLOAD_DIR, f"{video_id}.%(ext)s")

    ydl_opts = {
        "format": "mp4",
        "outtmpl": output_template,
        "noplaylist": True,
        "proxy": PROXY_URL,  # rotating proxy
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

            # Final downloaded file path
            downloaded_file = ydl.prepare_filename(info)

            # Determine extension and filesize
            ext = info.get("ext") or "mp4"
            filesize = os.path.getsize(downloaded_file) if os.path.exists(downloaded_file) else None
            
            base_url = PROD_URL 
            # if app.debug else PROD_URL

            response = {
                "platform": "tiktok",
                "title": info.get("title"),
                "uploader": info.get("uploader"),
                "duration": info.get("duration"),
                "thumbnail": info.get("thumbnail"),
                "progressive": [
                    {
                        "format_id": "server",
                        "ext": ext,
                        "resolution": f"{info.get('height', 'Unknown')}p",
                        "filesize": filesize,
                        "url": f"{base_url}/files/{os.path.basename(downloaded_file)}",
                    }
                ],
                "video_only": [],
                "audio_only": [],
                "others": []
            }
            
            background_tasks.add_task(delete_file_later, downloaded_file)
            
            return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



    
# ----------------------------
# Endpoints
# ----------------------------

@app.post("/formats")
async def formats(
    req: URLRequest,
    background_tasks: BackgroundTasks,   # ✅ inject instance here
    api_key: str | None = Header(None, alias=API_KEY_HEADER)
):
    verify_api_key(api_key)
    platform = detect_platform(req.url)
    if platform == "instagram":
        return JSONResponse(get_formats_instagram(req.url))
    elif platform == "tiktok":
        return JSONResponse(process_tiktok(req.url, background_tasks))
    return JSONResponse(get_formats_yt(req.url))

@app.post("/playlist-formats")
async def playlist_formats(
    req: PlaylistRequest, 
    api_key: str | None = Header(None, alias=API_KEY_HEADER)
):
    verify_api_key(api_key)
    task_id = str(uuid.uuid4())
    tasks_progress[task_id] = {"total": 0, "completed": 0, "results": [], "errors": [], "status": "running"}

    ydl_opts = { "quiet": True,
                "no_warnings": True,
                "proxy": PROXY_URL,  # rotating proxy
                "http_headers": {
                    "User-Agent": (
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/91.0.4472.124 Safari/537.36"
                    )
                }}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(req.url, download=False)
        print(info)
        entries = info.get("entries", [])
        tasks_progress[task_id]["total"] = len(entries)

        results = []
        for e in entries:
            try:
                url = e.get("webpage_url")
                fmt = get_formats_yt(url)
                results.append(fmt)
                tasks_progress[task_id]["completed"] += 1
            except Exception as e:
                tasks_progress[task_id]["errors"].append(str(e))
                tasks_progress[task_id]["completed"] += 1

    tasks_progress[task_id]["results"] = results
    tasks_progress[task_id]["status"] = "completed"
    return {"task_id": task_id, "status": "completed", "results": results}

# from fastapi.responses import StreamingResponse
# import yt_dlp
# import requests

@app.get("/stream/tiktok")
async def stream_tiktok(url: str = Query(..., description="TikTok video URL")):
    try:
        # Create a temp file
        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        tmp_file.close()
        file_path = tmp_file.name

        # yt-dlp options
        ydl_opts = {
            "outtmpl": file_path,
            "proxy": PROXY_URL,
            "output": "-",
            "format": "mp4",
        }

        # Download first
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            ydl.download([url])

        # Make sure file exists and has size
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            raise HTTPException(status_code=500, detail="Download failed: file empty")

        # Streaming generator
        def iterfile():
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(1024 * 1024), b""):
                    yield chunk
            # cleanup after stream finishes
            os.remove(file_path)

        # Return as downloadable mp4
        return StreamingResponse(
            iterfile(),
            media_type="video/mp4",
            headers={"Content-Disposition": "attachment; filename=video.mp4"},
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.get("/stream/tiktok")
# async def stream_tiktok(url: str):
#     buffer = io.BytesIO()

#     ydl_opts = {
#         "format": "mp4",
#         "noplaylist": True,
#         "outtmpl": "-",  # stream to stdout
#     }

#     def ydl_gen():
#         with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#             ydl.download([url])  # stream into buffer
#         buffer.seek(0)
#         yield from buffer

#     return StreamingResponse(ydl_gen(), media_type="video/mp4")

@app.get("/files/{filename}")
async def serve_file(filename: str):
    """
    Serve downloaded video files from server
    """
    file_path = os.path.join(DOWNLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="video/mp4", filename=filename)

app.get("/api/download")
def download_file(
    url: str = Query(..., description="Signed CDN URL"),
    filename: str = Query(..., description="Desired filename with extension")
):
    """
    Redirect user to CDN with Content-Disposition headers.
    If redirect fails, fallback = open signed URL in new tab.
    """

    try:
        response = RedirectResponse(url=url, status_code=302)
        response.headers["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
    except Exception:
        html = f"""
        <html>
            <body>
                <script>
                    window.open("{url}", "_blank");
                </script>
                <p>Redirect failed, opening in new tab: <a href="{url}" target="_blank">{url}</a></p>
            </body>
        </html>
        """
        return HTMLResponse(content=html)

@app.post("/bulk-formats")
async def bulk_formats(
    req: BulkURLRequest, 
    api_key: str | None = Header(None, alias=API_KEY_HEADER)
):
    verify_api_key(api_key)
    task_id = str(uuid.uuid4())
    tasks_progress[task_id] = {"total": len(req.urls), "completed": 0, "results": [], "errors": [], "status": "running"}

    results = []
    for url in req.urls:
        platform = detect_platform(url)
        try:
            if platform == "instagram":
                fmt = get_formats_instagram(url)
            else:
                fmt = get_formats_yt(url)
            results.append(fmt)
        except Exception as e:
            tasks_progress[task_id]["errors"].append({"url": url, "error": str(e)})
        finally:
            tasks_progress[task_id]["completed"] += 1

    tasks_progress[task_id]["results"] = results
    tasks_progress[task_id]["status"] = "completed"
    return {"task_id": task_id, "status": "completed", "results": results}

@app.get("/progress/{task_id}")
def progress(
    task_id: str, 
    api_key: str | None = Header(None, alias=API_KEY_HEADER)
):
    verify_api_key(api_key)
    if task_id not in tasks_progress:
        raise HTTPException(status_code=404, detail="Task ID not found")
    return tasks_progress[task_id]

@app.get("/supported-platforms")
def supported_platforms(
    api_key: str | None = Header(None, alias=API_KEY_HEADER)
):
    verify_api_key(api_key)
    return {
        "video_platforms": ["YouTube", "TikTok", "Twitter/X", "Facebook", "Instagram", "Reddit", "Twitch", "Vimeo", "Dailymotion"],
        "social_platforms": ["Instagram", "Twitter/X", "Facebook", "Reddit", "LinkedIn", "Pinterest", "& others upto 1.8K+ plus platforms supported."],
        "features": [
            "Auto-platform detection",
            "Bulk downloads",
            "Stories download",
            "Playlist support",
            "High quality downloads",
            "Metadata preservation",
            "Subtitle downloads"
        ],
    }



# from fastapi import FastAPI, HTTPException
# from fastapi.responses import JSONResponse
# from pydantic import BaseModel, field_validator
# import yt_dlp
# import instaloader
# import re
# from urllib.parse import urlparse

# app = FastAPI(title="HD Video Downloader API", version="0.0.6")


# class URLRequest(BaseModel):
#     url: str

#     @field_validator("url", mode="before")
#     def normalize_and_validate(cls, v: str) -> str:
#         """Normalize and validate URL before passing to endpoint."""
#         if not re.match(r'^(?:http|https)://', v, re.IGNORECASE):
#             v = "https://" + v
#         parsed = urlparse(v)
#         if not (parsed.scheme in ["http", "https"] and parsed.netloc):
#             raise ValueError("Invalid URL format")
#         return v


# # --- Platform Detection ---
# def detect_platform(url: str):
#     url = url.lower()
#     if "youtube.com" in url or "youtu.be" in url:
#         return "youtube"
#     elif "instagram.com" in url:
#         return "instagram"
#     elif "facebook.com" in url or "fb.watch" in url:
#         return "facebook"
#     elif "twitter.com" in url or "x.com" in url:
#         return "twitter"
#     elif "tiktok.com" in url:
#         return "tiktok"
#     elif "pinterest.com" in url:
#         return "pinterest"
#     elif "linkedin.com" in url:
#         return "linkedin"
#     elif "snapchat.com" in url:
#         return "snapchat"
#     elif "reddit.com" in url:
#         return "reddit"
#     elif "twitch.tv" in url:
#         return "twitch"
#     else:
#         return "unknown"


# @app.post("/formats")
# async def get_formats(req: URLRequest):
#     """
#     Input: Video URL (JSON)
#     Output: Progressive, video-only, audio-only, and others (URLs only)
#     """
#     try:
#         platform = detect_platform(req.url)

#         if platform == "instagram":
#             try:
#                 L = instaloader.Instaloader(download_pictures=False, download_video_thumbnails=False)
#                 shortcode = req.url.strip("/").split("/")[-1].split("?")[0]
#                 post = instaloader.Post.from_shortcode(L.context, shortcode)

#                 return JSONResponse({
#                     "platform": "instagram",
#                     "title": getattr(post, "title", None),
#                     "uploader": post.owner_username,
#                     "thumbnail": post.url,
#                     "duration": post.video_duration if post.is_video else None,
#                     "progressive": [{"url": post.video_url}] if post.is_video else [],
#                     "video_only": [],
#                     "audio_only": [],
#                     "others": []
#                 })
#             except Exception as e:
#                 raise HTTPException(status_code=500, detail=f"Instagram error: {str(e)}")

#         else:  # yt_dlp for all other platforms
#             ydl_opts = {
#                 "quiet": True,
#                 "no_warnings": True,
#                 "http_headers": {
#                     "User-Agent": (
#                         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
#                         "AppleWebKit/537.36 (KHTML, like Gecko) "
#                         "Chrome/91.0.4472.124 Safari/537.36"
#                     )
#                 }
#             }
#             with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#                 info = ydl.extract_info(req.url, download=False)

#                 progressive, video_only, audio_only, others = [], [], [], []

#                 for f in info.get("formats", []):
#                     vcodec, acodec = f.get("vcodec"), f.get("acodec")

#                     fmt = {
#                         "format_id": f.get("format_id"),
#                         "ext": f.get("ext"),
#                         "resolution": f.get("resolution") or f.get("height"),
#                         "filesize": f.get("filesize") or f.get("filesize_approx"),
#                         "url": f.get("url"),
#                     }
#                     # if fmt["ext"] in ["mhtml", "webpage", "dash"]:
#                     #     continue
#                     if vcodec != "none" and acodec != "none":
#                         progressive.append(fmt)
#                     elif vcodec != "none" and acodec == "none":
#                         video_only.append(fmt)
#                     elif vcodec == "none" and acodec != "none":
#                         audio_only.append(fmt)
#                     else:
#                         others.append(fmt)

#                 return JSONResponse({
#                     "platform": platform,
#                     "title": info.get("title"),
#                     "uploader": info.get("uploader"),
#                     "thumbnail": info.get("thumbnail"),
#                     "duration": info.get("duration"),
#                     "progressive": progressive,
#                     "video_only": video_only,
#                     "audio_only": audio_only,
#                     "others": others,
#                 })

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/supported-platforms")
# def supported_platforms():
#     return {
#         "video_platforms": ["YouTube", "TikTok", "Twitter/X", "Facebook", "Instagram", "Reddit", "Twitch", "Vimeo", "Dailymotion"],
#         "social_platforms": ["Instagram", "Twitter/X", "Facebook", "Reddit", "LinkedIn", "Pinterest", "& others upto 1.8K+ plus platforms supported."],
#         "features": [
#             "Auto-platform detection",
#             "Bulk downloads",
#             "Stories download",
#             "Playlist support",
#             "High quality downloads",
#             "Metadata preservation",
#             "Subtitle downloads"
#         ],
#     }
