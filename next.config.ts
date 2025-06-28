import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@components'] = path.resolve(__dirname, 'src/components');
    return config;
  },
};

export default nextConfig;
