/**
 * Featured Jobs API Endpoint
 *
 * GET /api/featured-jobs?limit=6
 * Returns featured job listings for homepage display
 */

import { Env, ApiResponse } from '../../types'

export async function onRequestGet(context: { env: Env; request: Request }) {
  const { env, request } = context
  const startTime = Date.now()

  try {
    // Parse query parameters
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '6')

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

    // Simple query using only essential columns
    const query = `
      SELECT
        id,
        title,
        description,
        company,
        location,
        type,
        category,
        salary_min,
        salary_max,
        show_salary,
        quota,
        available_quota,
        posted_at,
        application_url
      FROM jobs
      WHERE is_active = 1
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      ORDER BY posted_at DESC
      LIMIT ?
    `

    const results = await env.MEGAWE_DB.prepare(query).bind(limit).all()

    // Transform database results to API response format
    const jobs = results.results.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: row.description || '',
      requirements: [], // Simplified for now
      responsibilities: [],
      benefits: [],
      skills: [],
      tags: [],

      // Company information
      company: row.company || '',
      companyData: {
        id: '',
        name: row.company || '',
        slug: row.company ? row.company.toLowerCase().replace(/\s+/g, '-') : '',
      },

      // Location information
      location: row.location || '',
      postalCode: null,
      latitude: null,
      longitude: null,
      isRemote: false,
      isHybrid: false,

      // Job details
      employmentType: row.type || 'full-time',
      experienceLevel: null,
      salary: row.salary_min || row.salary_max ? {
        min: row.salary_min,
        max: row.salary_max,
        currency: 'IDR',
        period: 'month',
        showSalary: Boolean(row.show_salary)
      } : undefined,
      type: row.type,
      category: row.category,
      department: null,

      // Quota information
      quota: row.quota,
      availableQuota: row.available_quota,
      usageQuota: null,

      // Dates
      postedAt: row.posted_at,
      expiresAt: null,
      createdAt: row.posted_at,
      updatedAt: row.posted_at,

      // URLs
      applicationUrl: row.application_url,
    }))

    const response = {
      success: true,
      data: {
        jobs,
        pagination: {
          limit,
          offset: 0,
          hasMore: false,
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
        total: jobs.length,
      },
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300',
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