/**
 * TypeScript type definitions for Megawe Job Aggregator
 *
 * This file contains all the core TypeScript interfaces and types
 * used throughout the application for type safety and consistency.
 */

/**
 * Base interface for all API responses
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationMeta
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Job vacancy data structure
 */
export interface Job {
  id: string
  title: string
  slug: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]

  // Company information
  companyId: string
  company: Company

  // Location information
  location: Location
  isRemote: boolean
  isHybrid: boolean

  // Job details
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  salary?: SalaryInfo
  department?: string

  // Application information
  applicationUrl?: string
  applicationEmail?: string
  applicationDeadline?: string
  isActive: boolean

  // SEO and metadata
  metaTitle?: string
  metaDescription?: string
  keywords: string[]

  // Timestamps
  postedAt: string
  updatedAt: string
  expiresAt?: string

  // Statistics
  viewCount: number
  applicationCount: number
  featured: boolean
  priority: number
}

/**
 * Company information
 */
export interface Company {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  industry?: string
  companySize: CompanySize
  foundedYear?: number

  // Contact information
  email?: string
  phone?: string
  address?: string

  // Social media
  linkedin?: string
  twitter?: string
  instagram?: string
  facebook?: string

  // Location
  location: Location

  // Company details
  benefits: string[]
  culture?: string
  values?: string[]

  // SEO and metadata
  metaTitle?: string
  metaDescription?: string

  // Statistics
  activeJobsCount: number
  totalJobsCount: number
  verified: boolean
  featured: boolean

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * Location information
 */
export interface Location {
  id: string
  name: string
  slug: string
  type: LocationType
  coordinates?: {
    lat: number
    lng: number
  }

  // Hierarchy
  parentId?: string
  parent?: Location
  children?: Location[]

  // Metadata
  description?: string
  timezone?: string
  country: string
  countryCode: string

  // Statistics
  jobsCount: number
  companiesCount: number
  population?: number

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * Salary information
 */
export interface SalaryInfo {
  min?: number
  max?: number
  currency: string
  period: SalaryPeriod
  isNegotiable: boolean
  isVisible: boolean
}

/**
 * Search filters
 */
export interface SearchFilters {
  query?: string
  location?: string
  locationId?: string
  companyId?: string
  industry?: string
  employmentType?: EmploymentType[]
  experienceLevel?: ExperienceLevel[]
  salaryMin?: number
  salaryMax?: number
  isRemote?: boolean
  isFeatured?: boolean
  postedWithin?: PostedWithin
  sortBy?: SortBy
  page?: number
  limit?: number
}

/**
 * Search results
 */
export interface SearchResults {
  jobs: Job[]
  companies: Company[]
  locations: Location[]
  totalCount: number
  facets: SearchFacets
  suggestions: string[]
}

/**
 * Search facets for filtering
 */
export interface SearchFacets {
  locations: Array<{
    location: Location
    count: number
  }>
  companies: Array<{
    company: Company
    count: number
  }>
  industries: Array<{
    industry: string
    count: number
  }>
  employmentTypes: Array<{
    type: EmploymentType
    count: number
  }>
  experienceLevels: Array<{
    level: ExperienceLevel
    count: number
  }>
}

/**
 * Job statistics
 */
export interface JobStats {
  totalJobs: number
  totalCompanies: number
  totalLocations: number
  newJobsToday: number
  newJobsThisWeek: number
  activeLocations: number
  featuredJobs: number
  remoteJobs: number
  popularLocations: Array<{
    location: Location
    count: number
  }>
  popularCompanies: Array<{
    company: Company
    count: number
  }>
  popularIndustries: Array<{
    industry: string
    count: number
  }>
}

/**
 * Application form data
 */
export interface ApplicationData {
  jobId: string
  fullName: string
  email: string
  phone: string
  coverLetter?: string
  resume?: File
  portfolio?: string
  linkedin?: string
  github?: string
  currentSalary?: string
  expectedSalary?: string
  availableDate?: string
  noticePeriod?: string
  additionalInfo?: string
}

/**
 * User profile (if authentication is added later)
 */
export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatar?: string
  phone?: string
  location?: Location
  bio?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  resume?: string
  portfolio?: string
  linkedin?: string
  github?: string
  website?: string

  // Preferences
  jobAlerts: boolean
  emailNotifications: boolean
  savedJobs: string[]
  appliedJobs: string[]

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * Work experience entry
 */
export interface Experience {
  id: string
  company: string
  position: string
  description?: string
  startDate: string
  endDate?: string
  current: boolean
  location?: string
  skills: string[]
}

/**
 * Education entry
 */
export interface Education {
  id: string
  institution: string
  degree: string
  field?: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  description?: string
}

/**
 * Enums and unions
 */

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'temporary'
  | 'internship'
  | 'freelance'
  | 'volunteer'

export type ExperienceLevel =
  | 'entry-level'
  | 'junior'
  | 'mid-level'
  | 'senior'
  | 'lead'
  | 'manager'
  | 'director'
  | 'executive'

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5000+'

export type LocationType =
  | 'country'
  | 'province'
  | 'city'
  | 'district'
  | 'subdistrict'

export type SalaryPeriod =
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'

export type PostedWithin =
  | 'today'
  | 'yesterday'
  | 'last-3-days'
  | 'last-7-days'
  | 'last-14-days'
  | 'last-30-days'

export type SortBy =
  | 'relevance'
  | 'date-desc'
  | 'date-asc'
  | 'title-asc'
  | 'title-desc'
  | 'company-asc'
  | 'company-desc'
  | 'salary-desc'
  | 'salary-asc'

/**
 * API endpoint responses
 */

export interface JobsResponse extends ApiResponse<Job[]> {
  data?: Job[]
  pagination?: PaginationMeta
}

export interface JobResponse extends ApiResponse<Job> {
  data?: Job
}

export interface CompaniesResponse extends ApiResponse<Company[]> {
  data?: Company[]
  pagination?: PaginationMeta
}

export interface CompanyResponse extends ApiResponse<Company> {
  data?: Company
}

export interface LocationsResponse extends ApiResponse<Location[]> {
  data?: Location[]
}

export interface SearchResponse extends ApiResponse<SearchResults> {
  data?: SearchResults
}

export interface StatsResponse extends ApiResponse<JobStats> {
  data?: JobStats
}

/**
 * Component props types
 */

export interface JobCardProps {
  job: Job
  featured?: boolean
  showCompany?: boolean
  showLocation?: boolean
  compact?: boolean
  className?: string
}

export interface JobListProps {
  jobs: Job[]
  loading?: boolean
  error?: string
  pagination?: PaginationMeta
  onPageChange?: (page: number) => void
  className?: string
}

export interface SearchFormProps {
  filters?: SearchFilters
  onFiltersChange?: (filters: SearchFilters) => void
  onSearch?: (filters: SearchFilters) => void
  className?: string
}

export interface CompanyCardProps {
  company: Company
  showJobsCount?: boolean
  showLocation?: boolean
  compact?: boolean
  className?: string
}

/**
 * SEO and metadata types
 */

export interface SeoMetadata {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  openGraph?: OpenGraphMetadata
  twitter?: TwitterMetadata
  jsonLd?: Record<string, any>[]
}

export interface OpenGraphMetadata {
  title: string
  description: string
  url: string
  type: string
  images?: OpenGraphImage[]
  siteName?: string
  locale?: string
}

export interface OpenGraphImage {
  url: string
  width?: number
  height?: number
  alt?: string
  type?: string
}

export interface TwitterMetadata {
  card: 'summary' | 'summary_large_image'
  title: string
  description: string
  images?: string[]
  creator?: string
  site?: string
}