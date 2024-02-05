import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

export default function withAuth(middleware: NextMiddleware, requireAuth: string[] = []) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    if (requireAuth.some(path => pathname.startsWith(path.replace('*', '')))) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      
      if (!token) {
        const url = new URL('/auth/login', req.url);
        return NextResponse.redirect(url);
      }
      
      // TODO : validate token to API server https://sim.rsiaaisyiyah.com/rsiap-api/api/auth/me
      // check token is valid or not from api server
      // if token is invalid, redirect to login page
      // if token is valid, continue to next middleware
      var res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.accessToken}`
        }
      });

      console.log(res);

      // res.status != 200
      if (res.status != 200) {
        const url = new URL('/auth/login', req.url);
        return NextResponse.redirect(url);
      }

      // res.status == 200
      const data = await res.json();
      if (!data.success) {
        const url = new URL('/auth/login', req.url);
        return NextResponse.redirect(url);
      }

      // token is valid
      // continue to next middleware
      console.log('token is valid');
      console.log(data);
    }

    return middleware(req, next);
  }
}