from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import re

from pydantic import BaseModel
import yt_dlp
import instaloader
import uuid

app = FastAPI(title="Universal Downloader API", version="0.0.2")

API_KEY = "my-secret-key-hdx"  # change this to your own
API_KEY_HEADER = "api-key"  # the header name users should send

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# ----------------------------
# Main format extraction
# ----------------------------
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/140.0.0.0 Mobile Safari/537.36"
    ),
    "Referer": "https://ssvid.net/",
    "Sec-CH-UA": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
    "Sec-CH-UA-Mobile": "?1",
    "Sec-CH-UA-Platform": '"Android"',
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "*/*",
    "Connection": "keep-alive",
}

def get_formats_yt(url: str):
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "http_headers":{
    "User-Agent": (
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/140.0.0.0 Mobile Safari/537.36"
    ),
    "Referer": "https://ssvid.net/",
    "Sec-CH-UA": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
    "Sec-CH-UA-Mobile": "?1",
    "Sec-CH-UA-Platform": '"Android"',
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "*/*",
    "Connection": "keep-alive",
},
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
            if fmt["ext"] in ["mhtml", "webpage", "dash"]:
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

        # Profile recent posts
        # else:
        #     username = extract_instagram_username(url)
        #     profile = instaloader.Profile.from_username(loader.context, username)

        #     urls = []
        #     count = 0
        #     for post in profile.get_posts():
        #         if count >= 10:
        #             break
        #         urls.append(post.video_url if post.is_video else post.url)
        #         count += 1

        #     return {
        #         "platform": platform,
        #         "title": f"{username} - Recent Posts",
        #         "uploader": username,
        #         "thumbnail": urls[0] if urls else None,
        #         "duration": None,
        #         "progressive": [{"url": u, "type": "video" if u.endswith(".mp4") else "image"} for u in urls],
        #         "video_only": [],
        #         "audio_only": [],
        #         "others": []
        #     }

    except Exception as e:
        return {"status": "error", "message": f"Instagram error: {str(e)}"}
    
# ----------------------------
# Endpoints
# ----------------------------

@app.post("/formats")
async def formats(
    req: URLRequest, 
    api_key: str | None = Header(None, alias=API_KEY_HEADER)
):
    verify_api_key(api_key)
    platform = detect_platform(req.url)
    if platform == "instagram":
        return JSONResponse(get_formats_instagram(req.url))
    return JSONResponse(get_formats_yt(req.url))

@app.post("/playlist-formats")
async def playlist_formats(
    req: PlaylistRequest, 
    api_key: str | None = Header(None, alias=API_KEY_HEADER)
):
    verify_api_key(api_key)
    task_id = str(uuid.uuid4())
    tasks_progress[task_id] = {"total": 0, "completed": 0, "results": [], "errors": [], "status": "running"}

    ydl_opts = {"quiet": True, "no_warnings": True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(req.url, download=False)
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
#                     if fmt["ext"] in ["mhtml", "webpage", "dash"]:
#                         continue
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
