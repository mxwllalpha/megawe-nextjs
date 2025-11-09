# Megawe - Indonesian Job Vacancy Aggregator

**Next.js 16 + Cloudflare Workers + MCP Integration**

## 🎯 Project Overview

Megawe adalah job vacancy aggregator untuk pasar Indonesia dengan fokus pada:
- Performance optimal dengan Next.js 16 App Router
- SEO excellence untuk job aggregator
- Real-time job listings dari Kemnaker API
- Modern development experience dengan MCP integration

## 🏗️ Tech Stack

### Core Framework
- **Next.js 16** dengan App Router + React Server Components
- **TypeScript** strict mode untuk type safety
- **Tailwind CSS** untuk styling dan responsive design
- **Cloudflare Workers** dengan OpenNext adapter

### Data & State Management
- **TanStack Query** untuk server state management
- **Zod** untuk runtime validation
- **Cloudflare D1** untuk job database
- **Cloudflare KV** untuk caching layer

### Development Tools
- **MCP Integration** untuk Cloudflare operations
- **GitHub CLI** untuk workflow automation
- **ESLint + Prettier** untuk code quality
- **TypeScript** untuk development experience

## 📁 Project Structure

```
megawe-nextjs/
├── app/
│   ├── (jobs)/
│   │   ├── page.tsx              # Job listings (SSG + ISR)
│   │   ├── [slug]/page.tsx       # Job detail pages
│   │   ├── search/page.tsx       # Job search dengan filters
│   │   └── layout.tsx            # Job-specific layout
│   ├── employers/
│   │   ├── [id]/page.tsx         # Employer profiles
│   │   └── layout.tsx
│   ├── api/
│   │   ├── jobs/route.ts         # Job data API
│   │   └── employers/route.ts    # Employer API
│   ├── sitemap.xml              # Dynamic sitemap
│   ├── rss.xml                  # Job RSS feed
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/
│   ├── ui/                      # Base UI components
│   ├── job/                     # Job-specific components
│   ├── search/                  # Search components
│   └── layout/                  # Layout components
├── lib/
│   ├── api/                     # API integration
│   ├── types/                   # TypeScript definitions
│   ├── utils/                   # Utility functions
│   └── schema/                  # SEO schema markup
├── public/
│   ├── icons/                   # Favicon and icons
│   └── robots.txt
├── wrangler.jsonc               # Cloudflare Workers config
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── CLAUDE.md                    # Project documentation
```

## 🚀 Development

### Prerequisites
- Node.js 22+
- Cloudflare account dengan Workers access
- GitHub CLI dengan proper authentication

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build & Preview
```bash
npm run build
npm run preview
```

### Deployment

#### **Cloudflare Pages (Recommended)**
```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages (via GitHub)
# 1. Push to GitHub
git add .
git commit -m "feat: Ready for Cloudflare Pages deployment"
git push origin main

# 2. Connect repository to Cloudflare Pages
# Visit: https://dash.cloudflare.com/pages
# Settings:
# - Build command: npm run build
# - Build output directory: .next
# - Node.js version: 20.x
```

#### **Cloudflare Workers (Alternative)**
```bash
npm run deploy
```

## 🎯 Features

### Job Aggregator Features
- **Job Listings**: Real-time dari Kemnaker API
- **Advanced Search**: Filter berdasarkan location, type, company
- **Job Details**: Comprehensive job information
- **Employer Profiles**: Company information dan benefits
- **RSS Feeds**: Job alerts dan notifications

### SEO Features
- **Schema Markup**: JobPosting, Organization, BreadcrumbList
- **Dynamic Sitemap**: Auto-update dengan new content
- **RSS Feed**: Job distribution untuk partners
- **Meta Tags**: Optimized untuk social sharing
- **Google Jobs**: Structured data untuk job search integration

### Performance Features
- **SSG + ISR**: Optimal balance static/dynamic content
- **Edge Caching**: Cloudflare KV untuk fast responses
- **Image Optimization**: Company logos dan assets
- **Smart Placement**: Edge optimization untuk global users

## 📊 SEO Strategy

### Job Aggregator Optimization
- **Job Titles**: Optimized dengan keywords + location
- **Structured Data**: Complete JobPosting schema
- **Content Freshness**: ISR untuk new job listings
- **Internal Linking**: Related jobs dan categories

### Technical SEO
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Mobile-First**: Responsive design dan performance
- **XML Sitemaps**: Comprehensive dengan proper priorities
- **RSS Feeds**: Multiple feeds untuk different job types

## 🔧 MCP Integration

### Cloudflare Operations via MCP
- **Deployment**: Automated via MCP + GitHub CLI
- **Monitoring**: Real-time performance tracking
- **Configuration**: Dynamic updates via MCP tools
- **Debugging**: Enhanced error tracking dan resolution

### Development Workflow
- **Real-time Monitoring**: Component performance tracking
- **Automated Testing**: SEO validation dan performance checks
- **CI/CD Integration**: GitHub Actions dengan MCP
- **Analytics**: User behavior dan conversion tracking

## 📈 Performance Targets

- **LCP**: < 2.5s (Large Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **PageSpeed**: 90+ mobile, 95+ desktop
- **Bundle Size**: < 500KB initial load

## 🛡️ Security & Privacy

- **No User Tracking**: Privacy-first approach
- **Secure API**: Proper authentication dan rate limiting
- **Data Validation**: Zod schemas untuk input sanitization
- **HTTPS Only**: Cloudflare automatic SSL

## 📝 Contributing

1. Follow conventional commit format
2. Maintain TypeScript strict mode
3. Ensure responsive design
4. Test SEO implementation
5. Update documentation

## 📄 License

MIT License - see LICENSE file for details.

## 🌐 Live Demo

- **Production**: https://megawe-nextjs.pages.dev (Coming Soon)
- **API Backend**: https://megawe-worker.tekipik.workers.dev
- **GitHub Repository**: https://github.com/mxwllalpha/megawe-nextjs

## 🔗 Related Projects

- **[megawe-worker](https://github.com/mxwllalpha/megawe-worker)**: API Gateway & Data Processing
- **[megawe-crawler](https://github.com/mxwllalpha/megawe-crawler)**: Job Data Crawler Service

---

**Author**: Maxwell Alpha
**GitHub**: https://github.com/mxwllalpha
**Started**: 2025-11-09
**Framework**: Next.js 16 + Cloudflare Pages + Workers
**Status**: 🚀 Production Ready