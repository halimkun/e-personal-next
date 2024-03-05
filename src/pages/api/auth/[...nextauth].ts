import { NextAuthOptions } from 'next-auth';

import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOption: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60 * 60, // 15 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // request to API
        const { username, password } = credentials as { username: string, password: string };
        const response: any = await fetch(`${process.env.API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }).then((res) => res.json());

        if (response.success) {

          const jwt = require('jsonwebtoken');
          const decodedToken = jwt.decode(response.access_token);

          // if (decodedToken.kd_dep == null || decodedToken.kd_dep == '-' || decodedToken.kd_dep == undefined || decodedToken.kd_dep == '') {
          //   throw new Error('Department code is not valid or you the user is not allowed to access this application');
          // }

          // has menu on this application or not
          const menu = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/menu-epersonal?nik=${decodedToken.sub}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(res => res.json());
          
          if (menu.data.length == 0) {
            throw new Error('User is not allowed to access this application');
          }

          return response;
        } else {
          throw new Error("Invalid credentials");
        }
      },
    })
  ],

  callbacks: {
    jwt({ token, account, profile, user }) {
      if (account?.provider == 'credentials') {
        token.accessToken = user.access_token;
        token.tokenType = user.token_type;
      }

      return token;
    },

    // save to session
    async session({ session, token }: any) {
      const jwt = require('jsonwebtoken');
      const decodedToken = jwt.decode(token.accessToken);

      // if (decodedToken.kd_dep == null || decodedToken.kd_dep == '-' || decodedToken.kd_dep == undefined || decodedToken.kd_dep == '') {
      //   return null;
      // }

      session.rsiap = session.rsiap ?? {}; // Create the `rsiap` object if it doesn't exist
      if ("accessToken" in token) {
        session.rsiap.access_token = token.accessToken;
        session.rsiap.token_type = token.tokenType;
      }

      // {
      //   iss: 'http://192.168.100.33/rsiap-api-dev/api/auth/login',
      //   iat: 1709262658,
      //   exp: 1711854658,
      //   nbf: 1709262658,
      //   jti: 'MDce0Vclug6TdNKF',
      //   sub: 'humas',
      //   prv: '23bd5c8949f600adb39e701c400872db7a5976f7',
      //   isDokter: false,
      //   kd_dep: '-',
      //   nm_dep: '-'
      // }

      if (decodedToken) {
        session.user = {
          ...session.user,
          sub: decodedToken.sub,
          name: decodedToken.sub,
          dep: decodedToken.kd_dep,
          department: decodedToken.nm_dep
        };
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  }
}

export default NextAuth(authOption)