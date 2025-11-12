/**
 * Shared Types for Megawe Pages Functions
 *
 * Type definitions used across all Pages Functions for consistency
 */

export interface Env {
  // Database bindings (same as megawe-worker)
  MEGAWE_DB: D1Database
  MEGAWE_CACHE: KVNamespace

  // Optional additional bindings
  API_TOKEN?: string
}

// Cloudflare D1 and KV types (simplified for Pages Functions)
export interface D1Database {
  prepare(query: string): D1PreparedStatement
}

export interface D1PreparedStatement {
  bind(...params: any[]): D1PreparedStatement
  first(): Promise<any | null>
  all(): Promise<{ results: any[] }>
  run(): Promise<any>
}

export interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

export interface Job {
  id: string
  title: string
  slug?: string
  description: string
  requirements?: string[]
  responsibilities?: string[]
  benefits?: string[]
  skills?: string[]
  tags?: string[]

  // Company information
  company: string
  companyData?: {
    id: string
    name: string
    slug?: string
    description?: string
    logo?: string
    website?: string
    industry?: string
    email?: string
    phone?: string
    address?: string
  }

  // Location information
  location: string
  locationHierarchy?: {
    provinsi: string
    kabupaten: string
    kecamatan: string
    desa: string
    kodepos: string
  }
  postalCode?: string
  latitude?: number | null
  longitude?: number | null
  isRemote?: boolean
  isHybrid?: boolean

  // Job details
  employmentType?: string
  experienceLevel?: string
  salary?: {
    min?: number
    max?: number
    currency?: string
    period?: string
    showSalary?: boolean
  }
  type?: string
  category?: string
  department?: string

  // Quota information
  quota?: number
  availableQuota?: number
  usageQuota?: number

  // Enhanced metadata
  employerId?: string
  source?: string
  sourceUrl?: string
  applicationUrl?: string
  applicationDeadline?: string
  expiresAt?: string
  isActive?: boolean

  // SEO and structured data
  metaTitle?: string
  metaDescription?: string
  seo?: {
    title?: string
    description?: string
    slug?: string
    keywords?: string[]
  }
  jsonldSchema?: any

  // Timestamps
  postedAt?: string
  updatedAt?: string
  createdAt?: string

  // Statistics
  viewCount?: number
  applicationCount?: number
}

export interface JobStats {
  totalJobs: number
  totalCompanies: number
  totalCategories: number
  totalLocations: number
  jobsByCategory: any[]
  jobsByType: any[]
  jobsByLocation: any[]
  salaryRanges: any[]
  recentActivity: {
    jobsAddedToday: number
    jobsAddedThisWeek: number
    jobsAddedThisMonth: number
    lastSyncTime: string
  }
  // Legacy compatibility
  newJobsToday?: number
  newJobsThisWeek?: number
  activeLocations?: number
  featuredJobs?: number
  remoteJobs?: number
  popularLocations?: any[]
  popularCompanies?: any[]
  popularIndustries?: any[]
}

export interface Company {
  id: string
  name: string
  slug?: string
  description?: string
  logo?: string
  website?: string
  industry?: string
  companySize?: string
  foundedYear?: number
  email?: string
  phone?: string
  address?: string
  location?: {
    id: string
    name: string
    slug?: string
    coordinates?: {
      lat: number
      lng: number
    }
    country: string
    countryCode: string
  }
  benefits?: string[]
  culture?: string
  values?: string[]
  metaTitle?: string
  metaDescription?: string
  activeJobsCount?: number
  totalJobsCount?: number
  verified?: boolean
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  meta?: {
    timestamp: string
    requestId: string
    version: string
    processingTime: number
  }
}

export interface SearchFilters {
  query?: string
  location?: string
  companyId?: string
  employmentType?: string[]
  category?: string
  experienceLevel?: string
  salaryMin?: number
  salaryMax?: number
  remote?: boolean
  page?: number
  limit?: number
  sortBy?: 'relevance' | 'postedAt' | 'salary' | 'company'
  sortOrder?: 'asc' | 'desc'
}

// Database schema types (matches megawe-worker)
export interface DatabaseJob {
  id: string
  title: string
  slug?: string
  description: string
  requirements?: string
  responsibilities?: string
  benefits?: string
  skills?: string
  tags?: string

  // Company information
  company: string
  employer_id?: string

  // Location information
  location: string
  postal_code?: string
  latitude?: number
  longitude?: number
  is_remote?: boolean
  is_hybrid?: boolean
  region_id?: string
  city_id?: string

  // Job details
  employment_type?: string
  experience_level?: string
  salary_min?: number
  salary_max?: number
  salary_currency?: string
  salary_period?: string
  show_salary?: boolean
  type?: string
  category?: string
  department?: string
  job_type_id?: string
  job_function_id?: string
  min_education_id?: string

  // Quota information
  quota?: number
  usage_quota?: number
  available_quota?: number

  // Candidate requirements
  gender?: string
  physical_condition?: string
  marital_status?: string
  min_year_experience?: number
  min_age?: number
  max_age?: number

  // Metadata
  confidential?: boolean
  platform_type?: string
  platform_id?: string
  platform_link?: string
  application_url?: string
  application_deadline?: string
  expires_at?: string
  is_active?: boolean

  // SEO and structured data
  meta_title?: string
  meta_description?: string
  seo_title?: string
  seo_description?: string
  seo_slug?: string
  seo_keywords?: string
  jsonld_schema?: string

  // Timestamps
  posted_at?: string
  updated_at?: string
  created_at?: string
  created_at_unix?: number
  updated_at_unix?: number

  // Statistics
  view_count?: number
  application_count?: number
}