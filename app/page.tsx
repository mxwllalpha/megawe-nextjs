import { Metadata } from 'next'
import { HeroSection } from '@/components/layout/HeroSection'
import { SearchSection } from '@/components/search/SearchSection'
import { CallToAction } from '@/components/layout/CallToAction'
import { HomepageData } from '@/components/data/HomepageData'

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
    <main className="min-h-screen">
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Search Section */}
      <SearchSection />

      {/* Dynamic Data Sections */}
      <HomepageData />

      {/* Call to Action */}
      <CallToAction />
    </main>
  )
}