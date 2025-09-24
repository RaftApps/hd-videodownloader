"use client"

import { Star, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function Reviews() {
  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Amazing tool! Downloaded my entire YouTube playlist in minutes. The quality is perfect and it's so easy to use.",
      platform: "YouTube User",
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment:
        "Finally found a downloader that actually works! No ads, no malware, just pure functionality. Highly recommended!",
      platform: "Tech Enthusiast",
    },
    {
      name: "Emma Rodriguez",
      rating: 5,
      comment:
        "The 4K downloads are crystal clear. Love that I can choose different quality options based on my needs.",
      platform: "Content Creator",
    },
    {
      name: "David Kim",
      rating: 5,
      comment: "Works perfectly on my phone and laptop. The interface is clean and the downloads are lightning fast.",
      platform: "Mobile User",
    },
    {
      name: "Lisa Thompson",
      rating: 5,
      comment: "Best video downloader I've ever used. Supports all the platforms I need and never fails to deliver.",
      platform: "Social Media Manager",
    },
    {
      name: "Alex Martinez",
      rating: 5,
      comment: "Incredible speed and reliability. Downloaded hundreds of videos without a single issue. 10/10!",
      platform: "Power User",
    },
  ]

  return (
    <section
      id="reviews"
      className="container mx-auto px-4 py-16 sm:py-20 bg-gradient-to-b from-pink-50/50 to-rose-50/50"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl mb-4">What Our Users Say</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands of satisfied users who trust HD Video Downloader for their downloading needs
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-800">4.9</span>
          <span className="text-gray-600">from 50,000+ reviews</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <Card key={index} className="liquid-glass border border-pink-200 bg-white/70 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.platform}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
