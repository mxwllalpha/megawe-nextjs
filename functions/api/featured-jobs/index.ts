/**
 * Featured Jobs API Endpoint
 *
 * GET /api/featured-jobs?limit=6
 * Returns featured job listings for homepage display
 */

import { Env, Job, ApiResponse } from '../../types'

export async function onRequestGet(context: { env: Env; request: Request }) {
  const { env, request } = context
  const startTime = Date.now()

  try {
    // Parse query parameters
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '6')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Validate limit
    if (limit > 50) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Limit cannot exceed 50'
      } as ApiResponse), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // Query featured jobs from database (using only available columns)
    const query = `
      SELECT
        id,
        title,
        seo as slug,
        description,
        requirements,
        skills,
        tags,
        company,
        employer_id,
        location,
        postal_code,
        latitude,
        longitude,
        type as employment_type,
        salary_min,
        salary_max,
        salary_currency,
        salary_type as salary_period,
        show_salary,
        type,
        category,
        quota,
        usage_quota,
        available_quota,
        gender,
        physical_condition,
        marital_status,
        min_year_experience,
        min_age,
        max_age,
        region_id,
        city_id,
        posted_at,
        expires_at,
        is_active,
        application_url,
        created_at,
        updated_at,
        jsonld_schema as seo_data
      FROM jobs
      WHERE is_active = 1
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      ORDER BY
        posted_at DESC
      LIMIT ? OFFSET ?
    `

    const stmt = env.MEGAWE_DB.prepare(query)
    const results = await stmt.bind(limit, offset).all()

    // Transform database results to API response format
    const jobs: Job[] = results.results.map((row: any) => ({

      id: row.id,
      title: row.title,
      slug: row.slug || row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: row.description || '',
      requirements: row.requirements ? row.requirements.split(',').map((r: string) => r.trim()) : [],
      responsibilities: [], // No responsibilities column in database
      benefits: [], // No benefits column in database
      skills: row.skills ? row.skills.split(',').map((s: string) => s.trim()) : [],
      tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],

      // Company information
      company: row.company || '',
      companyData: {
        id: row.employer_id || '',
        name: row.company || '',
        slug: row.company ? row.company.toLowerCase().replace(/\s+/g, '-') : '',
      },

      // Location information
      location: row.location || '',
      postalCode: row.postal_code,
      latitude: row.latitude,
      longitude: row.longitude,
      isRemote: false, // Default value
      isHybrid: false, // Default value

      // Job details
      employmentType: row.employment_type || 'full-time',
      experienceLevel: row.min_year_experience ? `${row.min_year_experience}+ years` : undefined,
      salary: row.salary_min || row.salary_max ? {
        min: row.salary_min,
        max: row.salary_max,
        currency: row.salary_currency || 'IDR',
        period: row.salary_period || 'month',
        showSalary: Boolean(row.show_salary)
      } : undefined,
      type: row.type,
      category: row.category,
      department: undefined, // Not in database

      // Quota information
      quota: row.quota,
      availableQuota: row.available_quota,
      usageQuota: row.usage_quota,

      // Dates
      postedAt: row.posted_at,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,

      // URLs
      applicationUrl: row.application_url,
    }))

    // Prepare response
    const response = {
      success: true,
      data: {
        jobs,
        pagination: {
          limit,
          offset,
          hasMore: results.results.length === limit,
        },
        filters: {
          locations: [...new Set(jobs.map(job => job.location).filter(Boolean))],
          types: [...new Set(jobs.map(job => job.employmentType).filter(Boolean))],
          categories: [...new Set(jobs.map(job => job.category).filter(Boolean))],
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        total: results.results.length,
      },
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300', // 5 minutes
      },
    })

  } catch (error) {
    console.error('Featured jobs API error:', error)

    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      meta: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime,
      },
    } as ApiResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}