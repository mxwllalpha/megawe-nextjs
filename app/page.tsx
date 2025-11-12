import { Metadata } from 'next'
import { HeroSection } from '@/components/layout/HeroSection'
import { SearchSection } from '@/components/search/SearchSection'
import { CallToAction } from '@/components/layout/CallToAction'
import { HomepageData } from '@/components/data/HomepageData'
import { StatsSection } from '@/components/layout/StatsSection'
import { JobCategories } from '@/components/layout/JobCategories'

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Statistics Section */}
      <StatsSection />

      {/* Job Categories */}
      <JobCategories />

      {/* Dynamic Data Sections */}
      <HomepageData />

      {/* Search Section */}
      <SearchSection />

      {/* Call to Action */}
      <CallToAction />
    </main>
  )
}