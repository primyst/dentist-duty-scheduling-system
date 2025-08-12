import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // same key used when creating token

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string; exp: number };

    // Role-based restrictions
    if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (req.nextUrl.pathname.startsWith("/staff") && decoded.role !== "staff") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Token expiry check (jwt.verify already throws if expired, but extra check here)
    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch {
    // If invalid or expired token → redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};