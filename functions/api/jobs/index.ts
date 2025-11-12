/**
 * Jobs List API Endpoint
 *
 * GET /api/jobs?limit=20&page=1&location=Jakarta&category=IT&employmentType=full-time
 * Returns paginated job listings with filtering and search capabilities
 */

import { Env, Job, SearchFilters, ApiResponse } from '../../types'

export async function onRequestGet(context: { env: Env; request: Request }) {
  const { env, request } = context
  const startTime = Date.now()

  try {
    // Parse query parameters
    const url = new URL(request.url)
    const filters: SearchFilters = {
      query: url.searchParams.get('query') || undefined,
      location: url.searchParams.get('location') || undefined,
      companyId: url.searchParams.get('companyId') || undefined,
      category: url.searchParams.get('category') || undefined,
      experienceLevel: url.searchParams.get('experienceLevel') || undefined,
      salaryMin: url.searchParams.get('salaryMin') ? parseInt(url.searchParams.get('salaryMin')!) : undefined,
      salaryMax: url.searchParams.get('salaryMax') ? parseInt(url.searchParams.get('salaryMax')!) : undefined,
      remote: url.searchParams.get('remote') === 'true',
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: parseInt(url.searchParams.get('limit') || '20'),
      sortBy: (url.searchParams.get('sortBy') as any) || 'postedAt',
      sortOrder: (url.searchParams.get('sortOrder') as any) || 'desc'
    }

    // Parse employment types array
    const employmentTypes = url.searchParams.getAll('employmentType')
    if (employmentTypes.length > 0) {
      filters.employmentType = employmentTypes
    }

    // Validate pagination
    if (filters.limit && filters.limit > 100) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Limit cannot exceed 100'
      } as ApiResponse), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }

    const offset = ((filters.page || 1) - 1) * (filters.limit || 20)

    // Build WHERE conditions
    const conditions: string[] = ['is_active = 1']
    const params: any[] = []

    // Add search conditions
    if (filters.query) {
      conditions.push(`(
        title LIKE ? OR
        description LIKE ? OR
        company LIKE ? OR
        skills LIKE ? OR
        tags LIKE ?
      )`)
      const searchTerm = `%${filters.query}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
    }

    if (filters.location) {
      conditions.push('location LIKE ?')
      params.push(`%${filters.location}%`)
    }

    if (filters.category) {
      conditions.push('category = ?')
      params.push(filters.category)
    }

    if (filters.experienceLevel) {
      conditions.push('experience_level = ?')
      params.push(filters.experienceLevel)
    }

    if (filters.employmentType && filters.employmentType.length > 0) {
      const placeholders = filters.employmentType.map(() => '?').join(',')
      conditions.push(`employment_type IN (${placeholders})`)
      params.push(...filters.employmentType)
    }

    if (filters.remote) {
      conditions.push('is_remote = 1')
    }

    if (filters.salaryMin) {
      conditions.push('salary_min >= ?')
      params.push(filters.salaryMin)
    }

    if (filters.salaryMax) {
      conditions.push('salary_max <= ?')
      params.push(filters.salaryMax)
    }

    // Don't show expired jobs
    conditions.push('(expires_at IS NULL OR expires_at > datetime("now"))')

    // Build ORDER BY clause
    let orderBy = 'ORDER BY '
    switch (filters.sortBy) {
      case 'relevance':
        if (filters.query) {
          orderBy += `
            CASE
              WHEN title LIKE ? THEN 1
              WHEN company LIKE ? THEN 2
              WHEN description LIKE ? THEN 3
              ELSE 4
            END ASC,
            posted_at DESC
          `
          const searchTerm = `%${filters.query}%`
          params.push(searchTerm, searchTerm, searchTerm)
        } else {
          orderBy += 'posted_at DESC'
        }
        break
      case 'salary':
        orderBy += 'salary_min DESC, posted_at DESC'
        break
      case 'company':
        orderBy += 'company ASC, posted_at DESC'
        break
      case 'postedAt':
      default:
        orderBy += 'posted_at DESC'
        break
    }

    if (filters.sortOrder === 'asc') {
      orderBy = orderBy.replace(/DESC/g, 'ASC')
    }

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM jobs WHERE ${conditions.join(' AND ')}`
    const countResult = await env.MEGAWE_DB.prepare(countQuery).bind(...params).first()
    const total = countResult?.total || 0

    // Get paginated results
    const selectQuery = `
      SELECT
        id,
        title,
        slug,
        description,
        requirements,
        responsibilities,
        benefits,
        skills,
        tags,
        company,
        employer_id,
        location,
        postal_code,
        latitude,
        longitude,
        is_remote,
        is_hybrid,
        employment_type,
        experience_level,
        salary_min,
        salary_max,
        salary_currency,
        salary_period,
        show_salary,
        type,
        category,
        department,
        quota,
        usage_quota,
        available_quota,
        application_url,
        application_deadline,
        expires_at,
        is_active,
        posted_at,
        updated_at,
        created_at,
        view_count,
        application_count,
        featured,
        priority
      FROM jobs
      WHERE ${conditions.join(' AND ')}
      ${orderBy}
      LIMIT ? OFFSET ?
    `

    const jobsParams = [...params, filters.limit || 20, offset]
    const results = await env.MEGAWE_DB.prepare(selectQuery).bind(...jobsParams).all()

    // Transform database results to API response format
    const jobs: Job[] = results.results.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description || '',
      requirements: row.requirements ? row.requirements.split(',').map((r: string) => r.trim()) : [],
      responsibilities: row.responsibilities ? row.responsibilities.split(',').map((r: string) => r.trim()) : [],
      benefits: row.benefits ? row.benefits.split(',').map((b: string) => b.trim()) : [],
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
      isRemote: Boolean(row.is_remote),
      isHybrid: Boolean(row.is_hybrid),

      // Job details
      employmentType: row.employment_type || 'full-time',
      experienceLevel: row.experience_level,
      salary: row.salary_min || row.salary_max ? {
        min: row.salary_min,
        max: row.salary_max,
        currency: row.salary_currency || 'IDR',
        period: row.salary_period || 'month',
        showSalary: Boolean(row.show_salary)
      } : undefined,
      type: row.type,
      category: row.category,
      department: row.department,

      // Quota information
      quota: row.quota,
      availableQuota: row.available_quota,
      usageQuota: row.usage_quota,

      // Enhanced metadata
      employerId: row.employer_id,
      applicationUrl: row.application_url,
      applicationDeadline: row.application_deadline,
      expiresAt: row.expires_at,
      isActive: Boolean(row.is_active),

      // Timestamps
      postedAt: row.posted_at,
      updatedAt: row.updated_at,
      createdAt: row.created_at,

      // Statistics
      viewCount: row.view_count || 0,
      applicationCount: row.application_count || 0,
      featured: Boolean(row.featured),
      priority: row.priority || 0,
    }))

    const totalPages = Math.ceil(total / (filters.limit || 20))
    const processingTime = Date.now() - startTime

    const response: ApiResponse<Job[]> = {
      success: true,
      data: jobs,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total,
        totalPages
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
        version: 'v1',
        processingTime
      }
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      }
    })

  } catch (error) {
    console.error('Jobs List API Error:', error)

    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
        version: 'v1',
        processingTime: Date.now() - startTime
      }
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}