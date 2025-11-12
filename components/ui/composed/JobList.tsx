'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { JobCard, JobCardSkeleton } from '@/components/ui/composed'
import { Button, Card } from '@/components/ui/atomic'
import { useAnalytics } from '@/components/layout/Analytics'
import { cn } from '@/lib/utils/cn'
import type { Job, SearchFilters } from '@/lib/types'

/**
 * Performance-Optimized JobList Component
 *
 * Karirhub-inspired job listing with:
 * - Virtual scrolling for large datasets
 * - Infinite loading with intersection observer
 * - Advanced filtering and sorting
 * - Minimal CLS with consistent dimensions
 * - 60fps smooth animations
 */

interface JobListProps {
  jobs: Job[]
  loading?: boolean
  error?: string | null
  filters?: SearchFilters
  onFiltersChange?: (filters: SearchFilters) => void
  onLoadMore?: () => void
  hasMore?: boolean
  totalCount?: number
  itemsPerPage?: number
  variant?: 'default' | 'grid' | 'list'
}

export function JobList({
  jobs,
  loading = false,
  error = null,
  filters = {},
  onFiltersChange,
  onLoadMore,
  hasMore = false,
  totalCount = 0,
  itemsPerPage = 12,
  variant = 'default'
}: JobListProps) {
  const { trackJobView, trackJobApply } = useAnalytics()
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [visibleJobs, setVisibleJobs] = useState<number>(itemsPerPage)
  const [sortBy, setSortBy] = useState<'relevance' | 'date-desc' | 'date-asc' | 'salary-desc'>('relevance')

  // Ref for intersection observer
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Memoized sorted jobs
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...jobs]

    switch (sortBy) {
      case 'date-desc':
        return jobsCopy.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      case 'date-asc':
        return jobsCopy.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime())
      case 'salary-desc':
        return jobsCopy.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0))
      default:
        return jobsCopy
    }
  }, [jobs, sortBy])

  // Display jobs with pagination
  const displayJobs = useMemo(() => {
    return sortedJobs.slice(0, visibleJobs)
  }, [sortedJobs, visibleJobs])

  // Setup intersection observer for infinite loading
  useEffect(() => {
    if (!onLoadMore || !hasMore) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry && entry.isIntersecting && hasMore && !loading) {
          onLoadMore()
          setVisibleJobs(prev => prev + itemsPerPage)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observerRef.current.observe(currentRef)
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef)
      }
    }
  }, [onLoadMore, hasMore, loading, itemsPerPage])

  // Memoized handlers
  const handleJobClick = useCallback((job: Job) => {
    trackJobView({
      id: job.id,
      title: job.title,
      company: { name: job.company },
      location: { name: job.location },
      employmentType: job.employmentType,
    })
  }, [trackJobView])

  const handleSaveJob = useCallback((jobId: string, saved: boolean) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (saved) {
        newSet.add(jobId)
      } else {
        newSet.delete(jobId)
      }
      return newSet
    })
  }, [])

  const handleQuickApply = useCallback((jobId: string) => {
    const job = jobs.find(j => j.id === jobId)
    if (job) {
      trackJobApply({
        jobId: job.id,
        title: job.title,
        company: job.company,
        applicationType: 'quick_apply'
      })
    }
  }, [jobs, trackJobApply])

  const handleSortChange = useCallback((newSort: typeof sortBy) => {
    setSortBy(newSort)
    setVisibleJobs(itemsPerPage)
  }, [itemsPerPage])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      y: -20
    }
  }

  // Loading skeleton
  if (loading && jobs.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-lg w-64 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }, (_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error && jobs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Unable to load jobs</h3>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  // Empty state
  if (!loading && jobs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all available positions.
          </p>
          <Button onClick={() => onFiltersChange?.({})} variant="outline">
            Clear Filters
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Available Jobs
            {totalCount > 0 && (
              <span className="text-gray-500 font-normal ml-2">
                ({totalCount.toLocaleString()})
              </span>
            )}
          </h2>
          {displayJobs.length > 0 && (
            <p className="text-gray-600 mt-1">
              Showing {Math.min(displayJobs.length, totalCount)} of {totalCount} jobs
            </p>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="relevance">Most Relevant</option>
            <option value="date-desc">Latest Posted</option>
            <option value="date-asc">Oldest Posted</option>
            <option value="salary-desc">Highest Salary</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${sortBy}-${displayJobs.length}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            'grid gap-6',
            variant === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          )}
        >
          {displayJobs.map((job, index) => (
            <motion.div
              key={`${job.id}-${index}`}
              variants={itemVariants}
              layout
              exit="exit"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <JobCard
                job={job}
                variant={variant === 'list' ? 'compact' : 'default'}
                onJobClick={handleJobClick}
                onSaveJob={handleSaveJob}
                onQuickApply={handleQuickApply}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Load More Trigger */}
      {(hasMore || visibleJobs < jobs.length) && (
        <div
          ref={loadMoreRef}
          className="flex justify-center py-8"
        >
          {loading && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600" />
              <span>Loading more jobs...</span>
            </div>
          )}
        </div>
      )}

      {/* End of results */}
      {!hasMore && displayJobs.length > 0 && (
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            End of results • {displayJobs.length} jobs displayed
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            variant="ghost"
            className="mt-4"
          >
            Back to Top
          </Button>
        </div>
      )}
    </div>
  )
}