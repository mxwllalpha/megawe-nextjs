import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Atomic Skeleton Component
 *
 * Performance-optimized loading skeleton
 * - CSS animations for smooth loading states
 * - Multiple shape variants
 * - Zero layout shift (CLS optimization)
 * - Accessible with proper ARIA labels
 */

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number // For text variant
  animate?: boolean
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    className,
    variant = 'rectangular',
    width,
    height,
    lines = 1,
    animate = true,
    style,
    ...props
  }, ref) => {
    const baseStyles = [
      'bg-gray-200',
      'rounded',
      animate && 'animate-pulse'
    ].filter(Boolean)

    const variantStyles = {
      text: 'h-4 rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-md'
    }

    const computedStyle = {
      width: width || style?.width,
      height: height || style?.height,
      ...style
    }

    // Text variant with multiple lines
    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }, (_, index) => (
            <div
              key={index}
              className={cn(
                baseStyles,
                'h-4 rounded-md',
                animate && 'animate-pulse'
              )}
              style={{
                width: index === lines - 1 ? '70%' : '100%',
                height: computedStyle?.height || '16px'
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          className
        )}
        style={computedStyle}
        aria-hidden="true"
        role="presentation"
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'