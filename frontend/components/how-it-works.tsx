export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Copy the Video Link
            </h3>
            <p className="text-gray-600">
              Go to YouTube, TikTok, Instagram, Facebook, or any supported platform and copy the video URL.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Paste into HD Video Downloader
            </h3>
            <p className="text-gray-600">
              Paste the copied link into our input box above. Our system will instantly fetch available download options.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Download in HD Quality
            </h3>
            <p className="text-gray-600">
              Select your preferred format and resolution (HD, Full HD, or audio) and download instantly — free & secure.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
