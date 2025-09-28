"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, Download } from "lucide-react"
import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaReddit,
  FaVimeo,
  FaSoundcloud,
  FaPinterest,
  FaHashtag,
} from "react-icons/fa"
import { SiDailymotion, SiTwitch, SiVk, SiXiaohongshu } from "react-icons/si"
import { MdVideoLibrary } from "react-icons/md"

export function Hero() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [videoData, setVideoData] = useState<any>(null)
  const [error, setError] = useState("")

  const urlRegex =
    /^(https?:\/\/)?(www\.)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleFetchFormats = async () => {
    if (!urlRegex.test(url)) {
      setError("Please enter a valid url")
      return
    }

    setLoading(true)
    const payload = { url }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/formats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
          body: JSON.stringify(payload),
        }
      )

      const bodyText = await res.text()

      if (!res.ok) {
        let message = "Something went wrong"
        try {
          const parsed = JSON.parse(bodyText)
          if (parsed.detail?.message) {
            message = parsed.detail.message
          } else if (parsed.message) {
            message = parsed.message
          }
        } catch {
          message = bodyText
        }
        throw new Error(message)
      }

      const data = JSON.parse(bodyText)
      if (data["status"] == "Error" || data["status"] == "error")
        throw new Error("An error occured while proccessing url.")

      setVideoData(data)
    } catch (e) {
      if (e instanceof Error) {
        setError(`${e}`)
      } else {
        setError("An unknown error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          {/* Heading */}
          <div className="mb-5 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-pink-600 flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm uppercase font-semibold tracking-[0.25em] text-pink-600/80">
              HD Video Downloader
            </p>
          </div>

          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">ALL-IN-ONE</span>
            <span className="block text-pink-600 drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]">
              VIDEO DOWNLOADER
            </span>
            <span className="block">FOR EVERYONE</span>
          </h1>

          {
            <div className="w-full max-w-2xl flex items-center gap-2 mt-20">
              <form
                action="/"
                method="GET"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleFetchFormats()
                }}
                className="flex w-full"
              >
                <input
                  type="text"
                  name="video-url"
                  autoComplete="on"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your video URL here..."
                  className="flex-1 rounded-lg border border-pink-500 px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </form>

              <Button
                onClick={handleFetchFormats}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-md px-6 py-5 hover:from-pink-600 hover:to-rose-600 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="block sm:hidden">
                  <ArrowDownToLine size={20} />
                </span>
                <span className="hidden sm:block">
                  {loading ? "Loading..." : "Download"}
                </span>
              </Button>
            </div>
          }

          {error && (
            <div className="mt-4 w-full max-w-2xl mx-auto bg-red-50 border border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-sm flex items-center gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z"
                ></path>
              </svg>
              <span className="text-sm">
                {error.split("\n")[0]} <br /> {error.split("\n")[1]}
              </span>
            </div>
          )}

          {/* ✅ Results */}
          {videoData && (
            <div className="mt-10 max-w-4xl">
              {/* ✅ Video Info */}
              <div className="flex-col sm:flex-row items-center gap-6 mb-10 border rounded-lg p-4 shadow-sm">
                <img
                  src={videoData.thumbnail}
                  alt={videoData.title}
                  className="w-100% h-100% object-cover rounded-lg shadow-md"
                />
                <div className="flex-1 mt-10">
                  <h2 className="text-xl font-bold mb-1">{videoData.title}</h2>
                  <p className="text-sm text-gray-600">
                    ⏱️ Duration:{" "}
                    {(videoData.duration / 60).toFixed(2) || "Unknown"} mins
                  </p>
                  {videoData.uploader && (
                    <p className="text-sm text-gray-600">
                      Uploader: {videoData.uploader}
                    </p>
                  )}
                </div>
              </div>

              {/* Progressive */}
              {videoData.progressive?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-3">
                    🎬 Video with Audio
                  </h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {videoData.progressive.map((f: any, i: number) => (
                      <FormatCard key={i} format={f} />
                    ))}
                  </div>
                </div>
              )}

              {/* Video Only */}
              {videoData.video_only?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-3">🎥 Video Only</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {videoData.video_only.map((f: any, i: number) => (
                      <FormatCard key={i} format={f} />
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Only */}
              {videoData.audio_only?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-3">🎧 Audio Only</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {videoData.audio_only.map((f: any, i: number) => (
                      <FormatCard key={i} format={f} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Supported Sites */}
          <div className="mt-16 ">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Supported Platforms
            </h2>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {supportedSites.map((site, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-4 text-center"
                >
                  <div className="text-3xl text-pink-600 mb-2">{site.icon}</div>
                  <p className="text-sm font-medium text-gray-700">
                    {site.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ✅ Reusable Format Card */
function FormatCard({ format }: { format: any }) {
  return (
    <div className="rounded-lg border p-4 shadow-sm flex flex-col justify-between">
      <div>
        <p className="font-medium">
          {format.resolution || format.audioQuality || "Unknown"} •{" "}
          {format.ext?.toUpperCase()}
        </p>
        <p className="text-xs text-gray-600">
          {format.filesize
            ? `${(format.filesize / (1024 * 1024)).toFixed(2)} MB`
            : "Unknown size"}
        </p>
      </div>
      <Button
        className="mt-3 inline-block text-center rounded-md bg-pink-600 px-3 py-1 text-white text-sm font-medium hover:bg-pink-700"
        onClick={() => window.open(
          encodeURIComponent(format.url),
          "_blank"
        )}
      >
        Download
      </Button>
    </div>
  )
}

const supportedSites = [
  { name: "YouTube", icon: <FaYoutube /> },
  { name: "Facebook", icon: <FaFacebook /> },
  { name: "Instagram", icon: <FaInstagram /> },
  { name: "Twitter", icon: <FaTwitter /> },
  { name: "TikTok", icon: <FaTiktok /> },
  { name: "Reddit", icon: <FaReddit /> },
  { name: "Threads", icon: <FaHashtag /> },
  { name: "Dailymotion", icon: <SiDailymotion /> },
  { name: "Vimeo", icon: <FaVimeo /> },
  { name: "VK", icon: <SiVk /> },
  { name: "SoundCloud", icon: <FaSoundcloud /> },
  { name: "Xiaohongshu", icon: <SiXiaohongshu /> },
  { name: "Twitch", icon: <SiTwitch className="w-6 h-6 text-purple-600" /> },
  { name: "Pinterest", icon: <FaPinterest className="w-6 h-6 text-red-600" /> },
  { name: "And 1800+ More", icon: <MdVideoLibrary className="w-6 h-6 text-gray-600" /> },
]
