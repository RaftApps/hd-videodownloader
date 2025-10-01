// app/api/download/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const FASTAPI_SECRET_KEY = process.env.FASTAPI_SECRET_KEY!;
const API_URL = process.env.API_URL!;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN!;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-client-token",
        "Access-Control-Max-Age": "86400",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    // 1️⃣ validate JWT token
    const token = req.headers.get("x-client-token");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token" }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    // 2️⃣ validate origin
    const origin = req.headers.get("origin");
    if (!origin || origin !== ALLOWED_ORIGIN) {
      return NextResponse.json({ message: "Forbidden: Origin not allowed" }, { status: 403 });
    }

    // 3️⃣ parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Bad Request: Invalid JSON" }, { status: 400 });
    }

    // 4️⃣ forward to FastAPI
    const apiRes = await fetch(`${API_URL}/formats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": FASTAPI_SECRET_KEY,
      },
      body: JSON.stringify(body),
    });

    // 5️⃣ parse FastAPI response
    let apiData;
    try {
      apiData = await apiRes.json();
    } catch {
      return NextResponse.json({ message: "FastAPI Error: Invalid response" }, { status: 502 });
    }

    return NextResponse.json(apiData, {
      status: apiRes.status,
      headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
