/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...other config
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;
