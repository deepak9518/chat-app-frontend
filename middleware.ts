import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./app/lib/api";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const res = await api.get("/auth/me");

    if (!res) {
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
