'use client'

import { forwardRef, useState, useCallback, type HTMLAttributes } from 'react'
import { Card } from '@/components/ui/atomic/Card'
import { Badge } from '@/components/ui/atomic/Badge'
import { Button } from '@/components/ui/atomic/Button'
import { cn } from '@/lib/utils/cn'
import type { Job } from '@/lib/types'

/**
 * Minimalist JobCard Component
 *
 * Performance-optimized job card with:
 * - Zero CLS (explicit dimensions)
 * - Minimal DOM footprint
 * - Essential information only
 * - Built-in accessibility
 * - Fast interactions
 */

export interface JobCardProps extends HTMLAttributes<HTMLDivElement> {
  job: Job
  variant?: 'default' | 'compact' | 'featured'
  showSaveButton?: boolean
  onJobClick?: (job: Job) => void
  onSaveJob?: (jobId: string, saved: boolean) => void
  onQuickApply?: (jobId: string) => void
}

export const JobCard = forwardRef<HTMLDivElement, JobCardProps>(
  ({
    job,
    variant = 'default',
    showSaveButton = true,
    onJobClick,
    onSaveJob,
    onQuickApply,
    className,
    ...props
  }, ref) => {
    const [isSaved, setIsSaved] = useState(false)
    const [isImageLoading, setIsImageLoading] = useState(true)
    const [hasImageError, setHasImageError] = useState(false)

    // Memoized handlers to prevent unnecessary re-renders
    const handleCardClick = useCallback(() => {
      onJobClick?.(job)
    }, [onJobClick, job])

    const handleSaveClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      setIsSaved(!isSaved)
      onSaveJob?.(job.id, !isSaved)
    }, [isSaved, onSaveJob, job.id])

    const handleQuickApply = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onQuickApply?.(job.id)
    }, [onQuickApply, job.id])

    const handleImageLoad = useCallback(() => {
      setIsImageLoading(false)
    }, [])

    const handleImageError = useCallback(() => {
      setHasImageError(true)
      setIsImageLoading(false)
    }, [])

    // Format salary for display
    const formatSalary = useCallback((salary?: Job['salary']) => {
      if (!salary || !salary.showSalary) return null

      const { min, max, currency = 'IDR', period = 'month' } = salary
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })

      if (min && max) {
        return `${formatter.format(min)} - ${formatter.format(max)}/${period}`
      } else if (min) {
        return `${formatter.format(min)}/${period}`
      }
      return null
    }, [])

    // Format posted date
    const formatPostedDate = useCallback((postedAt: string) => {
      const date = new Date(postedAt)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return 'Yesterday'
      if (diffDays <= 7) return `${diffDays}d ago`
      if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}w ago`
      return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
    }, [])

    const salaryDisplay = formatSalary(job.salary)
    const postedTime = formatPostedDate(job.postedAt)

    // Variant-specific styling
    const isCompact = variant === 'compact'
    const isFeatured = variant === 'featured'

    return (
      <Card
        ref={ref}
        variant={isFeatured ? 'elevated' : 'default'}
        hover
        focusable
        className={cn(
          'group cursor-pointer transition-all duration-200',
          isFeatured && 'ring-2 ring-blue-100 hover:ring-blue-200',
          isCompact && 'p-3',
          className
        )}
        onClick={handleCardClick}
        role="article"
        aria-label={`Job: ${job.title} at ${job.company}`}
        {...props}
      >
        {/* Card Header - Company Info */}
        <div className={cn(
          'flex items-start gap-4',
          isCompact ? 'mb-3' : 'mb-4'
        )}>
          {/* Company Logo - Optimized loading */}
          <div className={cn(
            'flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden border border-gray-200',
            isCompact ? 'w-12 h-12' : 'w-14 h-14'
          )}>
            {job.companyData?.logo && !hasImageError ? (
              <>
                {isImageLoading && (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                )}
                <img
                  src={job.companyData.logo}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain p-2"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-1/2 h-1/2 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Job Title and Company */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2',
              isCompact ? 'text-sm leading-tight mb-1' : 'text-base leading-tight mb-1'
            )}>
              {job.title}
            </h3>
            <p className={cn(
              'text-blue-700 font-medium truncate mb-1',
              isCompact ? 'text-xs' : 'text-sm'
            )}>
              {job.company}
            </p>
            {job.companyData?.industry && !isCompact && (
              <p className="text-xs text-gray-500 truncate">
                {job.companyData.industry}
              </p>
            )}
          </div>

          {/* Save Button */}
          {showSaveButton && (
            <button
              onClick={handleSaveClick}
              className={cn(
                'p-2 rounded-lg transition-all flex-shrink-0 border',
                'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                isSaved
                  ? 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100'
                  : 'text-gray-400 bg-white border-gray-200 hover:text-red-500'
              )}
              aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
              type="button"
            >
              <svg
                className={cn(
                  'w-5 h-5',
                  isSaved && 'fill-current'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Job Details Grid */}
        <div className={cn(
          'grid grid-cols-1 gap-3',
          !isCompact && 'border-t border-gray-100 pt-3'
        )}>
          {/* Location and Employment Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{job.location}</span>
            </div>

            <span className="text-gray-300">•</span>

            <div className="flex items-center gap-1.5 text-gray-600">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A6 6 0 0112 17.255a6 6 0 01-9-5.245V7a4 4 0 018 0v6.255z" />
              </svg>
              <span className="capitalize font-medium">
                {job.employmentType?.replace('-', ' ')}
              </span>
            </div>

            {job.isRemote && (
              <>
                <span className="text-gray-300">•</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Remote
                </span>
              </>
            )}
          </div>

          {/* Salary and Quota Row */}
          <div className="flex items-center justify-between">
            {salaryDisplay && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-sm font-semibold text-green-600">
                  {salaryDisplay}
                </span>
              </div>
            )}

            {job.quota && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium">
                  {job.availableQuota || job.quota} spots
                </span>
              </div>
            )}

            <time className="text-xs text-gray-500 ml-auto" dateTime={job.postedAt}>
              {postedTime}
            </time>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleQuickApply}
              className="flex-1 text-xs font-medium h-8 bg-blue-600 hover:bg-blue-700"
            >
              Apply Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => console.log('View details:', job.id)}
              className="text-xs font-medium h-8 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Details
            </Button>
          </div>
        </div>

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-2 right-2">
            <Badge variant="warning" size="sm" dot>
              Featured
            </Badge>
          </div>
        )}
      </Card>
    )
  }
)

JobCard.displayName = 'JobCard'