'use client'

import { useState } from 'react'
import { Search, Briefcase, MapPin, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * HeroSection Component
 *
 * Main hero section for the Megawe job aggregator homepage
 * with search functionality and key statistics.
 */

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        ...(searchLocation && { location: searchLocation }),
      })
      window.location.href = `/search?${params.toString()}`
    }
  }

  const handleQuickSearch = (type: string, value: string) => {
    const params = new URLSearchParams({
      q: value,
      type,
    })
    window.location.href = `/search?${params.toString()}`
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-400/10 rounded-full blur-xl animate-pulse delay-500" />

      <div className="container-custom relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6">
              Temukan Pekerjaan
              <br />
              <span className="text-blue-100">Impian Anda di Indonesia</span>
            </h1>

            <p className="text-xl lg:text-2xl text-blue-100 mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
              Jelajahi ribuan lowongan kerja dari perusahaan terpercaya.
              Dari startup hingga multinational, semua ada di Megawe.
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-2 lg:p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Job Title Input */}
                <div className="flex-1 relative">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>

                {/* Location Input */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="search-input w-full lg:w-64"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-8 w-full lg:w-auto flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search Jobs
                </button>
              </div>
            </form>

            {/* Quick Search Categories */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-gray-500">Popular searches:</span>
              {[
                { label: 'Software Engineer', value: 'Software Engineer' },
                { label: 'Remote', value: 'Remote', type: 'remote' },
                { label: 'Jakarta', value: 'Jakarta', type: 'location' },
                { label: 'Marketing', value: 'Marketing' },
                { label: 'Full-time', value: 'Full-time', type: 'type' },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(item.type || 'default', item.value)}
                  className="text-sm px-3 py-1 bg-white/80 hover:bg-white border border-gray-200 rounded-full transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Key Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Briefcase,
                label: 'Active Jobs',
                value: '10,000+',
                description: 'Updated daily',
              },
              {
                icon: Users,
                label: 'Companies',
                value: '500+',
                description: 'Trusted employers',
              },
              {
                icon: MapPin,
                label: 'Locations',
                value: '50+',
                description: 'Across Indonesia',
              },
              {
                icon: TrendingUp,
                label: 'Success Rate',
                value: '85%',
                description: 'Job placements',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 lg:mt-16"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>100% verified jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Free for job seekers</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20 blur-xl" />
    </section>
  )
}