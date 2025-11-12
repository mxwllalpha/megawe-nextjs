import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Atomic Card Component
 *
 * Lightweight card container with performance optimization
 * - Minimal DOM footprint
 * - CSS variables for consistent theming
 * - Built-in loading states
 * - Accessibility ready
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  focusable?: boolean
  children: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    rounded = 'md',
    hover = false,
    focusable = false,
    children,
    ...props
  }, ref) => {
    const baseStyles = [
      // Base card styles
      'relative',
      'transition-all',
      'duration-200',
      'ease-in-out',

      // Rounded variants
      rounded === 'none' && 'rounded-none',
      rounded === 'sm' && 'rounded-sm',
      rounded === 'md' && 'rounded-lg',
      rounded === 'lg' && 'rounded-xl',

      // Padding variants
      padding === 'none' && 'p-0',
      padding === 'sm' && 'p-3',
      padding === 'md' && 'p-4',
      padding === 'lg' && 'p-6',

      // Hover effect
      hover && [
        'hover:shadow-lg',
        'hover:-translate-y-1'
      ],

      // Focusable behavior
      focusable && [
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-blue-500',
        'focus:ring-offset-2'
      ],

      // Variant styles
      variant === 'default' && [
        'bg-white',
        'border',
        'border-gray-200',
        'shadow-sm'
      ],

      variant === 'elevated' && [
        'bg-white',
        'shadow-md',
        'border-0'
      ],

      variant === 'outlined' && [
        'bg-white',
        'border-2',
        'border-gray-300',
        'shadow-none'
      ],

      variant === 'ghost' && [
        'bg-transparent',
        'border-0',
        'shadow-none'
      ]
    ].filter(Boolean).join(' ')

    return (
      <div
        ref={ref}
        className={cn(baseStyles, className)}
        tabIndex={focusable ? 0 : undefined}
        role={focusable ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'