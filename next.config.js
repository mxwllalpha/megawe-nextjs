/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Static export configuration for optimal Cloudflare Pages performance
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
    NEXT_PUBLIC_API_URL: 'https://megawe-worker.tekipik.workers.dev',
    NEXT_PUBLIC_WORKER_URL: 'https://megawe-worker.tekipik.workers.dev',
    NEXT_PUBLIC_PLATFORM: 'cloudflare-pages',
  },

  // Headers for security and performance (static export compatible)
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/rss.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=1800',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/job/:id',
        destination: '/jobs/:id',
        permanent: true,
      },
      {
        source: '/company/:id',
        destination: '/companies/:id',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;