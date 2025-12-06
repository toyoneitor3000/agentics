import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  webpack: (config) => {
    config.resolve.alias['public'] = path.resolve(__dirname, 'public/');

    // Exclude _src_unused directory from compilation
    config.module.rules.push({
      test: /\.(tsx?|jsx?)$/,
      exclude: [/node_modules/, /_src_unused/],
    });

    return config;
  },
};

export default nextConfig;
