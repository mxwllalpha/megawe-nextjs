'use client'

import { useEffect } from 'react'

/**
 * Analytics Component
 *
 * This component handles analytics and tracking integration
 * for the Megawe job aggregator application.
 */

interface AnalyticsProps {
  googleAnalyticsId?: string
  cloudflareAnalytics?: boolean
}

export function Analytics({ googleAnalyticsId, cloudflareAnalytics = true }: AnalyticsProps) {
  useEffect(() => {
    // Google Analytics 4
    if (googleAnalyticsId) {
      // Initialize GA4
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsId}', {
          page_title: document.title,
          page_location: window.location.href,
          custom_map: {
            'custom_parameter_1': 'job_category',
            'custom_parameter_2': 'location_filter',
            'custom_parameter_3': 'company_filter',
          }
        });
      `
      document.head.appendChild(script2)

      // Cleanup GA4 scripts on unmount
      return () => {
        const scripts = document.querySelectorAll(`script[src*="googletagmanager.com"]`)
        scripts.forEach(script => script.remove())
      }
    }

    return undefined
  }, [googleAnalyticsId])

  useEffect(() => {
    // Cloudflare Analytics
    if (cloudflareAnalytics) {
      // Cloudflare Analytics is automatically collected
      // when deployed on Cloudflare Workers/Pages
      console.log('Cloudflare Analytics enabled')
    }

    // Custom job search analytics
    const trackJobSearch = (searchData: any) => {
      if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'job_search', {
          search_term: searchData.query,
          location_filter: searchData.location,
          job_type: searchData.employmentType,
          experience_level: searchData.experienceLevel,
        })
      }
    }

    const trackJobView = (jobData: any) => {
      if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'job_view', {
          job_id: jobData.id,
          job_title: jobData.title,
          company_name: jobData.company.name,
          location: jobData.location.name,
          employment_type: jobData.employmentType,
        })
      }
    }

    const trackJobApplication = (jobData: any) => {
      if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'job_application', {
          job_id: jobData.id,
          job_title: jobData.title,
          company_name: jobData.company.name,
          location: jobData.location.name,
          employment_type: jobData.employmentType,
        })
      }
    }

    // Expose tracking functions to global scope
    ;(window as any).trackJobSearch = trackJobSearch
    ;(window as any).trackJobView = trackJobView
    ;(window as any).trackJobApplication = trackJobApplication

    // Track page view
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [googleAnalyticsId, cloudflareAnalytics])

  return null // This component doesn't render anything
}

/**
 * Hook for tracking custom events
 */
export function useAnalytics() {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', eventName, parameters)
    }
  }

  const trackJobSearch = (searchData: {
    query?: string
    location?: string
    employmentType?: string
    experienceLevel?: string
  }) => {
    trackEvent('job_search', {
      search_term: searchData.query,
      location_filter: searchData.location,
      job_type: searchData.employmentType,
      experience_level: searchData.experienceLevel,
    })
  }

  const trackJobView = (jobData: {
    id: string
    title: string
    company: { name: string }
    location: { name: string }
    employmentType: string
  }) => {
    trackEvent('job_view', {
      job_id: jobData.id,
      job_title: jobData.title,
      company_name: jobData.company.name,
      location: jobData.location.name,
      employment_type: jobData.employmentType,
    })
  }

  const trackJobApplication = (jobData: {
    id: string
    title: string
    company: { name: string }
    location: { name: string }
    employmentType: string
  }) => {
    trackEvent('job_application', {
      job_id: jobData.id,
      job_title: jobData.title,
      company_name: jobData.company.name,
      location: jobData.location.name,
      employment_type: jobData.employmentType,
    })
  }

  const trackCompanyView = (companyData: {
    id: string
    name: string
    industry?: string
    location: { name: string }
  }) => {
    trackEvent('company_view', {
      company_id: companyData.id,
      company_name: companyData.name,
      industry: companyData.industry,
      location: companyData.location.name,
    })
  }

  const trackFilterUsage = (filterType: string, filterValue: string) => {
    trackEvent('filter_usage', {
      filter_type: filterType,
      filter_value: filterValue,
    })
  }

  const trackJobApply = (jobData: {
    jobId: string
    title: string
    company: string
    applicationType: 'quick_apply' | 'full_apply'
  }) => {
    trackEvent('job_apply', {
      job_id: jobData.jobId,
      job_title: jobData.title,
      company_name: jobData.company,
      application_type: jobData.applicationType,
    })
  }

  const trackSearchSuggestionClick = (suggestion: string, originalQuery: string) => {
    trackEvent('search_suggestion_click', {
      suggestion,
      original_query: originalQuery,
    })
  }

  return {
    trackEvent,
    trackJobSearch,
    trackJobView,
    trackJobApply,
    trackJobApplication,
    trackCompanyView,
    trackFilterUsage,
    trackSearchSuggestionClick,
  }
}