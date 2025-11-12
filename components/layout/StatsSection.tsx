'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/atomic/Card'

/**
 * Stats Section Component - Karirhub Inspired
 *
 * Display key platform statistics with animated counters
 * Performance optimized with minimal DOM operations
 */

interface Stat {
  id: string
  value: string
  label: string
  description: string
  icon: string
  color: string
}

const stats: Stat[] = [
  {
    id: 'jobs',
    value: '50,000+',
    label: 'Lowongan Aktif',
    description: 'Dari ribuan perusahaan terpercaya',
    icon: '💼',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    id: 'companies',
    value: '10,000+',
    label: 'Perusahaan',
    description: 'Dari berbagai industri di Indonesia',
    icon: '🏢',
    color: 'text-green-600 bg-green-50'
  },
  {
    id: 'candidates',
    value: '500,000+',
    label: 'Pencari Kerja',
    description: 'Profesional yang telah bergabung',
    icon: '👥',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    id: 'placements',
    value: '25,000+',
    label: 'Penempatan Sukses',
    description: 'Kandidat yang mendapat pekerjaan',
    icon: '🎯',
    color: 'text-orange-600 bg-orange-50'
  }
]

export function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Platform Karir Terpercaya di Indonesia
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Bergabunglah dengan ribuan profesional yang telah menemukan karir impian mereka melalui Megawe
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6
              }}
            >
              <Card className="text-center p-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto rounded-2xl ${stat.color} flex items-center justify-center text-3xl mb-4`}>
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>100% Gratis untuk Pencari Kerja</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Perusahaan Terverifikasi</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Pembaruan Harian</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}