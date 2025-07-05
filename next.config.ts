/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  // Optional: If you want to enable TypeScript ignore during development (NOT recommended for production)
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
