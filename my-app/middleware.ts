import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EXPIRE_TIME = 1 * 60 * 60 * 1000; // 1 hour

export function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const token = cookies.get("authToken");
  const tokenTimestamp = cookies.get("authTokenTimestamp");

  if (
    tokenTimestamp &&
    Date.now() - parseInt(tokenTimestamp.value) > EXPIRE_TIME
  ) {
    // Token expired
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("authToken");
    res.cookies.delete("authTokenTimestamp");
    return res;
  }

  if (!token && !req.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};