import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Particles } from "@/components/particles"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metadata = {
    title: "HD Video Downloader | Fast, Free & Secure Video Downloads",
    description:
      "Download videos from YouTube, TikTok, Instagram, Facebook and more. Fast, free, and secure video downloader with no watermarks.",
    keywords:
      "video downloader, YouTube downloader, TikTok downloader, Instagram videos, Facebook videos, HD video download, free video downloader",
    url: "https://hdvideodownload.xyz",
    image: "https://hdvideodownload.xyz/og-image.png",
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HD Video Downloader",
    url: metadata.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${metadata.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <link rel="canonical" href={metadata.url} />

        {/* Open Graph */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:image" content={metadata.image} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MMV51XRQ7Y" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MMV51XRQ7Y');
          `}
        </Script>

        {/* JSON-LD */}
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(jsonLd)}
        </Script>

        {/* Dynamic Favicon */}
        <Script id="dynamic-favicon" strategy="beforeInteractive">
          {`
            function updateFavicon() {
              const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const faviconHref = darkMode ? '/icons/raftapps.svg' : '/icons/favicon-dark.svg';
              let link = document.querySelector("link[rel~='icon']");
              if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
              }
              link.href = faviconHref;
            }
            updateFavicon();
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
          `}
        </Script>
      </head>
      <body>
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          <Particles color="#3b82f6" count={60} speed={0.3} opacity={0.4} />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
