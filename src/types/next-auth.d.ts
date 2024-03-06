import NextAuth from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    tokenType: string;
    expiresIn: string;
  }
}

declare module 'next-auth' {
  interface User {
    access_token: string;
    token_type: string;
    expires_in: string;
  }

  interface Session {
    user?: {
      sub?: string;
      name?: string;
      email?: string;
      dep?: string;
      department?: string;
    };
    rsiap?: {
      access_token?: string | null;
      token_type?: string | null;
    };
    expires: ISODateString;
  }
}
