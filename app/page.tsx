import { Metadata } from 'next'
import { HeroSection } from '@/components/layout/HeroSection'
import { FeaturedJobs } from '@/components/job/FeaturedJobs'
import { SearchSection } from '@/components/search/SearchSection'
import { StatsSection } from '@/components/layout/StatsSection'
import { CallToAction } from '@/components/layout/CallToAction'

export const metadata: Metadata = {
  title: 'Lowongan Kerja Indonesia Terbaru | Megawe',
  description: 'Temukan ribuan lowongan kerja terbaru dari seluruh Indonesia. Filter berdasarkan lokasi, jenis pekerjaan, dan perusahaan impian Anda.',
  openGraph: {
    title: 'Lowongan Kerja Indonesia Terbaru | Megawe',
    description: 'Temukan ribuan lowongan kerja terbaru dari seluruh Indonesia',
    url: '/',
  },
}

// ISR configuration for homepage
export const revalidate = 900 // 15 minutes

async function getFeaturedJobs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.megawe.workers.dev'
    const response = await fetch(`${baseUrl}/jobs/featured`, {
      next: { revalidate: 900 },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch featured jobs: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching featured jobs:', error)
    return []
  }
}

async function getJobStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.megawe.workers.dev'
    const response = await fetch(`${baseUrl}/stats`, {
      next: { revalidate: 3600 }, // 1 hour
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch job stats: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching job stats:', error)
    return {
      totalJobs: 0,
      totalCompanies: 0,
      newJobsToday: 0,
      activeLocations: 0,
    }
  }
}

export default async function HomePage() {
  const [featuredJobs, jobStats] = await Promise.all([
    getFeaturedJobs(),
    getJobStats(),
  ])

  return (
    <main className="min-h-screen">
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Search Section */}
      <SearchSection />

      {/* Job Statistics */}
      <StatsSection stats={jobStats} />

      {/* Featured Jobs */}
      <FeaturedJobs jobs={featuredJobs} />

      {/* Call to Action */}
      <CallToAction />
    </main>
  )
}