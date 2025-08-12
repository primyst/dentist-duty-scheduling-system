import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // or "auth" depending on your cookie name
  const role = req.cookies.get("role")?.value;   // "admin" or "staff"

  const { pathname } = req.nextUrl;

  // Public routes (no authentication needed)
  const publicPaths = ["/", "/login"];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based protection example:
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/staff") && role !== "staff") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except public ones
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};