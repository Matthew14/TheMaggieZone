/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: ['the-maggie-zone-images.s3.eu-west-1.amazonaws.com'],
  },
}

module.exports = nextConfig
