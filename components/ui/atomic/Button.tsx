import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Atomic Button Component
 *
 * Performance-optimized button with minimal footprint
 * - Zero runtime CSS generation
 * - CSS variables for theming
 * - Accessibility built-in
 * - Loading states support
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseStyles = [
      // Base button styles
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'font-medium',
      'rounded-lg',
      'transition-all',
      'duration-150',
      'ease-in-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50',

      // Size variants
      size === 'sm' && ['px-3', 'py-1.5', 'text-sm', 'h-8'],
      size === 'md' && ['px-4', 'py-2', 'text-sm', 'h-10'],
      size === 'lg' && ['px-6', 'py-3', 'text-base', 'h-12'],

      // Width
      fullWidth && 'w-full',

      // Variant styles
      variant === 'primary' && [
        'bg-blue-600',
        'text-white',
        'hover:bg-blue-700',
        'active:bg-blue-800',
        'focus:ring-blue-500'
      ],

      variant === 'secondary' && [
        'bg-gray-100',
        'text-gray-900',
        'hover:bg-gray-200',
        'active:bg-gray-300',
        'focus:ring-gray-500'
      ],

      variant === 'outline' && [
        'border',
        'border-gray-300',
        'bg-transparent',
        'text-gray-700',
        'hover:bg-gray-50',
        'active:bg-gray-100',
        'focus:ring-gray-500'
      ],

      variant === 'ghost' && [
        'bg-transparent',
        'text-gray-700',
        'hover:bg-gray-100',
        'active:bg-gray-200',
        'focus:ring-gray-500'
      ]
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        className={cn(baseStyles, className)}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={loading ? 'loading-description' : undefined}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <span className="truncate">{children}</span>

        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}

        {loading && (
          <span className="sr-only" id="loading-description">
            Loading, please wait
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'