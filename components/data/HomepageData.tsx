'use client'

import { useFeaturedJobs, useJobStats } from '@/lib/api/hooks'
import { FeaturedJobs } from '@/components/job/FeaturedJobs'
import { StatsSection } from '@/components/layout/StatsSection'
import { SkeletonCard } from '@/components/ui/SkeletonCard'

/**
 * HomepageData Component
 *
 * Client component that handles data fetching for the homepage
 * using React Query hooks for optimal caching and performance.
 */

export function HomepageData() {
  const {
    data: featuredJobsData,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useFeaturedJobs(6)

  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useJobStats()

  // Handle loading state
  if (isLoadingJobs || isLoadingStats) {
    return (
      <>
        {/* Featured Jobs Skeleton */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Opportunities
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Loading featured job opportunities...
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section Skeleton */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Indonesian Talent
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Loading platform statistics...
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 mx-auto animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    )
  }

  // Handle error state
  if (jobsError || statsError) {
    return (
      <>
        {/* Error Message */}
        <section className="py-16 bg-red-50">
          <div className="container-custom text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              Unable to Load Data
            </h2>
            <p className="text-red-700 max-w-2xl mx-auto mb-8">
              We're having trouble loading the latest job opportunities. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </section>
      </>
    )
  }

  // Handle empty data state
  const jobs = featuredJobsData?.success ? featuredJobsData.data || [] : []
  const stats = statsData?.success ? (statsData.data || {
    totalJobs: 0,
    totalCompanies: 0,
    totalCategories: 0,
    totalLocations: 0,
    jobsByCategory: [],
    jobsByType: [],
    jobsByLocation: [],
    salaryRanges: [],
    recentActivity: {
      jobsAddedToday: 0,
      jobsAddedThisWeek: 0,
      jobsAddedThisMonth: 0,
      lastSyncTime: new Date().toISOString(),
    },
    newJobsToday: 0,
    newJobsThisWeek: 0,
    activeLocations: 0,
    featuredJobs: 0,
    remoteJobs: 0,
    popularLocations: [],
    popularCompanies: [],
    popularIndustries: [],
  }) : {
    totalJobs: 0,
    totalCompanies: 0,
    totalCategories: 0,
    totalLocations: 0,
    jobsByCategory: [],
    jobsByType: [],
    jobsByLocation: [],
    salaryRanges: [],
    recentActivity: {
      jobsAddedToday: 0,
      jobsAddedThisWeek: 0,
      jobsAddedThisMonth: 0,
      lastSyncTime: new Date().toISOString(),
    },
    newJobsToday: 0,
    newJobsThisWeek: 0,
    activeLocations: 0,
    featuredJobs: 0,
    remoteJobs: 0,
    popularLocations: [],
    popularCompanies: [],
    popularIndustries: [],
  }

  return (
    <>
      {/* Featured Jobs */}
      <FeaturedJobs jobs={jobs} />

      {/* Statistics */}
      <StatsSection stats={stats as any} />
    </>
  )
}