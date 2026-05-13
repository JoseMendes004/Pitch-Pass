/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pitch-pass/types', '@pitch-pass/config'],
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

export default nextConfig
