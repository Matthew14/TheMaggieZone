/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'the-maggie-zone-images.s3.eu-west-1.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
