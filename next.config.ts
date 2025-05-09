/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: true, // Enable strict React mode
  swcMinify: true,
  images: {
    unoptimized: true,
  },
    eslint: {
    // Disable linting during production builds
    ignoreDuringBuilds: true,
    // or disable specific rules (if needed)
    rules: {
      "no-unused-vars": "off", // Example: disable no-unused-vars rule
    },
  },

}
 
module.exports = nextConfig