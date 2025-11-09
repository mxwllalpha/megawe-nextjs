/**
 * OpenNext Configuration for Cloudflare Workers
 *
 * This file configures the OpenNext adapter for optimal performance
 * with Cloudflare Workers and Next.js 16 App Router.
 */

export default {
  // App Router configuration
  appDir: 'app',

  // Build optimization
  buildCommand: 'npm run build',
  outputDir: '.next',

  // Cloudflare Workers specific configuration
  worker: {
    // Enable streaming for better performance
    streaming: true,

    // Enable edge functions for API routes
    edgeFunctions: true,

    // Optimize for Cloudflare Workers runtime
    optimizeForWorkers: true,

    // Compatibility settings
    nodejsCompat: true,
  },

  // Static file optimization
  static: {
    // Cache static assets at edge
    cacheTTL: 31536000, // 1 year

    // Compress static files
    compression: true,

    // Enable HTTP/2 push for critical resources
    http2Push: true,
  },

  // Image optimization
  images: {
    // Use Cloudflare Image Resizing
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],

    // Optimize images for web
    formats: ['image/webp', 'image/avif'],

    // Enable blur placeholder
    placeholder: 'blur',
  },

  // Route handling
  routes: {
    // Static routes for job listings (SSG)
    static: [
      '/',
      '/about',
      '/contact',
      '/companies',
      '/sitemap.xml',
      '/robots.txt',
    ],

    // Dynamic routes with ISR
    isr: [
      '/jobs/[slug]',
      '/companies/[id]',
      '/locations/[slug]',
      '/search',
    ],

    // Edge functions for real-time data
    edge: [
      '/api/**',
      '/jobs/search',
      '/jobs/filters',
    ],
  },

  // Caching strategy
  cache: {
    // KV store for API responses
    apiCache: {
      ttl: 900, // 15 minutes
      keyPrefix: 'megawe-api-v1',
    },

    // Cache job listings
    jobsCache: {
      ttl: 3600, // 1 hour
      keyPrefix: 'megawe-jobs-v1',
    },

    // Cache search results
    searchCache: {
      ttl: 1800, // 30 minutes
      keyPrefix: 'megawe-search-v1',
    },
  },

  // Environment variables
  env: {
    // Cloudflare Workers environment
    NEXT_PUBLIC_PLATFORM: 'cloudflare-workers',
    NEXT_PUBLIC_WORKERS: 'true',

    // API configuration
    NEXT_PUBLIC_API_URL: 'https://megawe-nextjs.mxwllalpha.workers.dev/api',

    // Feature flags
    NEXT_PUBLIC_ANALYTICS_ENABLED: 'true',
    NEXT_PUBLIC_SEO_ENABLED: 'true',
  },

  // Middleware configuration
  middleware: {
    // Enable middleware for auth and analytics
    enabled: true,

    // Middleware execution order
    order: ['analytics', 'auth', 'cors'],
  },

  // Development configuration
  development: {
    // Enable hot reload
    hotReload: true,

    // Show performance metrics
    showMetrics: true,

    // Enable debugging
    debug: process.env.NODE_ENV === 'development',
  },

  // Production optimization
  production: {
    // Minify code
    minify: true,

    // Remove console logs
    removeConsole: true,

    // Optimize bundles
    splitChunks: true,

    // Enable compression
    gzip: true,
    brotli: true,
  },

  // Security settings
  security: {
    // Enable security headers
    securityHeaders: true,

    // CSRF protection
    csrf: true,

    // Rate limiting
    rateLimit: {
      // API endpoints
      '/api/**': {
        requests: 100,
        window: '1m',
      },

      // Search endpoints
      '/search': {
        requests: 50,
        window: '1m',
      },
    },
  },

  // Monitoring and analytics
  monitoring: {
    // Enable OpenTelemetry
    tracing: true,

    // Error tracking
    errorTracking: true,

    // Performance monitoring
    performanceMetrics: true,

    // Custom events
    customEvents: [
      'job_view',
      'job_search',
      'job_application',
      'company_view',
    ],
  },

  // Experimental features
  experimental: {
    // Enable partial prerendering
    ppr: true,

    // Enable server actions
    serverActions: true,

    // Enable streaming SSR
    streamingSSR: true,

    // Edge runtime for API routes
    edgeRuntime: 'edge',
  },

  // Custom headers for SEO and performance
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=900, s-maxage=900',
        },
      ],
    },
    {
      source: '/(robots.txt|sitemap.xml|rss.xml)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, s-maxage=86400, immutable',
        },
      ],
    },
  ],

  // Redirects for SEO
  redirects: [
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
  ],

  // Rewrite rules
  rewrites: [
    {
      source: '/feed',
      destination: '/rss.xml',
    },
    {
      source: '/sitemap',
      destination: '/sitemap.xml',
    },
  ],
}