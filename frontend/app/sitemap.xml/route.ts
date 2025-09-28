// app/sitemap/route.ts

// Static URLs
const STATIC_URLS = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/privacy-policy", priority: "0.6", changefreq: "monthly" },
  { url: "/terms-and-conditions", priority: "0.6", changefreq: "monthly" }, // fixed clean slug
]

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const lastmod = new Date().toISOString()

  const staticEntries = STATIC_URLS.map(
    ({ url, priority, changefreq }) => `  <url>
    <loc>${origin}${encodeURI(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
