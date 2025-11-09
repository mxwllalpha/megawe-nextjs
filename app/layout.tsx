import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SchemaMarkup } from '@/components/layout/SchemaMarkup'
import { Analytics } from '@/components/layout/Analytics'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://megawe-nextjs.workers.dev'),
  title: {
    default: 'Megawe - Lowongan Kerja Indonesia Terbaru',
    template: '%s | Megawe'
  },
  description: 'Temukan lowongan kerja terbaru dari seluruh Indonesia. Megawe mengumpulkan ribuan lowongan dari berbagai perusahaan dan penyedia kerja terpercaya.',
  keywords: [
    'lowongan kerja',
    'loker indonesia',
    'karir indonesia',
    'job vacancy',
    'pekerjaan',
    'employment',
    'career opportunities',
    'lowongan kerja terbaru',
    'informasi lowongan kerja',
  ],
  authors: [{ name: 'Maxwell Alpha', url: 'https://github.com/mxwllalpha' }],
  creator: 'Maxwell Alpha',
  publisher: 'Megawe',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: 'en_US',
    url: '/',
    title: 'Megawe - Lowongan Kerja Indonesia Terbaru',
    description: 'Temukan lowongan kerja terbaru dari seluruh Indonesia. Megawe mengumpulkan ribuan lowongan dari berbagai perusahaan.',
    siteName: 'Megawe',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Megawe - Lowongan Kerja Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Megawe - Lowongan Kerja Indonesia Terbaru',
    description: 'Temukan lowongan kerja terbaru dari seluruh Indonesia',
    images: ['/images/og-image.jpg'],
    creator: '@mxwllalpha',
  },
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/id',
      'en-US': '/en',
    },
  },
  other: {
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
    'apple-mobile-web-app-title': 'Megawe',
    'application-name': 'Megawe',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div id="root">
          {children}
        </div>
        <SchemaMarkup />
        <Analytics />
      </body>
    </html>
  )
}