const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
  ignoreDuringBuilds: true,
},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@components/layout': path.resolve(__dirname, 'src/components/layout'),
    };
    return config;
  },
};

module.exports = nextConfig;
