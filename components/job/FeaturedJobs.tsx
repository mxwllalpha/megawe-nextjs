'use client'

import { motion } from 'framer-motion'
import { Briefcase, MapPin, Building, Clock, ArrowRight, Heart } from 'lucide-react'
import { useAnalytics } from '@/components/layout/Analytics'

/**
 * FeaturedJobs Component
 *
 * Displays featured job listings on the homepage.
 */

interface Job {
  id: string
  title: string
  company: {
    name: string
    logo?: string
    location: string
  }
  location: string
  employmentType: string
  postedAt: string
  isRemote: boolean
  description: string
}

interface FeaturedJobsProps {
  jobs: any[] // Use any for now to avoid type conflicts
}

export function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  const { trackJobView } = useAnalytics()

  const handleJobClick = (job: any) => {
    trackJobView({
      id: job.id,
      title: job.title,
      company: { name: job.company.name },
      location: { name: job.location },
      employmentType: job.employmentType,
    })
  }

  const handleSaveJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation()
    // TODO: Implement save job functionality
    console.log('Save job:', jobId)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Opportunities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked job opportunities from top companies across Indonesia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 6).map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="job-card cursor-pointer"
              onClick={() => handleJobClick(job)}
            >
              <div className="card-header">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {job.company.logo ? (
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Building className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="job-title line-clamp-1">{job.title}</h3>
                      <p className="text-sm font-medium text-gray-700">{job.company.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleSaveJob(e, job.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="card-content">
                <div className="job-meta mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{job.location}</span>
                    {job.isRemote && (
                      <span className="job-badge">Remote</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm capitalize">{job.employmentType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatPostedDate(job.postedAt)}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {job.description}
                </p>

                <button className="w-full btn btn-outline flex items-center justify-center gap-2">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {jobs.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="/jobs"
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              View All Jobs
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function formatPostedDate(postedAt: string): string {
  const date = new Date(postedAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}