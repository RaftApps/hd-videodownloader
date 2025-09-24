"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  signedUrl: string; // Your signed video URL
  filename?: string; // Optional: default filename for download
}

const CustomVideoPlayer: React.FC<Props> = ({ signedUrl, filename = "video.mp4" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  // Load video once → reuse blob for playback + download
  useEffect(() => {
    const loadVideo = async () => {
      const response = await fetch(signedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    };
    loadVideo();
  }, [signedUrl]);

  // Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent || 0);
    }
  };

  // Seek video
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
    }
  };

  // Volume control
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    setVolume(vol);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Download file (reuse blob URL)
  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-2xl mx-auto bg-black rounded-lg shadow-lg overflow-hidden">
      {videoUrl ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Controls */}
          <div className="flex flex-col gap-2 p-3 bg-gray-900 text-white">
            {/* Progress bar */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="w-full"
            />

            <div className="flex items-center justify-between gap-2">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>

              {/* Volume */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolume}
              />

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              >
                ⛶
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
              >
                ⬇ Download
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 p-4">Loading video...</p>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
