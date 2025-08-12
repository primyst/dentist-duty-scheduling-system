import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: Request) {
  const { role, userId } = await req.json();

  // Create a token that expires in 1 hour
  const token = jwt.sign({ role, userId }, JWT_SECRET, { expiresIn: "1h" });

  const res = NextResponse.json({ success: true });

  // Save token in a cookie
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  // Save role separately for middleware convenience
  res.cookies.set("role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  return res;
}
