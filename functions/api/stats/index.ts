/**
 * Job Statistics API Endpoint
 *
 * GET /api/stats/summary
 * Returns platform statistics for dashboard display
 */

import { Env, JobStats, ApiResponse } from '../../types'

export async function onRequestGet(context: { env: Env; request: Request }) {
  const { env } = context
  const startTime = Date.now()

  try {
    // Get basic counts
    const totalJobsQuery = `SELECT COUNT(*) as count FROM jobs WHERE is_active = 1`
    const totalCompaniesQuery = `SELECT COUNT(DISTINCT company) as count FROM jobs WHERE is_active = 1 AND company IS NOT NULL AND company != ''`
    const activeJobsQuery = `SELECT COUNT(*) as count FROM jobs WHERE is_active = 1 AND (expires_at IS NULL OR expires_at > datetime('now'))`

    const [totalJobsResult, totalCompaniesResult, activeJobsResult] = await Promise.all([
      env.MEGAWE_DB.prepare(totalJobsQuery).first(),
      env.MEGAWE_DB.prepare(totalCompaniesQuery).first(),
      env.MEGAWE_DB.prepare(activeJobsQuery).first()
    ])

    // Get jobs added today
    const todayQuery = `SELECT COUNT(*) as count FROM jobs WHERE DATE(created_at) = DATE('now')`
    const todayResult = await env.MEGAWE_DB.prepare(todayQuery).first()

    // Get jobs added this week
    const weekQuery = `SELECT COUNT(*) as count FROM jobs WHERE created_at >= datetime('now', '-7 days')`
    const weekResult = await env.MEGAWE_DB.prepare(weekQuery).first()

    // Get jobs added this month
    const monthQuery = `SELECT COUNT(*) as count FROM jobs WHERE created_at >= datetime('now', '-30 days')`
    const monthResult = await env.MEGAWE_DB.prepare(monthQuery).first()

    // Get last sync time (from latest job creation)
    const lastSyncQuery = `SELECT MAX(created_at) as last_sync FROM jobs`
    const lastSyncResult = await env.MEGAWE_DB.prepare(lastSyncQuery).first()

    // Get job counts by category
    const categoriesQuery = `
      SELECT
        category as name,
        COUNT(*) as count,
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM jobs WHERE is_active = 1) as percentage
      FROM jobs
      WHERE is_active = 1 AND category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY count DESC
      LIMIT 10
    `
    const categoriesResult = await env.MEGAWE_DB.prepare(categoriesQuery).all()

    // Get job counts by type
    const typesQuery = `
      SELECT
        employment_type as name,
        COUNT(*) as count,
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM jobs WHERE is_active = 1) as percentage
      FROM jobs
      WHERE is_active = 1 AND employment_type IS NOT NULL AND employment_type != ''
      GROUP BY employment_type
      ORDER BY count DESC
    `
    const typesResult = await env.MEGAWE_DB.prepare(typesQuery).all()

    // Get job counts by location (top 10)
    const locationsQuery = `
      SELECT
        location as name,
        COUNT(*) as count
      FROM jobs
      WHERE is_active = 1 AND location IS NOT NULL AND location != ''
      GROUP BY location
      ORDER BY count DESC
      LIMIT 10
    `
    const locationsResult = await env.MEGAWE_DB.prepare(locationsQuery).all()

    // Get salary ranges
    const salaryRangesQuery = `
      SELECT
        CASE
          WHEN salary_min < 3000000 THEN 'Di bawah 3jt'
          WHEN salary_min < 5000000 THEN '3jt - 5jt'
          WHEN salary_min < 8000000 THEN '5jt - 8jt'
          WHEN salary_min < 12000000 THEN '8jt - 12jt'
          ELSE 'Di atas 12jt'
        END as range_label,
        COUNT(*) as count
      FROM jobs
      WHERE is_active = 1
        AND salary_min IS NOT NULL
        AND salary_min > 0
        AND show_salary = 1
      GROUP BY range_label
      ORDER BY MIN(salary_min)
    `
    const salaryRangesResult = await env.MEGAWE_DB.prepare(salaryRangesQuery).all()

    const stats: JobStats = {
      totalJobs: totalJobsResult?.count || 0,
      totalCompanies: totalCompaniesResult?.count || 0,
      totalCategories: categoriesResult.results?.length || 0,
      totalLocations: locationsResult.results?.length || 0,
      jobsByCategory: categoriesResult.results || [],
      jobsByType: typesResult.results || [],
      jobsByLocation: locationsResult.results || [],
      salaryRanges: salaryRangesResult.results || [],
      recentActivity: {
        jobsAddedToday: todayResult?.count || 0,
        jobsAddedThisWeek: weekResult?.count || 0,
        jobsAddedThisMonth: monthResult?.count || 0,
        lastSyncTime: lastSyncResult?.last_sync || new Date().toISOString()
      },
      // Legacy compatibility
      newJobsToday: todayResult?.count || 0,
      newJobsThisWeek: weekResult?.count || 0,
      activeLocations: locationsResult.results?.length || 0,
      featuredJobs: 0, // TODO: Implement featured jobs count
      remoteJobs: 0, // TODO: Implement remote jobs count
      popularLocations: locationsResult.results?.slice(0, 5).map((loc: any) => ({
        name: loc.name,
        count: loc.count
      })) || [],
      popularCompanies: [], // TODO: Implement popular companies
      popularIndustries: categoriesResult.results?.slice(0, 5).map((cat: any) => ({
        name: cat.name,
        count: cat.count
      })) || []
    }

    const processingTime = Date.now() - startTime

    const response: ApiResponse<JobStats> = {
      success: true,
      data: stats,
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
        'Cache-Control': 'public, max-age=600', // 10 minutes cache
      }
    })

  } catch (error) {
    console.error('Stats API Error:', error)

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