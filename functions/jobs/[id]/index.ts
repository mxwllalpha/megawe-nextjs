/**
 * Job Detail SSG Page
 *
 * Generates static job detail pages from database IDs using:
 * - SSG (Static Site Generation) from D1 database
 * - HTML template with Schema.org structured data
 * - SEO optimization with meta tags and breadcrumbs
 */

import { Env, DatabaseJob } from '../../types'

// Template HTML (simplified version for demonstration)
const TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}} - Lowongan Kerja | Megawe</title>
  <meta name="description" content="{{description}}">
  <meta name="keywords" content="{{keywords}}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://megawe.net/jobs/{{slug}}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{title}} - Lowongan Kerja | Megawe">
  <meta property="og:description" content="{{description}}">
  <meta property="og:url" content="https://megawe.net/jobs/{{slug}}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Megawe">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{title}} - Lowongan Kerja | Megawe">
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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-4" aria-label="Breadcrumb">
        <ol class="list-none flex items-center space-x-2">
          <li><a href="/" class="text-blue-600 hover:text-blue-700">Beranda</a></li>
          <li><span class="text-gray-500">/</span></li>
          <li><a href="/jobs" class="text-blue-600 hover:text-blue-700">Lowongan</a></li>
          <li><span class="text-gray-500">/</span></li>
          <li class="text-gray-900 dark:text-gray-100">{{title}}</li>
        </ol>
      </nav>

      <!-- Job Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-start">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{title}}</h1>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4H4"/>
                </svg>
                {{company}}
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{employmentType}}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mt-4">{{description}}</p>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-y-0 md:space-x-4">
            {{#if salaryVisible}}
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{salaryMin}} - {{salaryMax}}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">IDR/bulan</div>
            </div>
            {{/if}}

            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{availableQuota}}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Kuota tersedia</div>
            </div>

            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-400">Dipublikasi</div>
              <div class="text-sm text-gray-500 dark:text-gray-500">{{postedDate}}</div>
            </div>
          </div>
        </div>

        {{#if requirements}}
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Persyaratan</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            {{#each requirements}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
        {{/if}}

        <div class="mt-6 flex flex-wrap gap-3">
          <a
            href="{{applicationUrl}}"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Lamar Sekarang
          </a>
          <button class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Simpan Lowongan
          </button>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informasi Tambahan</h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Detail Pekerjaan</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Tipe Kerja:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">{{employmentType}}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Pengalaman:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">{{experienceLevel}} tahun</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Status:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">
                  <span class="px-2 py-1 text-xs font-medium rounded-full {{#if isActive}}bg-green-100 text-green-800{{else}}bg-red-100 text-red-800{{/if}}">
                    {{#if isActive}}Aktif{{else}}Tidak Aktif{{/if}}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Informasi Perusahaan</h3>
            <div class="text-gray-700 dark:text-gray-300">
              <p class="font-medium">{{company}}</p>
              <p class="text-sm mt-1">Lokasi: {{location}}</p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Deadline Lamaran</h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{expiresAt}}
          </p>
        </div>
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
 * Generate Schema.org structured data for job posting
 */
function generateJobSchema(job: DatabaseJob): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": job.id
    },
    "datePosted": job.posted_at || new Date().toISOString(),
    "validThrough": job.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "employmentType": job.employment_type === "full-time" ? "FULL_TIME" :
                    job.employment_type === "part-time" ? "PART_TIME" : "CONTRACTOR",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": "#"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "ID"
      }
    },
    "baseSalary": job.salary_min && job.salary_max ? {
      "@type": "MonetaryAmount",
      "currency": job.salary_currency || "IDR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salary_min,
        "maxValue": job.salary_max,
        "unitText": job.salary_period === "month" ? "MONTH" : "YEAR"
      }
    } : undefined,
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Indonesia"
    }
  }

  return JSON.stringify(schema, null, 2)
}

/**
 * Convert database job to template variables
 */
function jobToTemplateVars(job: DatabaseJob): Record<string, any> {
  const postedDate = job.posted_at ?
    new Date(job.posted_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : 'Tanggal tidak tersedia'

  const expiresAt = job.expires_at ?
    new Date(job.expires_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : 'Tidak ada deadline'

  return {
    id: job.id,
    title: job.title,
    slug: job.seo_slug || job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: job.description?.substring(0, 300) + (job.description?.length > 300 ? '...' : ''),
    keywords: job.seo_keywords || job.tags || '',
    company: job.company,
    location: job.location,
    employmentType: job.employment_type || 'Full-time',
    experienceLevel: job.min_year_experience || 0,
    isActive: job.is_active !== false,

    // Salary information
    salaryVisible: job.show_salary !== false && (job.salary_min || job.salary_max),
    salaryMin: job.salary_min ? job.salary_min.toLocaleString('id-ID') : '',
    salaryMax: job.salary_max ? job.salary_max.toLocaleString('id-ID') : '',

    // Quota information
    availableQuota: job.available_quota || job.quota || 0,

    // Requirements
    requirements: job.requirements ? job.requirements.split('\n').filter(r => r.trim()) : [],

    // URLs
    applicationUrl: job.application_url || '#',

    // Dates
    postedDate,
    expiresAt,

    // Schema.org structured data
    jsonld: generateJobSchema(job)
  }
}

/**
 * Simple template engine for replacing {{variables}}
 */
function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template

  // Replace simple variables
  Object.entries(variables).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      const regex = new RegExp(`{{${key}}}`, 'g')
      rendered = rendered.replace(regex, String(value))
    }
  })

  // Handle simple conditional {{#if variable}}...{{/if}}
  rendered = rendered.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
    const value = variables[varName]
    return value ? content : ''
  })

  // Handle simple each {{#each array}}...{{/each}}
  rendered = rendered.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match, varName, content) => {
    const array = variables[varName]
    if (Array.isArray(array)) {
      return array.map(item =>
        content.replace(/{{this}}/g, String(item))
      ).join('')
    }
    return ''
  })

  return rendered
}

/**
 * Main Pages Function handler for job detail pages
 */
export async function onRequestGet(context: {
  env: Env;
  request: Request;
  params: { id: string }
}) {
  try {
    const jobId = context.params.id

    if (!jobId) {
      return new Response('Job ID is required', { status: 400 })
    }

    // Query job from database
    const jobQuery = `
      SELECT * FROM jobs
      WHERE id = ? AND is_active = 1
      LIMIT 1
    `

    const jobResult = await context.env.MEGAWE_DB
      .prepare(jobQuery)
      .bind(jobId)
      .first()

    if (!jobResult) {
      // Return 404 page for non-existent jobs
      return new Response(
        `<!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lowongan Tidak Ditemukan - Megawe</title>
          <meta name="robots" content="noindex">
          <link rel="icon" href="/favicon.ico">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 min-h-screen flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Lowongan kerja tidak ditemukan</p>
            <a href="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Kembali ke Beranda
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

    // Convert database job to template variables
    const templateVars = jobToTemplateVars(jobResult as DatabaseJob)

    // Render HTML template
    const htmlContent = renderTemplate(TEMPLATE, templateVars)

    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400', // Cache for 1 hour, CDN for 1 day
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    })

  } catch (error) {
    console.error('Job detail page error:', error)

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
          <a href="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Kembali ke Beranda
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

/**
 * Generate static job pages (this would be called during build)
 */
export async function onBeforeRequest(context: {
  env: Env;
  request: Request;
}) {
  // This function can be used to pre-generate static pages
  // For now, we'll generate pages on-demand
  return null
}