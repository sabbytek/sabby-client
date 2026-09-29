import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/api/session";

/**
 * Coarse route guard for navigation only. The marker cookie just says a login
 * happened in this browser; real authorization is the backend rejecting API
 * calls without a valid bearer token (handled in the API transport).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname.startsWith("/dashboard") && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
