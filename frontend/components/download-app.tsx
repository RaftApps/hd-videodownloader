"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Monitor, Download, Star, Shield, Zap } from "lucide-react"

export function DownloadApp() {
  const features = [
    { icon: Zap, text: "Lightning fast downloads" },
    { icon: Shield, text: "100% safe & secure" },
    { icon: Star, text: "4.9/5 user rating" },
  ]

  return (
    <section id="download-app" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <Card className="liquid-glass-enhanced border border-pink-200 bg-white/80 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h2 className="text-4xl font-extrabold tracking-tight text-gray-800 mb-4">Download Our App</h2>
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    Get the most powerful video downloader right on your device. Available for all platforms with
                    exclusive mobile features.
                  </p>

                  <div className="space-y-3 mb-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                          <feature.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg px-8 py-3
                                 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg hover:scale-[1.02]
                                 transition-all flex items-center gap-2"
                    >
                      <Smartphone className="h-5 w-5" />
                      Download for Mobile
                    </Button>

                    <Button
                      variant="outline"
                      className="border-pink-300 text-gray-700 font-medium rounded-lg px-8 py-3
                                 hover:bg-pink-50 hover:border-pink-400 hover:shadow-md hover:scale-[1.02]
                                 transition-all flex items-center gap-2 bg-transparent"
                    >
                      <Monitor className="h-5 w-5" />
                      Download for Desktop
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500">Available for iOS, Android, Windows, and macOS</p>
                </div>
              </div>

              {/* Right Visual */}
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-8 lg:p-12 flex items-center justify-center">
                <div className="relative">
                  {/* Phone Mockup */}
                  <div className="w-64 h-96 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="h-6 bg-gray-50 flex items-center justify-between px-6 text-xs text-gray-600">
                        <span>9:41</span>
                        <span>100%</span>
                      </div>

                      {/* App Content */}
                      <div className="p-4 space-y-4">
                        <div className="text-center">
                          <Download className="h-12 w-12 text-pink-500 mx-auto mb-2" />
                          <h3 className="font-bold text-gray-800">HD Video Downloader</h3>
                        </div>

                        <div className="space-y-2">
                          <div className="h-12 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg flex items-center px-3">
                            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">YT</span>
                            </div>
                            <span className="ml-3 text-sm text-gray-700">YouTube</span>
                          </div>

                          <div className="h-12 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg flex items-center px-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">IG</span>
                            </div>
                            <span className="ml-3 text-sm text-gray-700">Instagram</span>
                          </div>

                          <div className="h-12 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg flex items-center px-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">FB</span>
                            </div>
                            <span className="ml-3 text-sm text-gray-700">Facebook</span>
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm py-2">
                          Start Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
                    <Download className="h-8 w-8 text-white" />
                  </div>

                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
