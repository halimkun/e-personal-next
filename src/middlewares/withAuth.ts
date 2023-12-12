import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

export default function withAuth(middleware: NextMiddleware, requireAuth: string[] = []) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    if (requireAuth.some(path => pathname.startsWith(path.replace('*', '')))) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      // TODO : validate token to API server https://sim.rsiaaisyiyah.com/rsiap-api/api/auth/me

      if (!token) {
        const url = new URL('/auth/login', req.url);
        return NextResponse.redirect(url);
      }
    }

    return middleware(req, next);
  }
}