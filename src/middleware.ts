// export { default } from "next-auth/middleware"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // console.log(req.nextauth.token)
  },
  {
    callbacks: {
      authorized: async ({ req, token }) => {

        if (token) {
          // Decode JWT Token
          // const jwt = require('jsonwebtoken');
          // const decodedToken = jwt.decode(token.accessToken);

          return true
        }

        return false
      },
    },
  }
)



export const config = {
  matcher: [
    /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - public routes
        * - auth login (login page)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        */
    '/((?!api|public|auth/login|_next/static|_next/image|favicon.ico).*)',
  ]
}


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server"
// import { getServerSession } from "next-auth/next"

// import withAuth from "./middlewares/withAuth";
// import authOption from "./pages/api/auth/[...nextauth]";

// export async function mainMiddleware(req: NextRequest) {
//     const res = NextResponse.next();
//     const session = await getServerSession({ req, ...authOption });

//     return res;
// }

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

// export default withAuth(mainMiddleware, [
//     '/dashboard',
//     '/surat/*',
//     '/berkas/*',
//     '/karyawan/*',
// ]);