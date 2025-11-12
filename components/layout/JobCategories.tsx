'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/atomic/Card'
import { cn } from '@/lib/utils/cn'

/**
 * Job Categories Component - Karirhub Inspired
 *
 * Interactive job categories with hover effects and counts
 * Performance optimized with minimal animations
 */

interface Category {
  id: string
  name: string
  icon: string
  count: number
  color: string
}

const mockCategories: Category[] = [
  {
    id: 'technology',
    name: 'Teknologi',
    icon: '💻',
    count: 1250,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'finance',
    name: 'Keuangan',
    icon: '💰',
    count: 890,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'healthcare',
    name: 'Kesehatan',
    icon: '🏥',
    count: 650,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'education',
    name: 'Pendidikan',
    icon: '📚',
    count: 720,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📱',
    count: 480,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: '⚙️',
    count: 920,
    color: 'from-gray-600 to-gray-700'
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: '🤝',
    count: 1100,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'hr',
    name: 'SDM',
    icon: '👥',
    count: 340,
    color: 'from-indigo-500 to-indigo-600'
  }
]

export function JobCategories() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const handleCategoryClick = (categoryId: string) => {
    console.log('Category clicked:', categoryId)
    // TODO: Navigate to category page or apply filter
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Jelajahi Kategori Pekerjaan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan pekerjaan impian Anda berdasarkan kategori yang sesuai dengan keahlian dan minat Anda.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
            >
              <Card
                variant="default"
                hover
                className={cn(
                  'p-6 cursor-pointer transition-all duration-200',
                  'border-2 hover:border-blue-300',
                  hoveredCategory === category.id && 'border-blue-400 shadow-lg'
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="text-center space-y-3">
                  {/* Icon */}
                  <div className={cn(
                    'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl',
                    'bg-gradient-to-br shadow-md',
                    category.color,
                    hoveredCategory === category.id && 'scale-110 shadow-lg'
                  )}>
                    {category.icon}
                  </div>

                  {/* Category Name */}
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {category.name}
                  </h3>

                  {/* Job Count */}
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                    <span className="font-medium">{category.count.toLocaleString()}</span>
                    <span>lowongan</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200">
            Lihat Semua Kategori
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}