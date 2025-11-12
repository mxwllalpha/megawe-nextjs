/**
 * Location SSG Page
 *
 * Generates static location pages with filtered job listings:
 * - SSG (Static Site Generation) from D1 database
 * - SEO optimized location pages
 * - Job filtering by location
 */

import { Env, DatabaseJob } from '../../types'

// Location template
const LOCATION_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{locationTitle}} - Lowongan Kerja | Megawe</title>
  <meta name="description" content="{{description}}">
  <meta name="keywords" content="{{keywords}}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://megawe.net/locations/{{slug}}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{locationTitle}} - Lowongan Kerja | Megawe">
  <meta property="og:description" content="{{description}}">
  <meta property="og:url" content="https://megawe.net/locations/{{slug}}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Megawe">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{locationTitle}} - Lowongan Kerja | Megawe">
  <meta name="twitter:description" content="{{description}}">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
          }
        }
      }
    }
  </script>

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
  {{jsonld}}
  </script>
</head>
<body class="bg-gray-50 dark:bg-gray-900">
  <!-- Navigation -->
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-blue-600 dark:text-blue-400">
            Megawe
          </a>
        </div>
        <div class="hidden md:flex space-x-8">
          <a href="/" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Beranda</a>
          <a href="/jobs" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Lowongan</a>
          <a href="/companies" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Perusahaan</a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section with Map -->
  <div class="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">{{locationTitle}}</h1>
        <p class="text-xl text-blue-100 mb-6">{{description}}</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-2xl font-bold">{{totalJobs}}</div>
            <div class="text-sm text-blue-100">Lowongan Tersedia</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-2xl font-bold">{{totalCompanies}}</div>
            <div class="text-sm text-blue-100">Perusahaan</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-2xl font-bold">{{averageSalary}}</div>
            <div class="text-sm text-blue-100">Gaji Rata-rata</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-2xl font-bold">{{topCategoriesCount}}</div>
            <div class="text-sm text-blue-100">Kategori</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <main class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Popular Categories in This Location -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kategori Populer di {{locationName}}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {{#each topCategories}}
          <a href="/categories/{{slug}}" class="block text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{count}}</div>
            <div class="text-sm text-gray-700 dark:text-gray-300">{{name}}</div>
          </a>
          {{/each}}
        </div>
      </div>

      <!-- Top Companies -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Perusahaan Teratas di {{locationName}}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {{#each topCompanies}}
          <a href="/companies/{{employerId}}" class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4H4"/>
              </svg>
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{name}}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{jobCount}} lowongan</div>
            </div>
          </a>
          {{/each}}
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-wrap justify-between items-center">
          <div class="flex items-center space-x-6">
            <span class="text-lg font-medium text-gray-900 dark:text-white">
              <span class="text-2xl text-blue-600 dark:text-blue-400">{{totalJobs}}</span>
              lowongan di {{locationName}}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Diperbarui: {{lastUpdated}}
            </span>
          </div>

          <!-- Filters -->
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <select class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option>Urutkan: Terbaru</option>
              <option>Urutkan: Relevansi</option>
              <option>Urutkan: Gaji</option>
            </select>
            <select class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option>Semua Kategori</option>
              {{#each topCategories}}
              <option>{{name}}</option>
              {{/each}}
            </select>
          </div>
        </div>
      </div>

      <!-- Job Listings -->
      <div class="space-y-4">
        {{#each jobs}}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  <a href="/jobs/{{id}}" class="hover:text-blue-600 dark:hover:text-blue-400">{{title}}</a>
                </h3>
                {{#if isFeatured}}
                <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Featured</span>
                {{/if}}
              </div>

              <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4H4"/>
                  </svg>
                  {{company}}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 11-11.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 1-6 0z"/>
                  </svg>
                  {{location}}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{employmentType}}
                </span>
                {{#if showSalary}}
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                  {{salaryRange}}
                </span>
                {{/if}}
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  {{quota}}
                </span>
              </div>

              <p class="text-gray-600 dark:text-gray-400 mb-3">{{description}}</p>

              <div class="flex flex-wrap gap-2 mb-3">
                {{#each skills}}
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{{this}}</span>
                {{/each}}
              </div>

              <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Diposting {{postedDate}}
              </div>
            </div>

            <div class="mt-4 md:mt-0 md:ml-4 flex flex-col items-end space-y-2">
              <a
                href="/jobs/{{id}}"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Detail
              </a>
              <a
                href="{{applicationUrl}}"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                Lamar
              </a>
            </div>
          </div>
        </div>
        {{/each}}
      </div>

      <!-- Pagination -->
      {{#if hasMoreJobs}}
      <div class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
            Previous
          </button>
          <span class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</span>
          <span class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            2
          </span>
          <span class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            3
          </span>
          <button class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
        </nav>
      </div>
      {{/if}}
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 Megawe. Semua hak dilindungi.</p>
        <p class="mt-2 text-sm">
          Platform aggregator lowongan kerja terpercaya di Indonesia
        </p>
      </div>
    </div>
  </footer>
</body>
</html>`

/**
 * Generate Schema.org structured data for location page
 */
function generateLocationSchema(locationData: {
  name: string;
  description: string;
  jobCount: number;
  jobs: any[];
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Lowongan Kerja di ${locationData.name}`,
    "description": locationData.description,
    "url": `https://megawe.net/locations/${locationData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": locationData.jobCount,
      "itemListElement": locationData.jobs.map((job, index) => ({
        "@type": "JobPosting",
        "position": index + 1,
        "name": job.title,
        "url": `https://megawe.net/jobs/${job.id}`,
        "hiringOrganization": {
          "@type": "Organization",
          "name": job.company
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": locationData.name,
            "addressCountry": "ID"
          }
        }
      }))
    }
  }

  return JSON.stringify(schema, null, 2)
}

/**
 * Convert database job to location template format
 */
function jobToLocationTemplate(job: DatabaseJob): Record<string, any> {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    employmentType: job.employment_type || 'Full-time',
    description: job.description?.substring(0, 200) + (job.description?.length > 200 ? '...' : ''),
    showSalary: job.show_salary !== false && (job.salary_min || job.salary_max),
    salaryRange: job.salary_min && job.salary_max
      ? `IDR ${job.salary_min.toLocaleString('id-ID')} - ${job.salary_max.toLocaleString('id-ID')}`
      : undefined,
    quota: job.available_quota || job.quota || 0,
    applicationUrl: job.application_url || '#',
    postedDate: job.posted_at
      ? new Date(job.posted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : undefined,
    skills: job.skills ? job.skills.split(',').map(s => s.trim()).slice(0, 5) : [],
    isFeatured: false // No featured field in database schema
  }
}

/**
 * Get location statistics and related data
 */
async function getLocationStats(env: Env, locationName: string) {
  try {
    // Get total jobs by location
    const totalQuery = `
      SELECT COUNT(*) as count FROM jobs
      WHERE location = ? AND is_active = 1
    `
    const totalResult = await env.MEGAWE_DB.prepare(totalQuery).bind(locationName).first()

    // Get unique companies count
    const companiesQuery = `
      SELECT COUNT(DISTINCT company) as count, COUNT(DISTINCT employer_id) as employer_count
      FROM jobs
      WHERE location = ? AND is_active = 1
    `
    const companiesResult = await env.MEGAWE_DB.prepare(companiesQuery).bind(locationName).first()

    // Get top categories for this location
    const categoriesQuery = `
      SELECT category, COUNT(*) as count
      FROM jobs
      WHERE location = ? AND category IS NOT NULL AND is_active = 1
      GROUP BY category
      ORDER BY count DESC
      LIMIT 6
    `
    const categoriesResult = await env.MEGAWE_DB.prepare(categoriesQuery).bind(locationName).all()

    // Get top companies for this location
    const companiesListQuery = `
      SELECT company, employer_id, COUNT(*) as job_count
      FROM jobs
      WHERE location = ? AND is_active = 1
      GROUP BY company, employer_id
      ORDER BY job_count DESC
      LIMIT 6
    `
    const companiesListResult = await env.MEGAWE_DB.prepare(companiesListQuery).bind(locationName).all()

    // Get average salary
    const salaryQuery = `
      SELECT AVG((salary_min + salary_max) / 2) as avg_salary
      FROM jobs
      WHERE location = ? AND salary_min > 0 AND salary_max > 0 AND is_active = 1
    `
    const salaryResult = await env.MEGAWE_DB.prepare(salaryQuery).bind(locationName).first()

    const avgSalary = salaryResult?.avg_salary
      ? Math.round(salaryResult.avg_salary).toLocaleString('id-ID')
      : 'N/A'

    return {
      totalJobs: totalResult?.count || 0,
      totalCompanies: companiesResult?.count || 0,
      averageSalary: avgSalary,
      topCategories: (categoriesResult.results || []).map(row => ({
        name: row.category,
        count: row.count,
        slug: row.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      })),
      topCompanies: (companiesListResult.results || []).map(row => ({
        name: row.company,
        employerId: row.employer_id,
        jobCount: row.job_count
      }))
    }
  } catch (error) {
    console.error('Error getting location stats:', error)
    return {
      totalJobs: 0,
      totalCompanies: 0,
      averageSalary: 'N/A',
      topCategories: [],
      topCompanies: []
    }
  }
}

/**
 * Template rendering for location pages
 */
function renderLocationTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template

  // Replace simple variables
  Object.entries(variables).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      const regex = new RegExp(`{{${key}}}`, 'g')
      rendered = rendered.replace(regex, String(value))
    }
  })

  // Handle conditionals
  rendered = rendered.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
    const value = variables[varName]
    return value ? content : ''
  })

  // Handle each loops
  rendered = rendered.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match, varName, content) => {
    const array = variables[varName]
    if (Array.isArray(array)) {
      return array.map(item => {
        let itemContent = content
        if (typeof item === 'object') {
          Object.entries(item).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            itemContent = itemContent.replace(regex, String(value || ''))
          })
        } else {
          itemContent = itemContent.replace(/{{this}}/g, String(item))
        }
        return itemContent
      }).join('')
    }
    return ''
  })

  return rendered
}

/**
 * Main Pages Function handler for location pages
 */
export async function onRequestGet(context: {
  env: Env;
  request: Request;
  params: { slug: string }
}) {
  try {
    const locationSlug = context.params.slug

    if (!locationSlug) {
      return new Response('Location slug is required', { status: 400 })
    }

    // Convert slug back to location name (replace hyphens with spaces)
    const locationName = locationSlug.replace(/-/g, ' ')

    // Query jobs for this location
    const jobsQuery = `
      SELECT * FROM jobs
      WHERE location = ? AND is_active = 1
      ORDER BY created_at DESC
      LIMIT 20
    `

    const jobsResult = await context.env.MEGAWE_DB
      .prepare(jobsQuery)
      .bind(locationName)
      .all()

    if (!jobsResult.results || jobsResult.results.length === 0) {
      // Return 404 page for empty locations
      return new Response(
        `<!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lokasi Tidak Ditemukan - Megawe</title>
          <meta name="robots" content="noindex">
          <link rel="icon" href="/favicon.ico">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 min-h-screen flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Lokasi tidak ditemukan atau tidak memiliki lowongan aktif</p>
            <a href="/jobs" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Lihat Semua Lowongan
            </a>
          </div>
        </body>
        </html>`,
        {
          status: 404,
          headers: { 'Content-Type': 'text/html' }
        }
      )
    }

    const jobs = jobsResult.results as DatabaseJob[]
    const locationStats = await getLocationStats(context.env, locationName)

    const templateVars = {
      locationTitle: `Lowongan Kerja di ${locationName}`,
      locationName: locationName,
      description: `Temukan semua lowongan kerja di ${locationName}. Platform terpercaya untuk mencari pekerjaan terbaik di wilayah Anda.`,
      keywords: `lowongan kerja ${locationName}, karir ${locationName}, pekerjaan ${locationName}, ${locationStats.topCategories.map(c => c.name).join(', ')}`,
      slug: locationSlug,
      totalJobs: locationStats.totalJobs,
      totalCompanies: locationStats.totalCompanies,
      averageSalary: locationStats.averageSalary,
      topCategoriesCount: locationStats.topCategories.length,
      lastUpdated: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),

      // Related data
      topCategories: locationStats.topCategories,
      topCompanies: locationStats.topCompanies,

      // Job listings
      jobs: jobs.map(jobToLocationTemplate),
      hasMoreJobs: locationStats.totalJobs > jobs.length,

      // Schema.org data
      jsonld: generateLocationSchema({
        name: locationName,
        description: `Temukan semua lowongan kerja di ${locationName}. Platform terpercaya untuk mencari pekerjaan terbaik di wilayah Anda.`,
        jobCount: locationStats.totalJobs,
        jobs: jobs.slice(0, 10) // First 10 jobs for schema
      })
    }

    // Render HTML template
    const htmlContent = renderLocationTemplate(LOCATION_TEMPLATE, templateVars)

    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600', // Cache for 30 minutes, CDN for 1 hour
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    })

  } catch (error) {
    console.error('Location page error:', error)

    return new Response(
      `<!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kesalahan Server - Megawe</title>
        <link rel="icon" href="/favicon.ico">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">500</h1>
          <p class="text-xl text-gray-600 mb-8">Terjadi kesalahan pada server</p>
          <a href="/jobs" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Kembali ke Lowongan
          </a>
        </div>
      </body>
      </html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}