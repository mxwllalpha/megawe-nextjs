'use client'

import { motion } from 'framer-motion'
import { Briefcase, Users, MapPin, TrendingUp, Building, Eye } from 'lucide-react'

/**
 * StatsSection Component
 *
 * Displays platform statistics and key metrics.
 */

interface JobStats {
  totalJobs: number
  totalCompanies: number
  newJobsToday: number
  activeLocations: number
}

interface StatsSectionProps {
  stats: JobStats
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statsData = [
    {
      icon: Briefcase,
      label: 'Total Jobs',
      value: stats.totalJobs.toLocaleString(),
      change: `+${stats.newJobsToday}`,
      changeType: 'positive' as const,
      description: 'Active job listings',
    },
    {
      icon: Building,
      label: 'Companies',
      value: stats.totalCompanies.toLocaleString(),
      change: '+12',
      changeType: 'positive' as const,
      description: 'Trusted employers',
    },
    {
      icon: MapPin,
      label: 'Locations',
      value: stats.activeLocations.toLocaleString(),
      change: '+3',
      changeType: 'positive' as const,
      description: 'Cities covered',
    },
    {
      icon: Users,
      label: 'Monthly Users',
      value: '50K+',
      change: '+15%',
      changeType: 'positive' as const,
      description: 'Active job seekers',
    },
  ]

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Indonesian Talent
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs through Megawe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {stat.value}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {stat.label}
                  </span>
                  {stat.change && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stat.changeType === 'positive'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-100"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">4.8/5</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">24h</div>
              <div className="text-sm text-gray-600">Avg. Response Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">85%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">Free</div>
              <div className="text-sm text-gray-600">For Job Seekers</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}