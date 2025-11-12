/**
 * Company Profile SSG Page
 *
 * Generates static company profile pages from employer IDs using:
 * - SSG (Static Site Generation) from D1 database
 * - HTML template with company jobs listing
 * - SEO optimization with company information
 */

import { Env, DatabaseJob } from '../../types'

// Company profile template
const COMPANY_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{companyName}} - Profil Perusahaan | Megawe</title>
  <meta name="description" content="{{description}}">
  <meta name="keywords" content="{{keywords}}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://megawe.net/companies/{{slug}}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{companyName}} - Profil Perusahaan | Megawe">
  <meta property="og:description" content="{{description}}">
  <meta property="og:url" content="https://megawe.net/companies/{{slug}}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Megawe">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{companyName}} - Profil Perusahaan | Megawe">
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

  <!-- Main Content -->
  <main class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-4" aria-label="Breadcrumb">
        <ol class="list-none flex items-center space-x-2">
          <li><a href="/" class="text-blue-600 hover:text-blue-700">Beranda</a></li>
          <li><span class="text-gray-500">/</span></li>
          <li><a href="/companies" class="text-blue-600 hover:text-blue-700">Perusahaan</a></li>
          <li><span class="text-gray-500">/</span></li>
          <li class="text-gray-900 dark:text-gray-100">{{companyName}}</li>
        </ol>
      </nav>

      <!-- Company Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-4">
              <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4H4"/>
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{companyName}}</h1>
                <div class="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 11-11.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 1-6 0z"/>
                  </svg>
                  {{location}}
                </div>
              </div>
            </div>

            <p class="text-gray-600 dark:text-gray-400 mb-6">{{description}}</p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{totalJobs}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Total Lowongan</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{activeJobs}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Aktif</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{locationsCount}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Lokasi</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{categoriesCount}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Kategori</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Statistics -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Statistik Perusahaan</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Distribusi Tipe Pekerjaan</h3>
            <div class="space-y-2">
              {{#each jobTypes}}
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">{{type}}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{count}}</span>
              </div>
              {{/each}}
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Lokasi Terbanyak</h3>
            <div class="space-y-2">
              {{#each topLocations}}
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">{{location}}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{count}}</span>
              </div>
              {{/each}}
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Kategori Populer</h3>
            <div class="space-y-2">
              {{#each topCategories}}
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">{{category}}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{count}}</span>
              </div>
              {{/each}}
            </div>
          </div>
        </div>
      </div>

      <!-- Current Job Openings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Lowongan Saat Ini</h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{activeJobs}} lowongan aktif</span>
        </div>

        <div class="space-y-4">
          {{#each currentJobs}}
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  <a href="/jobs/{{id}}" class="hover:text-blue-600 dark:hover:text-blue-400">{{title}}</a>
                </h3>
                <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
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
                </div>
                <p class="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{{description}}</p>
              </div>
              <div class="ml-4">
                <a
                  href="/jobs/{{id}}"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Detail
                </a>
              </div>
            </div>
          </div>
          {{/each}}
        </div>

        {{#if hasMoreJobs}}
        <div class="mt-6 text-center">
          <button class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Muat Lebih Banyak
          </button>
        </div>
        {{/if}}
      </div>
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
 * Generate Schema.org structured data for company
 */
function generateCompanySchema(companyData: {
  name: string;
  description?: string;
  location?: string;
  jobCount: number;
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": companyData.name,
    "description": companyData.description || "",
    "url": `https://megawe.net/companies/${companyData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    "address": companyData.location ? {
      "@type": "PostalAddress",
      "addressLocality": companyData.location,
      "addressCountry": "ID"
    } : undefined,
    "numberOfEmployees": companyData.jobCount || 0
  }

  return JSON.stringify(schema, null, 2)
}

/**
 * Process job data for template rendering
 */
function jobToTemplate(job: DatabaseJob): Record<string, any> {
  return {
    id: job.id,
    title: job.title,
    description: job.description?.substring(0, 150) + (job.description?.length > 150 ? '...' : ''),
    location: job.location,
    employmentType: job.employment_type || 'Full-time',
    showSalary: job.show_salary !== false && (job.salary_min || job.salary_max),
    salaryRange: job.salary_min && job.salary_max
      ? `IDR ${job.salary_min.toLocaleString('id-ID')} - ${job.salary_max.toLocaleString('id-ID')}`
      : undefined,
    postedAt: job.posted_at ? new Date(job.posted_at).toLocaleDateString('id-ID') : undefined
  }
}

/**
 * Get company statistics from jobs data
 */
function getCompanyStats(jobs: DatabaseJob[]) {
  // Job types distribution
  const jobTypes = jobs.reduce((acc, job) => {
    const type = job.employment_type || 'Full-time'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Locations distribution
  const locations = jobs.reduce((acc, job) => {
    const location = job.location || 'Unknown'
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Categories distribution
  const categories = jobs.reduce((acc, job) => {
    const category = job.category || 'General'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    jobTypes: Object.entries(jobTypes)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),

    topLocations: Object.entries(locations)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),

    topCategories: Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }
}

/**
 * Simple template engine for company pages
 */
function renderCompanyTemplate(template: string, variables: Record<string, any>): string {
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
 * Main Pages Function handler for company profile pages
 */
export async function onRequestGet(context: {
  env: Env;
  request: Request;
  params: { id: string }
}) {
  try {
    const employerId = context.params.id

    if (!employerId) {
      return new Response('Company ID is required', { status: 400 })
    }

    // Query company jobs from database
    const jobsQuery = `
      SELECT * FROM jobs
      WHERE employer_id = ? AND is_active = 1
      ORDER BY created_at DESC
    `

    const jobsResult = await context.env.MEGAWE_DB
      .prepare(jobsQuery)
      .bind(employerId)
      .all()

    if (!jobsResult.results || jobsResult.results.length === 0) {
      // Return 404 page for companies with no jobs
      return new Response(
        `<!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Perusahaan Tidak Ditemukan - Megawe</title>
          <meta name="robots" content="noindex">
          <link rel="icon" href="/favicon.ico">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 min-h-screen flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Perusahaan tidak ditemukan atau tidak memiliki lowongan aktif</p>
            <a href="/companies" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Lihat Semua Perusahaan
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
    const companyStats = getCompanyStats(jobs)

    // Get company name from first job
    const companyName = jobs[0]?.company || 'Unknown Company'
    const companyLocation = jobs[0]?.location || 'Unknown Location'

    // Get description from the first available job or use a default
    const companyDescription = `Lihat semua lowongan kerja dari ${companyName}. Temukan berbagai peluang karir yang tersedia saat ini.`

    const templateVars = {
      companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: companyDescription,
      keywords: `${companyName}, lowongan kerja, karir, pekerjaan, ${companyLocation}`,
      location: companyLocation,

      // Statistics
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.is_active !== false).length,
      locationsCount: new Set(jobs.map(job => job.location)).size,
      categoriesCount: new Set(jobs.map(job => job.category)).size,

      // Statistics breakdown
      jobTypes: companyStats.jobTypes,
      topLocations: companyStats.topLocations,
      topCategories: companyStats.topCategories,

      // Current job openings (limit to 10)
      currentJobs: jobs.slice(0, 10).map(jobToTemplate),
      hasMoreJobs: jobs.length > 10,

      // Schema.org data
      jsonld: generateCompanySchema({
        name: companyName,
        description: companyDescription,
        location: companyLocation,
        jobCount: jobs.length
      })
    }

    // Render HTML template
    const htmlContent = renderCompanyTemplate(COMPANY_TEMPLATE, templateVars)

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
    console.error('Company profile page error:', error)

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
          <a href="/companies" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Kembali ke Daftar Perusahaan
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