import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // protected routes
  const isProtected =
    req.nextUrl.pathname.startsWith("/conversations");

  // auth pages
  const isAuthPage =
    req.nextUrl.pathname === "/";

  // not logged in
  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL("/", req.url),
    );
  }

  // already logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(
      new URL("/conversations", req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/conversations/:path*"],
};