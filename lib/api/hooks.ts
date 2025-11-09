/**
 * React Query Hooks for Megawe API Integration
 *
 * Custom hooks using TanStack Query for server state management
 * with optimistic updates and proper error handling.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { megaweAPI } from './client'
import type {
  Job,
  Company,
  SearchFilters,
  JobStats,
  ApiResponse,
  JobsResponse,
  JobResponse,
  CompaniesResponse,
  CompanyResponse,
  SearchResponse,
  StatsResponse,
} from '@/lib/types'
// Import schemas (will be implemented later)
// import { jobSchema, companySchema } from '@/lib/types/schemas'

/**
 * Query key factory for consistent cache keys
 */
export const queryKeys = {
  // Jobs
  jobs: ['jobs'] as const,
  jobsList: (filters?: SearchFilters) => ['jobs', 'list', filters] as const,
  jobDetail: (id: string) => ['jobs', 'detail', id] as const,
  featuredJobs: () => ['jobs', 'featured'] as const,
  searchJobs: (query: string, filters?: SearchFilters) =>
    ['jobs', 'search', query, filters] as const,

  // Companies
  companies: ['companies'] as const,
  companiesList: (limit?: number) => ['companies', 'list', limit] as const,
  companyDetail: (id: string) => ['companies', 'detail', id] as const,
  companiesByLocation: (locationId: string) =>
    ['companies', 'location', locationId] as const,

  // Data
  categories: ['categories'] as const,
  locations: ['locations'] as const,
  stats: ['stats'] as const,

  // SEO
  sitemap: ['seo', 'sitemap'] as const,
  robots: ['seo', 'robots'] as const,
  jobSchema: (jobId: string) => ['seo', 'schema', jobId] as const,

  // System
  health: ['health'] as const,
} as const

/**
 * Default query configurations
 */
const defaultQueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
  retry: (failureCount: number, error: any) => {
    // Don't retry on 4xx errors
    if (error?.status >= 400 && error?.status < 500) {
      return false
    }
    return failureCount < 3
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
}

/**
 * Jobs-related hooks
 */

/**
 * Hook for fetching jobs with optional filters
 */
export function useJobs(filters: SearchFilters = {}) {
  return useQuery({
    queryKey: queryKeys.jobsList(filters),
    queryFn: () => megaweAPI.getJobs(filters),
    select: (data: JobsResponse) => {
      // TODO: Add schema validation when schemas are implemented
      return data
    },
    ...defaultQueryConfig,
    staleTime: 15 * 60 * 1000, // 15 minutes for job listings
  })
}

/**
 * Hook for fetching a single job by ID
 */
export function useJob(id: string) {
  return useQuery({
    queryKey: queryKeys.jobDetail(id),
    queryFn: () => megaweAPI.getJob(id),
    enabled: !!id, // Only run if ID is provided
    select: (data: JobResponse) => {
      // TODO: Add schema validation when schemas are implemented
      return data
    },
    ...defaultQueryConfig,
    staleTime: 60 * 60 * 1000, // 1 hour for individual jobs
  })
}

/**
 * Hook for fetching featured jobs
 */
export function useFeaturedJobs(limit = 6) {
  return useQuery({
    queryKey: queryKeys.featuredJobs(),
    queryFn: () => megaweAPI.getFeaturedJobs(limit),
    select: (data: JobsResponse) => {
      // TODO: Add schema validation when schemas are implemented
      return data
    },
    ...defaultQueryConfig,
    staleTime: 30 * 60 * 1000, // 30 minutes for featured jobs
  })
}

/**
 * Hook for job search
 */
export function useJobSearch(query: string, filters: SearchFilters = {}) {
  return useQuery({
    queryKey: queryKeys.searchJobs(query, filters),
    queryFn: () => megaweAPI.searchJobs(query, filters),
    enabled: !!query && query.length >= 2, // Only search with 2+ characters
    ...defaultQueryConfig,
    staleTime: 10 * 60 * 1000, // 10 minutes for search results
  })
}

/**
 * Companies-related hooks
 */

/**
 * Hook for fetching companies list
 */
export function useCompanies(limit = 20) {
  return useQuery({
    queryKey: queryKeys.companiesList(limit),
    queryFn: () => megaweAPI.getCompanies(limit),
    select: (data: CompaniesResponse) => {
      // TODO: Add schema validation when schemas are implemented
      return data
    },
    ...defaultQueryConfig,
    staleTime: 60 * 60 * 1000, // 1 hour for companies
  })
}

/**
 * Hook for fetching company by ID
 */
export function useCompany(id: string) {
  return useQuery({
    queryKey: queryKeys.companyDetail(id),
    queryFn: () => megaweAPI.getCompany(id),
    enabled: !!id,
    select: (data: CompanyResponse) => {
      // TODO: Add schema validation when schemas are implemented
      return data
    },
    ...defaultQueryConfig,
    staleTime: 60 * 60 * 1000, // 1 hour for company details
  })
}

/**
 * Hook for fetching companies by location
 */
export function useCompaniesByLocation(locationId: string) {
  return useQuery({
    queryKey: queryKeys.companiesByLocation(locationId),
    queryFn: () => megaweAPI.getCompaniesByLocation(locationId),
    enabled: !!locationId,
    ...defaultQueryConfig,
    staleTime: 30 * 60 * 1000, // 30 minutes for location-based companies
  })
}

/**
 * Data and statistics hooks
 */

/**
 * Hook for fetching job statistics
 */
export function useJobStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => megaweAPI.getJobStats(),
    ...defaultQueryConfig,
    staleTime: 60 * 60 * 1000, // 1 hour for stats
  })
}

/**
 * Hook for fetching job categories
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => megaweAPI.getCategories(),
    ...defaultQueryConfig,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours for categories
  })
}

/**
 * Hook for fetching locations
 */
export function useLocations() {
  return useQuery({
    queryKey: queryKeys.locations,
    queryFn: () => megaweAPI.getLocations(),
    ...defaultQueryConfig,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours for locations
  })
}

/**
 * SEO-related hooks
 */

/**
 * Hook for fetching sitemap (server-side only)
 */
export function useSitemap() {
  return useQuery({
    queryKey: queryKeys.sitemap,
    queryFn: () => megaweAPI.getSitemap(),
    enabled: typeof window === 'undefined', // Only run on server
    ...defaultQueryConfig,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours for sitemap
  })
}

/**
 * Hook for fetching robots.txt (server-side only)
 */
export function useRobotsTxt() {
  return useQuery({
    queryKey: queryKeys.robots,
    queryFn: () => megaweAPI.getRobotsTxt(),
    enabled: typeof window === 'undefined', // Only run on server
    ...defaultQueryConfig,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours for robots.txt
  })
}

/**
 * Hook for fetching job schema markup
 */
export function useJobSchema(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobSchema(jobId),
    queryFn: () => megaweAPI.getJobSchema(jobId),
    enabled: !!jobId,
    ...defaultQueryConfig,
    staleTime: 60 * 60 * 1000, // 1 hour for schema
  })
}

/**
 * System hooks
 */

/**
 * Hook for health check
 */
export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => megaweAPI.healthCheck(),
    ...defaultQueryConfig,
    staleTime: 1 * 60 * 1000, // 1 minute for health checks
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

/**
 * Mutations for data updates
 */

/**
 * Hook for saving job (for user favorites)
 */
export function useSaveJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobId: string) => {
      // TODO: Implement save job API call
      console.log('Saving job:', jobId)
      return { success: true, jobId }
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
    },
  })
}

/**
 * Hook for job application
 */
export function useApplyToJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ jobId, applicationData }: {
      jobId: string
      applicationData: any
    }) => {
      // TODO: Implement job application API call
      console.log('Applying to job:', jobId, applicationData)
      return { success: true, jobId }
    },
    onSuccess: (_, { jobId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.jobDetail(jobId) })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

/**
 * Utility hook for prefetching data
 */
export function usePrefetchJobs() {
  const queryClient = useQueryClient()

  return (filters: SearchFilters = {}) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.jobsList(filters),
      queryFn: () => megaweAPI.getJobs(filters),
      staleTime: 15 * 60 * 1000, // 15 minutes
    })
  }
}

/**
 * Export all hooks for easy importing
 */
export {
  useQuery,
  useMutation,
  useQueryClient,
}

/**
 * Default export with commonly used hooks
 */
export default {
  // Jobs
  useJobs,
  useJob,
  useFeaturedJobs,
  useJobSearch,

  // Companies
  useCompanies,
  useCompany,
  useCompaniesByLocation,

  // Data
  useJobStats,
  useCategories,
  useLocations,

  // System
  useHealthCheck,

  // Mutations
  useSaveJob,
  useApplyToJob,

  // Utilities
  usePrefetchJobs,

  // Query keys for custom usage
  queryKeys,
}