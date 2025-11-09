/**
 * SkeletonCard Component
 *
 * Loading skeleton for job cards and other content cards
 * with smooth animations and proper accessibility.
 */

interface SkeletonCardProps {
  className?: string
  variant?: 'job' | 'company' | 'default'
}

export function SkeletonCard({ className = '', variant = 'default' }: SkeletonCardProps) {
  const baseClasses = 'card animate-pulse'
  const variantClasses = {
    job: 'h-64',
    company: 'h-48',
    default: 'h-32',
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="card-header">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="card-content">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>

        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

/**
 * Skeleton for loading text content
 */
export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{
            width: index === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton for loading avatars
 */
export function SkeletonAvatar({
  size = 'medium',
  className = '',
}: {
  size?: 'small' | 'medium' | 'large'
  className?: string
}) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse ${className}`}
    />
  )
}

/**
 * Skeleton for loading buttons
 */
export function SkeletonButton({
  width = 'w-24',
  height = 'h-10',
  className = '',
}: {
  width?: string
  height?: string
  className?: string
}) {
  return (
    <div
      className={`${width} ${height} bg-gray-200 rounded-lg animate-pulse ${className}`}
    />
  )
}

/**
 * Skeleton for loading statistics
 */
export function SkeletonStat({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 mx-auto animate-pulse" />
      <div className="h-8 bg-gray-200 rounded mb-2 mx-auto animate-pulse w-20" />
      <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse" />
    </div>
  )
}

export default SkeletonCard