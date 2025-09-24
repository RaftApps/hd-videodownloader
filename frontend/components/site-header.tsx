"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Menu,
  Download,
  // ChevronDown,
  // Music,
  // Video,
  // Smartphone,
} from "lucide-react"
import { useState } from "react"
// import { FaInstagram, FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa"

export function SiteHeader() {
  // const toolsLinks = [
  //   { href: "/youtube", label: "YouTube Downloader", icon: FaYoutube },
  //   { href: "/instagram", label: "Instagram Downloader", icon: FaInstagram },
  //   { href: "/facebook", label: "Facebook Downloader", icon: FaFacebook },
  //   { href: "/twitter", label: "Twitter Downloader", icon: FaTwitter },
  //   { href: "/tiktok", label: "TikTok Downloader", icon: Smartphone },
  //   { href: "/soundcloud", label: "SoundCloud Downloader", icon: Music },
  //   { href: "/vimeo", label: "Vimeo Downloader", icon: Video },
  // ]
  const [open, setOpen] = useState(false)
  const mainLinks = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#reviews", label: "Reviews" },
    { href: "/blog", label: "Blogs" },
    { href: "/#download-app", label: "Download App" },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <Download className="h-5 w-5 text-pink-600" />
            <span className="font-semibold tracking-wide text-gray-800">HD Video Downloader</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-5 text-sm text-gray-700 md:flex">
            {/* <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-pink-600 transition-colors">
                Tools <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 liquid-glass border-pink-200">
                {toolsLinks.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href} className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                      <tool.icon className="h-4 w-4" />
                      {tool.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}

            {mainLinks.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-pink-600 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full px-6 py-2.5
                         hover:from-pink-600 hover:to-rose-600 hover:shadow-md hover:scale-[1.02]
                         transition-all"
            >
              <Link href="/#home">Try Now</Link>
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-pink-200 bg-pink-50/80 text-gray-700 hover:bg-pink-100"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="liquid-glass border-pink-200 p-0 w-64 flex flex-col h-full max-h-screen overflow-y-auto">
                {/* Brand Header */}
                <div className="flex items-center gap-1.5 px-4 py-4 border-b border-pink-200">
                  <Download className="h-6 w-6 text-pink-600" />
                  <span className="font-semibold tracking-wide text-gray-800 text-lg">HD Video Downloader</span>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-gray-700">
                  {mainLinks.map((l) => (
                    <Link
                      key={l.href}
                      onClick={
                        ()=>setOpen(false) }
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <span className="text-sm">{l.label}</span>
                    </Link>
                  ))}

                  {/* Tools section in mobile */}
                  {/* <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Download Tools
                  </div>
                  {toolsLinks.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <tool.icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{tool.label}</span>
                    </Link>
                  ))} */}
                </nav>

                {/* CTA Button at Bottom */}
                <div className="mt-auto border-t border-pink-200 p-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full px-6 py-2.5
                               hover:from-pink-600 hover:to-rose-600 hover:shadow-md hover:scale-[1.02]
                               transition-all"
                  >
                    <Link onClick={()=> setOpen(false)} href="/">Try Now</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
