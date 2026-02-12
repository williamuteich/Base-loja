import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  images: {
    qualities: [60, 75, 95],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'z4wkggkccsscw0kco00wwgs0.187.77.38.192.sslip.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'z4wkggkccsscw0kco00wwgs0.187.77.38.192.sslip.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bazarelegance.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'bazarelegance.com.br',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
