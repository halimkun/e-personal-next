import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import withAuth from "./middlewares/withAuth";

export async function mainMiddleware(req: NextRequest) {
    const res = NextResponse.next();
    return res;
}

// export const config = {
//     matcher: [
//         /*
//             * Match all request paths except for the ones starting with:
//             * - api (API routes)
//             * - auth login (login page)
//             * - _next/static (static files)
//             * - _next/image (image optimization files)
//             * - favicon.ico (favicon file)
//             */
//         '/((?!api|auth/login|_next/static|_next/image|favicon.ico).*)',
//     ]
// }

export default withAuth(mainMiddleware, [
    '/dashboard',
    '/surat/*',
    '/berkas/*',
    '/karyawan/*',
]);