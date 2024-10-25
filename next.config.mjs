/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['localhost','www.notebookvideo.com'],
  },
  async rewrites() {
    return [
      {
        source: '/downloads/:path*', // Match all API routes
        destination: 'http://localhost:5000/downloads/:path*', // Proxy to the backend
      },
    ];
  },
};

export default nextConfig;
