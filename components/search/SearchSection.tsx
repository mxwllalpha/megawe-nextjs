'use client'

import { motion } from 'framer-motion'
import { Filter, Building, MapPin, Clock, DollarSign } from 'lucide-react'

/**
 * SearchSection Component
 *
 * Advanced search section with filters for job search functionality.
 */

export function SearchSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Advanced Job Search
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use our advanced filters to find the perfect job that matches your skills and preferences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Job Type Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Building className="w-4 h-4" />
                  Job Type
                </div>
                <select className="input w-full">
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <select className="input w-full">
                  <option value="">All Locations</option>
                  <option value="jakarta">Jakarta</option>
                  <option value="surabaya">Surabaya</option>
                  <option value="bandung">Bandung</option>
                  <option value="medan">Medan</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4" />
                  Experience
                </div>
                <select className="input w-full">
                  <option value="">All Levels</option>
                  <option value="entry-level">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid-level">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="w-4 h-4" />
                  Salary Range
                </div>
                <select className="input w-full">
                  <option value="">Any Salary</option>
                  <option value="0-5">0 - 5 Million</option>
                  <option value="5-10">5 - 10 Million</option>
                  <option value="10-20">10 - 20 Million</option>
                  <option value="20+">20+ Million</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Popular filters:</span>
                {['Work from Home', 'Startup', 'Fintech', 'Tech', 'Marketing'].map((filter) => (
                  <button
                    key={filter}
                    className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}