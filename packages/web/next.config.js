/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  cleanDistDir: true,
  distDir: 'dist',
};

module.exports = nextConfig;
