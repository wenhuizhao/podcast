/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
