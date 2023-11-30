import NextAuth from 'next-auth';

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    tokenType: string;
    expiresIn: string;
  }
}

declare module "next-auth" {
  interface User {
    access_token: string;
    token_type: string;
    expires_in: string;
  }

  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
    rsiap?: {
      access_token?: string | null
      token_type?: string | null
    }
    expires: ISODateString
  }
}
