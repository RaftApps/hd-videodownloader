import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export const dynamic = "force-dynamic"; // 👈 force runtime

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const token = jwt.sign(
      {
        app: "video-downloader", rnd: Math.random().toString(36).substring(2), // unique random value
        iat: Math.floor(Date.now() / 1000),           // issue time
      }, // 👈 unique payload
      JWT_SECRET,
      { expiresIn: "5m" }
    );
    console.log(`Created new token ${token}`)

    return NextResponse.json(
      { token },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("Token generation error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
