/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tăng giới hạn kích thước file upload
  serverRuntimeConfig: {
    maxFileSize: '10mb',
  },
  publicRuntimeConfig: {
    maxFileSize: '10mb',
  },
}

module.exports = nextConfig
