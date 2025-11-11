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
  EmploymentType,
  ExperienceLevel,
  SalaryPeriod,
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
 * API Response Mapper
 * Maps worker API responses to frontend TypeScript types
 */
class ApiResponseMapper {
  /**
   * Map worker API job response to frontend Job interface
   */
  static mapJob(workerJob: any): Job {
    return {
      id: workerJob.id,
      title: workerJob.title,
      slug: workerJob.seo?.slug || workerJob.title.toLowerCase().replace(/\s+/g, '-'),
      description: workerJob.description || '',
      requirements: workerJob.requirements || [],
      responsibilities: workerJob.responsibilities || [],
      benefits: workerJob.benefits || [],
      skills: workerJob.skills || workerJob.tags || [],
      tags: workerJob.tags || [],

      // Company information
      company: workerJob.company || '',
      companyData: {
        id: workerJob.employerId || '',
        name: workerJob.company || '',
        slug: workerJob.company?.toLowerCase().replace(/\s+/g, '-') || '',
        description: workerJob.employerData?.description || '',
        logo: undefined, // Not available in API yet
        website: workerJob.employerData?.website || '',
        industry: workerJob.category || '',
        companySize: '1-10' as any, // Default value
        foundedYear: undefined,
        email: workerJob.employerData?.email || '',
        phone: workerJob.employerData?.phone || '',
        address: workerJob.location || '',
        location: {
          id: workerJob.regionId || '',
          name: workerJob.location || '',
          slug: workerJob.location?.toLowerCase().replace(/\s+/g, '-'),
          type: 'city' as any,
          coordinates: {
            lat: workerJob.latitude || 0,
            lng: workerJob.longitude || 0,
          },
          country: 'Indonesia',
          countryCode: 'ID',
          jobsCount: 0,
          companiesCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        benefits: [],
        culture: '',
        values: [],
        metaTitle: '',
        metaDescription: '',
        activeJobsCount: 0,
        totalJobsCount: 0,
        verified: false,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // Location information
      location: workerJob.location || '',
      locationData: undefined,
      isRemote: workerJob.type === 'remote',
      isHybrid: false,

      // Enhanced location data from API
      postalCode: workerJob.postalCode,
      locationHierarchy: workerJob.locationHierarchy,
      latitude: workerJob.latitude,
      longitude: workerJob.longitude,

      // Job details
      employmentType: this.mapEmploymentType(workerJob.type || workerJob.employmentType),
      experienceLevel: this.mapExperienceLevel(workerJob.minYearExperience),
      salary: workerJob.salary ? {
        min: workerJob.salary.min,
        max: workerJob.salary.max,
        currency: workerJob.salary.currency || 'IDR',
        period: this.mapSalaryPeriod(workerJob.salary.type || workerJob.salary.period),
        showSalary: workerJob.salary.showSalary || workerJob.showSalary,
        type: workerJob.salary.type || workerJob.salary.period,
      } : undefined,
      type: workerJob.type,
      category: workerJob.category,
      department: workerJob.category,

      // Quota information
      quota: workerJob.quota,
      availableQuota: workerJob.availableQuota,
      usageQuota: workerJob.usageQuota,

      // Enhanced metadata
      employerId: workerJob.employerId,
      employerData: workerJob.employerData,
      source: workerJob.source || 'kemnaker',
      sourceUrl: workerJob.sourceUrl,
      applicationUrl: workerJob.applicationUrl,
      applicationEmail: undefined,
      applicationDeadline: workerJob.expiresAt,
      expiresAt: workerJob.expiresAt,
      isActive: workerJob.isActive !== false,

      // SEO and structured data
      metaTitle: workerJob.seo?.title,
      metaDescription: workerJob.seo?.description,
      seo: workerJob.seo,
      jsonldSchema: workerJob.jsonldSchema,
      keywords: workerJob.seo?.keywords || workerJob.tags || [],

      // Timestamps
      postedAt: workerJob.postedAt || new Date().toISOString(),
      updatedAt: workerJob.updatedAt,
      createdAt: workerJob.createdAt,

      // Statistics
      viewCount: 0,
      applicationCount: 0,
      featured: false,
      priority: 0,

      // Additional API fields
      jobId: workerJob.jobId,
      jobTypeId: workerJob.jobTypeId,
      jobFunctionId: workerJob.jobFunctionId,
      minEducationId: workerJob.minEducationId,
      regionId: workerJob.regionId,
      cityId: workerJob.cityId,
      gender: workerJob.gender,
      physicalCondition: workerJob.physicalCondition,
      maritalStatus: workerJob.maritalStatus,
      minYearExperience: workerJob.minYearExperience,
      minAge: workerJob.minAge,
      maxAge: workerJob.maxAge,
      confidential: workerJob.confidential,
      platformType: workerJob.platformType,
      platformId: workerJob.platformId,
      platformLink: workerJob.platformLink,
      showSalary: workerJob.showSalary,
    }
  }

  /**
   * Map employment type from API to frontend enum
   */
  private static mapEmploymentType(type?: string): EmploymentType {
    if (!type) return 'full-time'

    const typeMap: Record<string, EmploymentType> = {
      'full-time': 'full-time',
      'part-time': 'part-time',
      'contract': 'contract',
      'temporary': 'temporary',
      'internship': 'internship',
      'freelance': 'freelance',
      'volunteer': 'volunteer',
    }
    return typeMap[type.toLowerCase()] || 'full-time'
  }

  /**
   * Map experience level from years to enum
   */
  private static mapExperienceLevel(years?: number): ExperienceLevel | undefined {
    if (!years && years !== 0) return undefined
    if (years < 1) return 'entry-level'
    if (years < 3) return 'junior'
    if (years < 5) return 'mid-level'
    if (years < 8) return 'senior'
    if (years < 12) return 'lead'
    return 'manager'
  }

  /**
   * Map salary period from API to frontend enum
   */
  private static mapSalaryPeriod(period?: string): SalaryPeriod {
    if (!period) return 'month'

    const periodMap: Record<string, SalaryPeriod> = {
      'hour': 'hour',
      'day': 'day',
      'week': 'week',
      'month': 'month',
      'year': 'year',
      'hourly': 'hour',
      'daily': 'day',
      'weekly': 'week',
      'monthly': 'month',
      'yearly': 'year',
    }
    return periodMap[period.toLowerCase()] || 'month'
  }

  /**
   * Map API stats response to frontend JobStats interface
   */
  static mapJobStats(apiStats: any): JobStats {
    return {
      totalJobs: apiStats.totalJobs || 0,
      totalCompanies: apiStats.totalCompanies || 0,
      totalCategories: apiStats.totalCategories || 0,
      totalLocations: apiStats.totalLocations || 0,
      jobsByCategory: apiStats.jobsByCategory || [],
      jobsByType: apiStats.jobsByType || [],
      jobsByLocation: apiStats.jobsByLocation || [],
      salaryRanges: apiStats.salaryRanges || [],
      recentActivity: {
        jobsAddedToday: apiStats.recentActivity?.jobsAddedToday || apiStats.newJobsToday || 0,
        jobsAddedThisWeek: apiStats.recentActivity?.jobsAddedThisWeek || apiStats.newJobsThisWeek || 0,
        jobsAddedThisMonth: apiStats.recentActivity?.jobsAddedThisMonth || 0,
        lastSyncTime: apiStats.recentActivity?.lastSyncTime || new Date().toISOString(),
      },

      // Legacy compatibility
      newJobsToday: apiStats.recentActivity?.jobsAddedToday || apiStats.newJobsToday || 0,
      newJobsThisWeek: apiStats.recentActivity?.jobsAddedThisWeek || apiStats.newJobsThisWeek || 0,
      activeLocations: apiStats.totalLocations || 0,
      featuredJobs: 0,
      remoteJobs: 0,
      popularLocations: [],
      popularCompanies: [],
      popularIndustries: [],
    }
  }
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
    const response = await this.request(`/api/featured-jobs?limit=${limit}`, {
      revalidate: 1800, // 30 minutes for featured jobs
      tags: ['featured-jobs'],
    })

    // Map the API response to frontend types
    if (response.success && response.data) {
      response.data = (response.data as any[]).map((job: any) => ApiResponseMapper.mapJob(job))
    }

    return response as JobsResponse
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
    const response = await this.request('/api/stats/summary', {
      revalidate: 3600, // 1 hour for stats
      tags: ['stats', 'job-stats'],
    })

    // Map the API response to frontend types
    if (response.success && response.data) {
      response.data = ApiResponseMapper.mapJobStats(response.data)
    }

    return response as StatsResponse
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