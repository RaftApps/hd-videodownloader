// app/sitemap/route.ts
const URLS = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/privacy-policy", priority: "0.6", changefreq: "monthly" },
  { url: "/t&c", priority: "0.6", changefreq: "monthly" },
]

// Add dynamic video pages if you ever index them
// const VIDEOS = [{ slug: 'funny-cats' }, { slug: 'music-video-123' }]

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const lastmod = new Date().toISOString()

  const urlEntries = URLS.map(
    ({ url, priority, changefreq }) => `  <url>
    <loc>${origin}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
