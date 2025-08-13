import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EXPIRE_TIME = 1000 * 60 * 60; // 1 hour

export function middleware(req: NextRequest) {
  const { cookies, nextUrl } = req;
  const token = cookies.get("authToken");

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const tokenTimestamp = cookies.get("authTokenTimestamp");
  if (tokenTimestamp && Date.now() - parseInt(tokenTimestamp) > EXPIRE_TIME) {
    // Token expired
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("authToken");
    res.cookies.delete("authTokenTimestamp");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/staff/:path*", "/requests/:path*", "/stats/:path*"],
};