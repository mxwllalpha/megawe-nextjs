'use client'

import { motion } from 'framer-motion'
import { JobCard, JobCardSkeleton } from '@/components/ui'
import { Button } from '@/components/ui/atomic/Button'
import { useAnalytics } from '@/components/layout/Analytics'
import { useState, useMemo } from 'react'
import type { Job } from '@/lib/types'

/**
 * FeaturedJobs Component - Performance Optimized
 *
 * Displays featured job listings with:
 * - Minimal CLS with skeleton loading
 * - Optimized animations
 * - Smart job matching
 * - Quick apply functionality
 */

interface FeaturedJobsProps {
  jobs: Job[]
  loading?: boolean
  maxJobs?: number
}

export function FeaturedJobs({
  jobs,
  loading = false,
  maxJobs = 6
}: FeaturedJobsProps) {
  const { trackJobView, trackJobApply } = useAnalytics()
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  // Memoized job list for performance
  const displayJobs = useMemo(() => {
    return jobs.slice(0, maxJobs)
  }, [jobs, maxJobs])

  const handleJobClick = (job: Job) => {
    trackJobView({
      id: job.id,
      title: job.title,
      company: { name: job.company },
      location: { name: job.location },
      employmentType: job.employmentType,
    })

    // Navigate to job detail (implement routing)
    console.log('Navigate to job:', job.id)
  }

  const handleSaveJob = (jobId: string, saved: boolean) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (saved) {
        newSet.add(jobId)
      } else {
        newSet.delete(jobId)
      }
      return newSet
    })

    console.log('Job saved status:', jobId, saved)
  }

  const handleQuickApply = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId)
    if (job) {
      trackJobApply({
        jobId: job.id,
        title: job.title,
        company: job.company,
        applicationType: 'quick_apply'
      })

      console.log('Quick apply:', job.id)
      // TODO: Open quick apply modal
    }
  }

  // Staggered animation for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: maxJobs }, (_, index) => (
              <JobCardSkeleton key={index} variant="featured" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Empty state
  if (!jobs.length) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No featured jobs available
            </h2>
            <p className="text-gray-600 mb-8">
              Check back soon for new opportunities from top companies.
            </p>
            <Button variant="outline">
              Browse All Jobs
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Opportunities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked job opportunities from top companies across Indonesia.
          </p>
        </motion.div>

        {/* Job Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayJobs.map((job, index) => (
            <motion.div
              key={job.id}
              variants={cardVariants}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 }
              }}
            >
              <JobCard
                job={job}
                variant="featured"
                onJobClick={handleJobClick}
                onSaveJob={handleSaveJob}
                onQuickApply={handleQuickApply}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {jobs.length > maxJobs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="inline-flex items-center gap-2"
            >
              View All Jobs ({jobs.length - maxJobs} more)
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}