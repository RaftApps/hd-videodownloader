"use client"

export function HowToUse() {
  const steps = [
    {
      step: "1",
      title: "Copy the Video URL",
      description: "Find the video you want to download on YouTube, TikTok, Instagram, or another platform and copy its link.",
    },
    {
      step: "2",
      title: "Paste the URL",
      description: "Go to HD Video Downloader and paste the video link into the input box.",
    },
    {
      step: "3",
      title: "Choose Quality",
      description: "Select the video format and resolution you prefer, from standard to full HD.",
    },
    {
      step: "4",
      title: "Download Instantly",
      description: "Click the download button, and your video will be saved securely to your device.",
    },
  ]

  return (
    <section id="how-to-use" className="py-20 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
          How to Use HD Video Downloader
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((item) => (
            <div key={item.step} className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold">
                {item.step}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
