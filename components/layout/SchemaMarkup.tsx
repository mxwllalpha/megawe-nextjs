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
 * Uses API-provided JSON-LD schema when available, falls back to generated schema
 */
export function createJobPostingSchema(job: any) {
  // If the API provides a pre-generated JSON-LD schema, use it
  if (job.jsonldSchema && typeof job.jsonldSchema === 'object') {
    return {
      ...job.jsonldSchema,
      // Ensure required fields are present
      '@context': job.jsonldSchema['@context'] || 'https://schema.org',
      '@type': job.jsonldSchema['@type'] || 'JobPosting',
    }
  }

  // Fallback to generated schema using enhanced job data
  const address: any = {
    '@type': 'PostalAddress',
    addressCountry: 'ID',
  }

  // Add location hierarchy if available
  if (job.locationHierarchy) {
    address.addressLocality = job.locationHierarchy.kabupaten
    address.addressRegion = job.locationHierarchy.provinsi
    address.postalCode = job.locationHierarchy.kodepos
    address.streetAddress = `${job.locationHierarchy.kecamatan}, ${job.locationHierarchy.desa}`
  } else if (job.location) {
    address.addressLocality = job.location
  }

  // Add postal code if available separately
  if (job.postalCode && !address.postalCode) {
    address.postalCode = job.postalCode
  }

  const hiringOrganization: any = {
    '@type': 'Organization',
    name: job.company || job.companyData?.name || 'Company',
  }

  // Add company details if available
  if (job.companyData) {
    if (job.companyData.logo) hiringOrganization.logo = job.companyData.logo
    if (job.companyData.website) hiringOrganization.website = job.companyData.website
    if (job.companyData.description) hiringOrganization.description = job.companyData.description
    if (job.companyData.industry) hiringOrganization.industry = job.companyData.industry
    if (job.companyData.email) {
      hiringOrganization.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'careers',
        email: job.companyData.email,
      }
    }
  }

  const schema: any = {
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
    validThrough: job.applicationDeadline || job.expiresAt || job.postedAt,
    employmentType: mapEmploymentTypeToSchema(job.employmentType),
    jobLocation: {
      '@type': 'Place',
      address,
    },
    hiringOrganization,
    applicantLocationRequirements: job.isRemote ? {
      '@type': 'Country',
      name: 'Indonesia',
    } : undefined,
    jobLocationType: job.isRemote ? 'TELECOMMUTE' : undefined,
  }

  // Add enhanced fields if available
  if (job.skills && job.skills.length > 0) {
    schema.skills = job.skills
  }

  if (job.requirements && job.requirements.length > 0) {
    schema.qualifications = job.requirements.join(', ')
  }

  if (job.responsibilities && job.responsibilities.length > 0) {
    schema.responsibilities = job.responsibilities
  }

  if (job.benefits && job.benefits.length > 0) {
    schema.jobBenefits = job.benefits
  }

  if (job.experienceLevel) {
    schema.experienceRequirements = mapExperienceLevelToSchema(job.experienceLevel)
  }

  // Add salary information if visible
  if (job.salary && job.salary.showSalary && (job.salary.min || job.salary.max)) {
    schema.salaryCurrency = job.salary.currency || 'IDR'
    schema.salary = {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency || 'IDR',
      value: {
        '@type': 'QuantitativeValue',
        ...(job.salary.min && { minValue: job.salary.min }),
        ...(job.salary.max && { maxValue: job.salary.max }),
        unitText: mapSalaryPeriodToSchema(job.salary.period),
      },
    }
  }

  // Add quota information if available
  if (job.quota && job.availableQuota) {
    schema.totalJobOpenings = job.availableQuota
  }

  // Add application information
  if (job.applicationUrl) {
    schema.applicationContact = {
      '@type': 'ContactPoint',
      contactType: 'careers',
      url: job.applicationUrl,
    }
  }

  return schema
}

/**
 * Helper function to map employment type to Schema.org format
 */
function mapEmploymentTypeToSchema(type: string): string {
  const typeMap: Record<string, string> = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    'contract': 'CONTRACTOR',
    'temporary': 'TEMPORARY',
    'internship': 'INTERN',
    'freelance': 'CONTRACTOR',
    'volunteer': 'VOLUNTEER',
  }
  return typeMap[type?.toLowerCase()] || 'FULL_TIME'
}

/**
 * Helper function to map experience level to human-readable format
 */
function mapExperienceLevelToSchema(level: string): string {
  const levelMap: Record<string, string> = {
    'entry-level': 'Entry level',
    'junior': 'Junior (0-2 years)',
    'mid-level': 'Mid-level (3-5 years)',
    'senior': 'Senior (6-8 years)',
    'lead': 'Lead (8-10 years)',
    'manager': 'Manager (10+ years)',
    'director': 'Director level',
    'executive': 'Executive level',
  }
  return levelMap[level?.toLowerCase()] || 'Entry level'
}

/**
 * Helper function to map salary period to Schema.org format
 */
function mapSalaryPeriodToSchema(period: string): string {
  const periodMap: Record<string, string> = {
    'hour': 'HOUR',
    'day': 'DAY',
    'week': 'WEEK',
    'month': 'MONTH',
    'year': 'YEAR',
  }
  return periodMap[period?.toLowerCase()] || 'MONTH'
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