/**
 * Megawe UI Component Library
 *
 * Performance-optimized component library for job aggregator
 * - Atomic design system
 * - Core Web Vitals optimized
 * - Built-in accessibility
 * - Minimal bundle size
 */

// Atomic components - Foundation
export { Button, type ButtonProps } from './atomic/Button'
export { Card, type CardProps } from './atomic/Card'
export { Badge, type BadgeProps } from './atomic/Badge'
export { Skeleton, type SkeletonProps } from './atomic/Skeleton'

// Composed components - Built from atomic
export { JobCard, type JobCardProps } from './composed/JobCard'
export { JobCardSkeleton, type JobCardSkeletonProps } from './composed/JobCardSkeleton'

// Re-export utilities
export { cn } from '../../lib/utils/cn'