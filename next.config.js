/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Static export configuration for optimal Cloudflare Pages performance
  // API calls will be handled by Pages Functions
  output: 'export',
  trailingSlash: true,
  distDir: 'out',

  // Image optimization for static export
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Experimental features for Next.js 16
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // SSG and ISR configuration
  generateEtags: true,
  poweredByHeader: false,

  // Environment variables for Cloudflare Pages
  env: {
    NEXT_PUBLIC_APP_NAME: 'Megawe',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Indonesian Job Vacancy Aggregator',
    // In production, use local Pages Functions endpoints (no base URL needed)
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' ? '' : 'https://megawe-worker.tekipik.workers.dev',
    NEXT_PUBLIC_WORKER_URL: process.env.NODE_ENV === 'production' ? '' : 'https://megawe-worker.tekipik.workers.dev',
    NEXT_PUBLIC_PLATFORM: 'cloudflare-pages',
  },

  // Note: redirects and headers are not supported with static export
  // These will be handled at the Cloudflare Pages level if needed
};

module.exports = nextConfig;