"use client";

import Link from "next/link";

export default function BlogSidebar() {
  return (
    <nav className="space-y-3 text-sm">
      <h3 className="font-bold text-pink-600">Guides</h3>
      <ul className="space-y-2">
        <li><Link href="/blog/youtube-guide">YouTube Guide</Link></li>
        <li><Link href="/blog/tiktok-tips">TikTok Tips</Link></li>
        <li><Link href="/blog/instagram-reels">Instagram Reels</Link></li>
        <li><Link href="/blog/facebook-videos">Facebook Videos</Link></li>
        <li><Link href="/blog/soundcloud">SoundCloud Music</Link></li>
      </ul>
    </nav>
  );
}
