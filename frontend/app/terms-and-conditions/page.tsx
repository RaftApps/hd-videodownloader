import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions — HD Video Downloader | RaftApps LLC",
  description: "Official terms and conditions for using HD Video Downloader, a product of RaftApps LLC.",
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
  },
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <section className="text-black py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,72,153,0.08),transparent_55%)]" />
              <div className="relative space-y-12">

                {/* Header */}
                <header className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-pink-500">
                    Terms and Conditions
                  </h1>
                  <p className="text-neutral-600 text-lg">
                    Welcome to <strong>HD Video Downloader</strong>, a product of RaftApps LLC.  
                    By accessing or using this website and its services, you agree to these Terms and Conditions.  
                    Please read them carefully before using our platform.
                  </p>
                </header>

                {/* 1. Introduction */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">1. Introduction</h2>
                  <p className="text-neutral-600">
                    These Terms and Conditions govern your use of the HD Video Downloader website and related services.  
                    By using this product, you confirm that you accept these Terms in full and agree to comply with them.  
                    HD Video Downloader is operated and managed by <strong>RaftApps LLC</strong>.
                  </p>
                </section>

                {/* 2. Intellectual Property Rights */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">2. Intellectual Property Rights</h2>
                  <p className="text-neutral-600">
                    Unless otherwise specified, RaftApps LLC owns the intellectual property rights for all materials,  
                    source code, design assets, and content made available through HD Video Downloader.  
                    These rights remain the sole property of RaftApps LLC.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-neutral-500">
                    <li>You may not republish material from this website without prior written consent.</li>
                    <li>You may not reproduce, duplicate, or copy content for commercial use without permission.</li>
                    <li>You may not alter or modify any content without express approval from RaftApps LLC.</li>
                    <li>Some content may act as placeholders while the product is under continuous development.</li>
                  </ul>
                </section>

                {/* 3. Acceptable Use */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">3. Acceptable Use</h2>
                  <p className="text-neutral-600">
                    You agree not to use HD Video Downloader in any way that causes damage to the website or 
                    disrupts availability. You must not engage in unlawful, harmful, or fraudulent activities 
                    through our platform.
                  </p>
                </section>

                {/* 4. Limitation of Liability */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">
                    4. Limitation of Liability & Disclaimer
                  </h2>
                  <p className="text-neutral-600">
                    RaftApps LLC will not be liable for any direct, indirect, or consequential damages arising 
                    from the use of HD Video Downloader.  
                    The quality, performance, and results of content obtained using this tool may vary and are 
                    subjective in nature. Revisions or improvements are governed strictly by our{" "}
                    <Link href="/revisions" className="text-pink-500 underline">
                      revision policy
                    </Link>.
                  </p>
                </section>

                {/* 5. Changes to Terms */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">5. Changes to These Terms</h2>
                  <p className="text-neutral-600">
                    We may update these Terms and Conditions at any time. The latest version will always be available 
                    on this page, and continued use of HD Video Downloader after changes means you agree to the updated Terms.
                  </p>
                </section>

                {/* 6. Contact */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">6. Contact Us</h2>
                  <p className="text-neutral-600">
                    If you have any questions about these Terms, please reach out to us:
                  </p>
                  <p className="text-neutral-600">
                    Email:{" "}
                    <a href="mailto:contact@raftapps.com" className="text-pink-500 underline">
                      contact@raftapps.com
                    </a>
                  </p>
                  <p className="text-neutral-600">
                    Website:{" "}
                    <a href="https://raftapps.com" className="text-pink-500 underline">
                      https://raftapps.com
                    </a>
                  </p>
                </section>

              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  )
}
