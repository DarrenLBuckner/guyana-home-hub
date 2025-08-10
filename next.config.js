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
