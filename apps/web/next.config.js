/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/sui'],
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig 