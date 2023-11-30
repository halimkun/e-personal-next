import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOption: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: "V8Xhbodz5VIzHnjHL9+nUHhXYOmeCahpOYwyYSNrtQ==",
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
        const response: any = await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }).then((res) => res.json());

        if (response.success) {
          return response;
        } else {
          return null;
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
      session.rsiap = session.rsiap ?? {}; // Create the `rsiap` object if it doesn't exist
      if ("accessToken" in token) {
        session.rsiap.access_token = token.accessToken;
        session.rsiap.token_type = token.tokenType;
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