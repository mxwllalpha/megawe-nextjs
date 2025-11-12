import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function for merging Tailwind CSS classes
 *
 * Combines clsx for conditional class handling with tailwind-merge
 * to prevent class conflicts and ensure optimal CSS output.
 *
 * @param inputs - Class names to merge
 * @returns Merged class string
 *
 * @example
 * cn('px-4 py-2', 'bg-blue-500', isActive && 'text-white')
 * // Returns: 'px-4 py-2 bg-blue-500 text-white'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}