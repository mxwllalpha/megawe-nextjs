import { Skeleton } from '@/components/ui/atomic/Skeleton'
import { Card } from '@/components/ui/atomic/Card'
import { cn } from '@/lib/utils/cn'

/**
 * JobCard Skeleton Component
 *
 * Performance-optimized loading skeleton that prevents CLS
 * - Matches exact JobCard dimensions
 * - Smooth animations
 * - Accessibility ready
 */

export interface JobCardSkeletonProps {
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

export function JobCardSkeleton({
  variant = 'default',
  className
}: JobCardSkeletonProps) {
  const isCompact = variant === 'compact'

  return (
    <Card
      variant="default"
      className={cn(
        'pointer-events-none',
        isCompact && 'p-3',
        className
      )}
      role="presentation"
      aria-label="Loading job posting"
    >
      <div className={cn(
        'flex items-start gap-3',
        isCompact ? 'mb-2' : 'mb-3'
      )}>
        {/* Company Logo Skeleton */}
        <Skeleton
          variant="circular"
          width={isCompact ? 40 : 48}
          height={isCompact ? 40 : 48}
        />

        {/* Title and Company Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton
            variant="text"
            width="100%"
            height={isCompact ? 16 : 20}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={isCompact ? 12 : 16}
          />
          {!isCompact && (
            <Skeleton
              variant="text"
              width="40%"
              height={12}
            />
          )}
        </div>

        {/* Save Button Skeleton */}
        <Skeleton
          variant="rectangular"
          width={32}
          height={32}
        />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2">
        {/* Location and Type */}
        <div className="flex items-center gap-3">
          <Skeleton variant="text" width={80} height={12} />
          <Skeleton variant="text" width={4} height={12} />
          <Skeleton variant="text" width={60} height={12} />
        </div>

        {/* Salary and Quota */}
        <div className="flex items-center gap-3">
          <Skeleton variant="text" width={100} height={12} />
          <Skeleton variant="text" width={80} height={12} />
        </div>

        {/* Posted Time and Actions */}
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={60} height={12} />
          {!isCompact && (
            <Skeleton variant="rectangular" width={80} height={28} />
          )}
        </div>
      </div>
    </Card>
  )
}