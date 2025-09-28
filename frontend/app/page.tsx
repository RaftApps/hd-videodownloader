import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Reviews } from "@/components/reviews"
import { DownloadApp } from "@/components/download-app"
import { AppverseFooter } from "@/components/footer"
import { FAQs } from "@/components/faqs" // ✅ new component
import Script from "next/script"
import Head from "next/head"
import { HowItWorks } from "@/components/how-it-works"
import { HowToUse } from "@/components/how-to-use"
// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  const siteUrl = "https://hdvideodownload.xyz"

  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/`,
    name: "HD Video Downloader | Free All-in-One Video Downloader (Fast & Secure)",
    description:
      "Download HD videos online from YouTube, TikTok, Instagram, Facebook, Twitter, and more. 100% free, fast, secure, and no watermark.",
    url: siteUrl,
    mainEntity: {
      "@type": "Organization",
      name: "HD Video Downloader",
      url: siteUrl,
      // sameAs: [
      //   "https://twitter.com/hdvideodownloader",
      //   "https://www.youtube.com/@hdvideodownloader",
      //   "https://instagram.com/hdvideodownloader",
      //   "https://threads.net/hdvideodownloader",
      // ],
    },
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is HD Video Downloader free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, HD Video Downloader is 100% free to use with no hidden fees or subscriptions required.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to install any software?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No installation required. Use our downloader directly in your browser—fast, safe, and secure.",
        },
      },
      {
        "@type": "Question",
        name: "Which platforms are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can download videos from YouTube, TikTok, Instagram, Facebook, Twitter, and many other platforms.",
        },
      },
      {
        "@type": "Question",
        name: "Is it safe to use HD Video Downloader?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We do not store your personal data, and all downloads are handled securely.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download videos in HD or Full HD quality?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! Our tool supports multiple resolutions, including HD and Full HD (when available).",
        },
      },
    ],
  }

  return (
    <>
      <Head>
        <title>HD Video Downloader | Free All-in-One Video Downloader (Fast & Secure)</title>
        <meta
          name="description"
          content="Download HD videos from YouTube, TikTok, Instagram, Facebook, and more. Free, fast, and secure video downloader with no watermarks."/>
        <meta name="keywords" content="video downloader, hd video downloader, free youtube downloader, download videos online, no watermark downloader" />
        <meta property="og:title" content="HD Video Downloader | Free All-in-One Tool" />
        <meta property="og:description" content="Download HD videos instantly from top platforms. Free, secure, and no watermark." />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HD Video Downloader | Free All-in-One Tool" />
        <meta name="twitter:description" content="Download HD videos instantly from YouTube, TikTok, and more. Free & secure." />
      </Head>

      <main className="min-h-[100dvh] text-gray-900">
        <SiteHeader />
        <Hero />
        <Features />
        <HowItWorks />
        <Reviews />
        <HowToUse/>
        <DownloadApp />
        <FAQs />
        <AppverseFooter />
      </main>
      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
    </>
  )
}
