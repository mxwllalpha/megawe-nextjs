/**
 * API Client for Megawe Worker Integration
 *
 * This client handles all communication with the megawe-worker API
 * providing type-safe requests with proper error handling and caching.
 */

import { z } from 'zod'
import type {
  ApiResponse,
  JobsResponse,
  JobResponse,
  CompaniesResponse,
  CompanyResponse,
  SearchResponse,
  StatsResponse,
  SearchFilters,
  Job,
  Company,
  JobStats,
} from '@/lib/types'

/**
 * API Client Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://megawe-worker.tekipik.workers.dev'
const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://megawe-worker.tekipik.workers.dev'

/**
 * Request configuration
 */
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  revalidate?: number // ISR cache duration in seconds
  tags?: string[] // Cache tags for invalidation
}

/**
 * API Client Class
 */
export class MegaweAPI {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = API_BASE_URL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Megawe-NextJS/1.0.0',
    }
  }

  /**
   * Generic request method with type safety
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      revalidate = 900, // 15 minutes default
      tags = [],
    } = config

    const url = `${this.baseURL}${endpoint}`
    const requestHeaders = { ...this.defaultHeaders, ...headers }

    try {
      // For Next.js 13+ App Router with fetch caching
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        // Next.js caching options
        next: {
          revalidate,
          tags: [`megawe-api`, ...tags],
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      // Validate response structure
      const validatedData = this.validateResponse(data)

      return validatedData as ApiResponse<T>
    } catch (error) {
      console.error(`API Request Failed: ${method} ${endpoint}`, error)

      // Return error response
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: undefined,
      }
    }
  }

  /**
   * Validate API response structure
   */
  private validateResponse(data: any): ApiResponse {
    // Basic validation for API response structure
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid API response format')
    }

    return {
      success: Boolean(data.success),
      data: data.data,
      error: data.error,
      message: data.message,
      pagination: data.pagination,
    }
  }

  /**
   * Job-related API methods
   */

  /**
   * Get all jobs with optional filtering
   */
  async getJobs(filters: SearchFilters = {}): Promise<JobsResponse> {
    const params = new URLSearchParams()

    // Build query string from filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    const endpoint = `/api/jobs${params.toString() ? `?${params.toString()}` : ''}`
    const cacheTags = ['jobs', 'job-list']

    // Add specific cache tags based on filters
    if (filters.location) cacheTags.push(`jobs-location:${filters.location}`)
    if (filters.companyId) cacheTags.push(`jobs-company:${filters.companyId}`)
    if (filters.employmentType) {
      filters.employmentType.forEach(type =>
        cacheTags.push(`jobs-type:${type}`)
      )
    }

    return this.request(endpoint, {
      revalidate: 900, // 15 minutes for job listings
      tags: cacheTags,
    })
  }

  /**
   * Get job by ID
   */
  async getJob(id: string): Promise<JobResponse> {
    return this.request(`/api/jobs/${id}`, {
      revalidate: 3600, // 1 hour for individual jobs
      tags: [`job:${id}`],
    })
  }

  /**
   * Get featured jobs
   */
  async getFeaturedJobs(limit = 6): Promise<JobsResponse> {
    return this.request(`/api/jobs?featured=true&limit=${limit}`, {
      revalidate: 1800, // 30 minutes for featured jobs
      tags: ['featured-jobs'],
    })
  }

  /**
   * Search jobs
   */
  async searchJobs(query: string, filters: SearchFilters = {}): Promise<SearchResponse> {
    const params = new URLSearchParams({ q: query })

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    const endpoint = `/api/jobs/search?${params.toString()}`

    return this.request(endpoint, {
      method: 'POST',
      body: { query, filters },
      revalidate: 600, // 10 minutes for search results
      tags: ['search', `search:${query.toLowerCase()}`],
    })
  }

  /**
   * Company-related API methods
   */

  /**
   * Get all companies
   */
  async getCompanies(limit = 20): Promise<CompaniesResponse> {
    return this.request(`/api/companies?limit=${limit}`, {
      revalidate: 3600, // 1 hour for companies
      tags: ['companies'],
    })
  }

  /**
   * Get company by ID
   */
  async getCompany(id: string): Promise<CompanyResponse> {
    return this.request(`/api/companies/${id}`, {
      revalidate: 3600, // 1 hour for company details
      tags: [`company:${id}`],
    })
  }

  /**
   * Get companies by location
   */
  async getCompaniesByLocation(locationId: string): Promise<CompaniesResponse> {
    return this.request(`/api/companies?locationId=${locationId}`, {
      revalidate: 1800, // 30 minutes for location-based companies
      tags: ['companies', `companies-location:${locationId}`],
    })
  }

  /**
   * Statistics and analytics
   */

  /**
   * Get job statistics
   */
  async getJobStats(): Promise<StatsResponse> {
    return this.request('/api/stats', {
      revalidate: 3600, // 1 hour for stats
      tags: ['stats', 'job-stats'],
    })
  }

  /**
   * Categories and locations
   */

  /**
   * Get job categories
   */
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request('/api/jobs/categories/list', {
      revalidate: 86400, // 24 hours for categories
      tags: ['categories'],
    })
  }

  /**
   * Get locations
   */
  async getLocations(): Promise<ApiResponse<any[]>> {
    return this.request('/api/jobs/locations/list', {
      revalidate: 86400, // 24 hours for locations
      tags: ['locations'],
    })
  }

  /**
   * SEO and metadata
   */

  /**
   * Get sitemap
   */
  async getSitemap(): Promise<string> {
    const response = await fetch(`${this.baseURL}/seo/sitemap.xml`, {
      next: {
        revalidate: 86400, // 24 hours for sitemap
        tags: ['sitemap'],
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`)
    }

    return response.text()
  }

  /**
   * Get robots.txt
   */
  async getRobotsTxt(): Promise<string> {
    const response = await fetch(`${this.baseURL}/seo/robots.txt`, {
      next: {
        revalidate: 86400, // 24 hours for robots.txt
        tags: ['robots'],
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch robots.txt: ${response.statusText}`)
    }

    return response.text()
  }

  /**
   * Get schema markup for job
   */
  async getJobSchema(jobId: string): Promise<any> {
    return this.request(`/seo/schema/${jobId}`, {
      revalidate: 3600, // 1 hour for schema
      tags: [`schema:${jobId}`, 'job-schemas'],
    })
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/health', {
      revalidate: 60, // 1 minute for health checks
      tags: ['health'],
    })
  }

  /**
   * Utility methods
   */

  /**
   * Clear cache for specific tags (server-side)
   */
  async clearCache(tags: string[]): Promise<void> {
    if (typeof window === 'undefined') {
      // Server-side cache invalidation
      try {
        await fetch(`${this.baseURL}/api/cache/clear`, {
          method: 'POST',
          headers: this.defaultHeaders,
          body: JSON.stringify({ tags }),
        })
      } catch (error) {
        console.error('Failed to clear cache:', error)
      }
    }
  }
}

/**
 * Create singleton API client instance
 */
export const megaweAPI = new MegaweAPI()

/**
 * Default export for convenience
 */
export default megaweAPI

/**
 * React hooks for API integration
 */
export function useMegaweAPI() {
  return {
    megaweAPI,
    // Add any additional utilities here
  }
}