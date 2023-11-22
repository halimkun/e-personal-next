import { NextResponse, NextRequest } from "next/server";
import { getCookie } from "cookies-next";

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const { pathname, origin } = req.nextUrl;

    // Hanya lakukan middleware pada path tertentu
    if (pathname !== '/auth/login') {
        try {
            const token = getCookie('access_token', { res: new NextResponse(), req });

            if (!token) {
                // Jika tidak ada token, arahkan pengguna ke halaman login
                return NextResponse.redirect(`${origin}/auth/login`);
            }

            const isValid = await validateToken({ token, req });

            if (!isValid.success) {
                // Jika token tidak valid, arahkan pengguna ke halaman login
                return NextResponse.redirect(`${origin}/auth/login`);
            }

            const user = isValid.data;
            const userString = JSON.stringify(user);

            // Simpan data user ke cookie
            const response = NextResponse.redirect(origin);
            response.cookies.set('user', userString, {
                maxAge: 60 * 60 * 24,
                path: '/',
            });

        } catch (error) {
            console.error('Error in authentication middleware:', error);
            // Tangani kesalahan dengan mengarahkan pengguna ke halaman login
            return NextResponse.redirect(`${origin}/auth/login`);
        }
    }

    // Lanjutkan ke middleware atau handler berikutnya
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
            * Match all request paths except for the ones starting with:
            * - api (API routes)
            * - auth login (login page)
            * - _next/static (static files)
            * - _next/image (image optimization files)
            * - favicon.ico (favicon file)
            */
        '/((?!api|auth/login|_next/static|_next/image|favicon.ico).*)',
    ]
}

// Fungsi untuk validasi token
async function validateToken({ token, req }: { token: string, req: NextRequest }) {
    const response = await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/auth/me', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return data;
}
