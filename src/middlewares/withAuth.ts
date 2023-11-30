import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

export default function withAuth(middleware: NextMiddleware, requireAuth: string[] = []) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    if (requireAuth.some(path => pathname.startsWith(path.replace('*', '')))) {
      const token = await getToken({ req, secret: 'V8Xhbodz5VIzHnjHL9+nUHhXYOmeCahpOYwyYSNrtQ==' });
      // TODO : validate token to API server https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/auth/me

      if (!token) {
        const url = new URL('/auth/login', req.url);
        return NextResponse.redirect(url);
      }
    }

    return middleware(req, next);
  }
}