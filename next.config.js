/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Enable ESLint checks during build (warnings will still allow build to succeed)
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Note: For subdomain routing (crm.yourdomain.com), configure at hosting level:
  // - Vercel: Use rewrites in vercel.json
  // - Other hosts: Configure DNS and server rewrites/routing
  // The /crm route is ready to be served at crm.yourdomain.com when configured
}

module.exports = nextConfig
