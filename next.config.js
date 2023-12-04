/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.NEXT_PUBLIC_PORT,
    APP_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  }
}

module.exports = nextConfig
