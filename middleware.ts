import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const res = await fetch("http://localhost:3000/auth/me", {
      headers: {
        cookie: `token=${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Invalid");
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/conversations/:path*"],
};