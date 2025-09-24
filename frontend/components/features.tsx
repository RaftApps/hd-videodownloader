"use client"

import { useEffect, useState } from "react"
import { Shield, Zap, Download, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "Why HD Video Downloader is the best downloader for you.",
  subtitle: "Discover our powerful video downloading features",
}

export function Features() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("HD Video Downloader-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) {
          setContent(parsed.features)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  const features = [
    {
      icon: Download,
      title: "Lightning Fast Downloads",
      description: "Download videos in seconds with our optimized servers and advanced compression technology.",
      category: "SPEED",
    },
    {
      icon: Shield,
      title: "100% Safe & Secure",
      description: "No malware, no ads, no tracking. Your privacy and security are our top priorities.",
      category: "SECURITY",
    },
    {
      icon: Zap,
      title: "Multiple Quality Options",
      description: "Choose from 144p to 4K quality. Download exactly what you need for any device.",
      category: "QUALITY",
    },
    {
      icon: Smartphone,
      title: "Works on All Devices",
      description: "Desktop, mobile, tablet - HD Video Downloader works seamlessly across all your devices.",
      category: "COMPATIBILITY",
    },
  ]

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
      <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl">
        {content.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {features.map((feature, index) => (
          <Card key={index} className="liquid-glass border border-pink-200 bg-white/70 backdrop-blur-xl">
            <CardHeader>
              <p className="text-[11px] tracking-widest text-pink-600 font-semibold">{feature.category}</p>
              <CardTitle className="mt-1 text-xl text-gray-800 flex items-center gap-3">
                <feature.icon className="h-6 w-6 text-pink-500" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
