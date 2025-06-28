const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      '@components/layout': path.resolve(__dirname, 'src/components/layout'),
    };
    return config;
  },
};

module.exports = nextConfig;
