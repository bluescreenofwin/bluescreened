/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    POSTS_TABLE: process.env.POSTS_TABLE,
    REGION: process.env.REGION,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    BASE_URL: process.env.BASE_URL
  }
};

module.exports = nextConfig;
