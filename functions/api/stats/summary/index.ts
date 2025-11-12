/**
 * Stats Summary API Endpoint
 *
 * GET /api/stats/summary
 * Returns comprehensive job market statistics
 */

import { Env, ApiResponse } from '../../../types'

export async function onRequestGet(context: { env: Env; request: Request }) {
  const { env } = context
  const startTime = Date.now()

  try {
    // Get total jobs
    const totalJobsQuery = `
      SELECT COUNT(*) as count FROM jobs
      WHERE is_active = 1
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `
    const totalJobsResult = await env.MEGAWE_DB.prepare(totalJobsQuery).first()

    // Get total companies
    const totalCompaniesQuery = `
      SELECT COUNT(DISTINCT company) as count FROM jobs
      WHERE is_active = 1
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `
    const totalCompaniesResult = await env.MEGAWE_DB.prepare(totalCompaniesQuery).first()

    // Get jobs added today
    const todayQuery = `
      SELECT COUNT(*) as count FROM jobs
      WHERE is_active = 1
        AND posted_at >= date('now')
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `
    const todayResult = await env.MEGAWE_DB.prepare(todayQuery).first()

    // Get top locations
    const locationsQuery = `
      SELECT location, COUNT(*) as count
      FROM jobs
      WHERE is_active = 1 AND location IS NOT NULL
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      GROUP BY location
      ORDER BY count DESC
      LIMIT 10
    `
    const locationsResult = await env.MEGAWE_DB.prepare(locationsQuery).all()

    // Get top categories
    const categoriesQuery = `
      SELECT category, COUNT(*) as count
      FROM jobs
      WHERE is_active = 1 AND category IS NOT NULL
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      GROUP BY category
      ORDER BY count DESC
      LIMIT 10
    `
    const categoriesResult = await env.MEGAWE_DB.prepare(categoriesQuery).all()

    // Get employment types
    const typesQuery = `
      SELECT type, COUNT(*) as count
      FROM jobs
      WHERE is_active = 1 AND type IS NOT NULL
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      GROUP BY type
      ORDER BY count DESC
    `
    const typesResult = await env.MEGAWE_DB.prepare(typesQuery).all()

    const stats = {
      totalJobs: totalJobsResult?.count || 0,
      totalCompanies: totalCompaniesResult?.count || 0,
      jobsAddedToday: todayResult?.count || 0,
      topLocations: (locationsResult.results || []).map((row: any) => ({
        name: row.location,
        count: row.count,
        slug: row.location.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      })),
      topCategories: (categoriesResult.results || []).map((row: any) => ({
        name: row.category,
        count: row.count,
        slug: row.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      })),
      employmentTypes: (typesResult.results || []).map((row: any) => ({
        name: row.type,
        count: row.count
      }))
    }

    const response = {
      success: true,
      data: stats,
      meta: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime,
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
    console.error('Stats summary API error:', error)

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