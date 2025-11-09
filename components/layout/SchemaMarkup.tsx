'use client'

import { useEffect } from 'react'

/**
 * SchemaMarkup Component
 *
 * This component generates and injects JSON-LD structured data
 * for SEO purposes, including JobPosting, Organization, and BreadcrumbList schemas.
 */

interface SchemaMarkupProps {
  schemaData?: Record<string, any>[]
}

export function SchemaMarkup({ schemaData }: SchemaMarkupProps) {
  useEffect(() => {
    // Generate default schemas for the homepage
    const defaultSchemas = [
      // Organization schema
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Megawe',
        url: 'https://megawe-nextjs.workers.dev',
        logo: 'https://megawe-nextjs.workers.dev/images/logo.png',
        description: 'Indonesian Job Vacancy Aggregator - Temukan lowongan kerja terbaru dari seluruh Indonesia',
        sameAs: [
          'https://github.com/mxwllalpha',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Indonesian', 'English'],
        },
      },
      // WebSite schema
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Megawe',
        url: 'https://megawe-nextjs.workers.dev',
        description: 'Indonesian Job Vacancy Aggregator',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://megawe-nextjs.workers.dev/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ]

    // Combine default schemas with any custom schema data
    const allSchemas = [...defaultSchemas, ...(schemaData || [])]

    // Remove existing script tags
    const existingScripts = document.querySelectorAll('script[data-type="structured-data"]')
    existingScripts.forEach(script => script.remove())

    // Add new structured data scripts
    allSchemas.forEach(schema => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-type', 'structured-data')
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })

    // Cleanup on unmount
    return () => {
      const scripts = document.querySelectorAll('script[data-type="structured-data"]')
      scripts.forEach(script => script.remove())
    }
  }, [schemaData])

  return null // This component doesn't render anything
}

/**
 * Helper function to create JobPosting schema
 */
export function createJobPostingSchema(job: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Megawe Job ID',
      value: job.id,
    },
    datePosted: job.postedAt,
    validThrough: job.expiresAt || job.postedAt,
    employmentType: job.employmentType.replace('-', '-').toUpperCase(),
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location.name,
        addressCountry: job.location.country,
      },
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      logo: job.company.logo,
      website: job.company.website,
      sameAs: job.company.linkedin ? [job.company.linkedin] : undefined,
    },
    jobBenefits: job.benefits,
    qualifications: job.requirements,
    responsibilities: job.responsibilities,
    skills: job.skills,
    workHours: 'Full-time',
    industry: job.company.industry,
    experienceRequirements: job.experienceLevel.replace('-', ' '),
    salaryCurrency: job.salary?.currency,
    salary: job.salary?.isVisible ? {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: job.salary.period,
      },
    } : undefined,
    applicantLocationRequirements: job.isRemote ? {
      '@type': 'Country',
      name: 'Indonesia',
    } : undefined,
    jobLocationType: job.isRemote ? 'TELECOMMUTE' : undefined,
  }
}

/**
 * Helper function to create BreadcrumbList schema
 */
export function createBreadcrumbListSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  }
}

/**
 * Helper function to create SearchResultsPage schema
 */
export function createSearchResultsPageSchema(query: string, resultCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search Results for "${query}" - Megawe`,
    description: `Found ${resultCount} job vacancies matching "${query}"`,
    url: `https://megawe-nextjs.workers.dev/search?q=${encodeURIComponent(query)}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: resultCount,
      itemListElement: Array.from({ length: Math.min(resultCount, 10) }, (_, index) => ({
        '@type': 'ListItem',
        position: index + 1,
      })),
    },
  }
}

/**
 * Helper function to create Corporation schema for company pages
 */
export function createCorporationSchema(company: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    name: company.name,
    alternateName: company.slug,
    url: `https://megawe-nextjs.workers.dev/companies/${company.slug}`,
    logo: company.logo,
    description: company.description,
    foundingDate: company.foundedYear ? `${company.foundedYear}-01-01` : undefined,
    numberOfEmployees: company.companySize,
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.location.name,
      addressCountry: company.location.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'careers',
      email: company.email,
      availableLanguage: ['Indonesian', 'English'],
    },
    sameAs: [
      company.website,
      company.linkedin,
      company.twitter,
      company.instagram,
      company.facebook,
    ].filter(Boolean),
    knowsAbout: company.industry,
    slogan: company.description?.split('.')[0],
  }
}