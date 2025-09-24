// app/robots/route.ts
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const ROBOTS_VERSION = "1.0.0"

  const lines = [
    `# robots.txt for HD Video Downloader — SEO & AI Crawlers Optimized`,
    `# Version: ${ROBOTS_VERSION}`,
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /privacy-policy",
    "Disallow: /t&c",
    "Disallow: /admin/",
    "Disallow: /api/",
    "Disallow: /downloads/",
    "Disallow: /videos/",
    "",
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
