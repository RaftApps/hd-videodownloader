"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaInstagram, FaTwitter, FaYoutube, FaHashtag } from "react-icons/fa"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: "Experience innovation with RaftApps LLC — building next-gen digital solutions for brands, startups, and enterprises.",
  copyright: "© 2025 - RaftApps LLC",
}


export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("skitbit-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.footer) {
          setContent(parsed.footer)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section className="text-white">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          {/* <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full m-10 px-6 py-2.5 hover:from-pink-600 hover:to-rose-600 hover:shadow-md hover:scale-[1.02] transition-all">
            Contact Us
        </div> */}
        </div>
      </div>

      {/* Download the app */}
      {/* <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
          
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-pink-300">STREAMLINE YOUR LAUNCHES</p>
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Preview &amp; approve high-end 3D visuals from anywhere
              </h3>
              <p className="mt-2 max-w-prose text-sm text-neutral-400">
                Review renders, leave timestamped comments, and approve scenes from anywhere. Using our revision &amp;
                collaboration tools
              </p>
            </div>

        
            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
                  <LazyVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%202-YFaCK7cEiHWSMRv8XEHaLCoYj2SUAi.mp4"
                    className="absolute inset-0 h-full w-full object-cover"
                    autoplay={true}
                    loop={true}
                    muted={true}
                    playsInline={true}
                    aria-label="Skitbit app preview - approvals made easy"
                  />
                  <div className="relative p-3">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="space-y-1 px-1">
                      <div className="text-5xl font-extrabold text-pink-300">Approvals Made Easy</div>
                      <p className="text-xs text-white/80">From feedback to approval in a single flow</p>
                      <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-pink-300">
                        Zero Hassle
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div> */}

      {/* Footer */}
      <footer className="border-t border-white/10 pb-20 md:pb-10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Image src="/icons/raftapps-color.svg" alt="RaftApps LLC logo" width={24} height={24} className="h-6 w-6" />
                <span className="text-xl font-semibold text-pink-600">RaftApps LLC</span>
              </div>
              <p className="max-w-sm text-sm text-neutral-400">{content.tagline}</p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Navigation</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {["Home", "Features", "Reviews", "Blog", "Download-App"].map((item) => (
                    <li key={item}>
                      <Link href={`/#${item.toLowerCase()}`} className="text-neutral-400 hover:text-pink-500">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Social media</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <FaTwitter className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://twitter.com/theskitbit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-pink-500"
                      aria-label="Follow skitbit on Twitter"
                    >
                      X/Twitter
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaYoutube className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://www.youtube.com/@skitbitinternational"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-pink-500"
                      aria-label="Subscribe to skitbit on YouTube"
                    >
                      YouTube
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaInstagram className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://instagram.com/theskitbit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-pink-500"
                      aria-label="Follow skitbit on Instagram"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaHashtag className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://threads.com/theskitbit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-pink-500"
                      aria-label="Follow skitbit on Threads"
                    >
                      Threads
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-neutral-400 hover:text-pink-500">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-neutral-400 hover:text-pink-500">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
