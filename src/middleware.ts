import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/(auth)"];
  const isPublicRoute = publicRoutes.some(route => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route.replace("/(auth)", "/login"));
  });

  // Protected routes
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Get tokens from cookies
  const accessToken = request.cookies.get("sabyy_access_token")?.value;
  const userStr = request.cookies.get("sabyy_user")?.value;

  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !accessToken && !userStr) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If accessing login page while authenticated, redirect to dashboard
  if (pathname === "/login" && accessToken && userStr) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
