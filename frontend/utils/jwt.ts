import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;

export function getClientToken() {
  // payload minimal rakho
  return jwt.sign({ app: "video-downloader" }, JWT_SECRET, { expiresIn: "5m" });
}
