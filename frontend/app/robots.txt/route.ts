// app/robots/route.ts
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const ROBOTS_VERSION = "1.1.0"

  const lines = [
    `# robots.txt for hdvideodownload.xyz — SEO & Crawl Optimized`,
    `# Version: ${ROBOTS_VERSION}`,
    "",
    "User-agent: *",
    "Allow: /",
    "",
    // Important: no disallow for videos/downloads so Google can index
    `Sitemap: ${origin}/sitemap.xml`,
  ].join("\n")

  return new Response(lines, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Version": ROBOTS_VERSION,
    },
  })
}
