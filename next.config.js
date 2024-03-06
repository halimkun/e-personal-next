/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
  },
  env: {
    PORT: process.env.NEXT_PUBLIC_PORT,
    APP_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,

    // API
    NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,

    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // Berkas
    NEXT_PUBLIC_BASE_BERKAS_URL: process.env.NEXT_PUBLIC_BASE_BERKAS_URL,
  },
};

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWA = require('@ducanh2912/next-pwa').default({
      dest: 'public',
      workboxOptions: {
        maximumFileSizeToCacheInBytes: 5000000,
      }
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};
