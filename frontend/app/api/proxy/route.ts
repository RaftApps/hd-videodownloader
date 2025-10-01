import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("No URL provided", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // kuch sites ke liye zaroori hota hai
        "Accept": "*/*",
      },
    });

    // content-type pass karna important hai
    const contentType = response.headers.get("content-type") || "video/mp4";

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("Proxy failed", { status: 500 });
  }
}
