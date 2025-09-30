// app/api/refresh-token/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ❌ secret ko kabhi NEXT_PUBLIC_ se expose mat karo
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const token = jwt.sign(
      { app: "video-downloader" },
      JWT_SECRET,
      { expiresIn: "5m" } // short expiry
    );

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Token generation error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
