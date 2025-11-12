import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Atomic Badge Component
 *
 * Ultra-lightweight badge for status and metadata
 * - Minimal rendering cost
 * - Semantic color coding
 * - High contrast for accessibility
 * - Compact design
 */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean
  children: ReactNode
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'sm',
    dot = false,
    children,
    ...props
  }, ref) => {
    const baseStyles = [
      // Base badge styles
      'inline-flex',
      'items-center',
      'gap-1',
      'font-medium',
      'whitespace-nowrap',

      // Size variants
      size === 'sm' && [
        'px-2',
        'py-0.5',
        'text-xs',
        'leading-none'
      ],
      size === 'md' && [
        'px-2.5',
        'py-0.5',
        'text-sm',
        'leading-none'
      ],

      // Variant styles
      variant === 'default' && [
        'bg-gray-100',
        'text-gray-800',
        'border',
        'border-gray-200'
      ],

      variant === 'success' && [
        'bg-green-100',
        'text-green-800',
        'border',
        'border-green-200'
      ],

      variant === 'warning' && [
        'bg-yellow-100',
        'text-yellow-800',
        'border',
        'border-yellow-200'
      ],

      variant === 'error' && [
        'bg-red-100',
        'text-red-800',
        'border',
        'border-red-200'
      ],

      variant === 'info' && [
        'bg-blue-100',
        'text-blue-800',
        'border',
        'border-blue-200'
      ]
    ].filter(Boolean).join(' ')

    return (
      <span
        ref={ref}
        className={cn(baseStyles, className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-2',
              'h-2',
              'rounded-full',
              'flex-shrink-0',

              // Dot colors
              variant === 'default' && 'bg-gray-500',
              variant === 'success' && 'bg-green-500',
              variant === 'warning' && 'bg-yellow-500',
              variant === 'error' && 'bg-red-500',
              variant === 'info' && 'bg-blue-500'
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'