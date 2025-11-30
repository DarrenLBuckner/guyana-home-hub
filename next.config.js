const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        // Allow CORS for email signup API from marketing sites
        source: '/api/email-signup',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://guyanahomehub.com,https://jamaicahomehub.com,https://guyana-home-hub.vercel.app'
              : '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400'
          }
        ]
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@components/layout': path.resolve(__dirname, 'src/components/layout'),
    };
    
    // Exclude backend folder from compilation
    config.resolve.alias['@backend'] = false;
    
    return config;
  },
};

module.exports = nextConfig;
