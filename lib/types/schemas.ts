import { z } from 'zod'

/**
 * Zod schemas for runtime validation
 *
 * These schemas provide runtime type checking and validation
 * for all API responses and form data.
 */

/**
 * Basic primitive schemas
 */
const positiveNumber = z.number().positive()
const nonEmptyString = z.string().min(1)
const emailString = z.string().email()
const urlSchema = z.string().url()
const dateString = z.string().datetime()

/**
 * Enum schemas
 */
const employmentTypeSchema = z.enum([
  'full-time',
  'part-time',
  'contract',
  'temporary',
  'internship',
  'freelance',
  'volunteer',
])

const experienceLevelSchema = z.enum([
  'entry-level',
  'junior',
  'mid-level',
  'senior',
  'lead',
  'manager',
  'director',
  'executive',
])

const companySizeSchema = z.enum([
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5000+',
])

const locationTypeSchema = z.enum([
  'country',
  'province',
  'city',
  'district',
  'subdistrict',
])

const salaryPeriodSchema = z.enum([
  'hour',
  'day',
  'week',
  'month',
  'year',
])

const postedWithinSchema = z.enum([
  'today',
  'yesterday',
  'last-3-days',
  'last-7-days',
  'last-14-days',
  'last-30-days',
])

const sortBySchema = z.enum([
  'relevance',
  'date-desc',
  'date-asc',
  'title-asc',
  'title-desc',
  'company-asc',
  'company-desc',
  'salary-desc',
  'salary-asc',
])

/**
 * Location schemas
 */
const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

const locationSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  slug: nonEmptyString,
  type: locationTypeSchema,
  coordinates: coordinatesSchema.optional(),
  parentId: nonEmptyString.optional(),
  description: nonEmptyString.optional(),
  timezone: nonEmptyString.optional(),
  country: nonEmptyString,
  countryCode: nonEmptyString,
  jobsCount: positiveNumber.optional(),
  companiesCount: positiveNumber.optional(),
  population: positiveNumber.optional(),
  createdAt: dateString,
  updatedAt: dateString,
})

const locationWithChildrenSchema = locationSchema.extend({
  parent: locationSchema.optional(),
  children: z.array(locationSchema).optional(),
})

/**
 * Salary schemas
 */
const salaryInfoSchema = z.object({
  min: positiveNumber.optional(),
  max: positiveNumber.optional(),
  currency: nonEmptyString,
  period: salaryPeriodSchema,
  isNegotiable: z.boolean(),
  isVisible: z.boolean(),
})

/**
 * Company schemas
 */
const companySchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  slug: nonEmptyString,
  description: nonEmptyString.optional(),
  logo: urlSchema.optional(),
  website: urlSchema.optional(),
  industry: nonEmptyString.optional(),
  companySize: companySizeSchema,
  foundedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  email: emailString.optional(),
  phone: nonEmptyString.optional(),
  address: nonEmptyString.optional(),
  linkedin: urlSchema.optional(),
  twitter: urlSchema.optional(),
  instagram: urlSchema.optional(),
  facebook: urlSchema.optional(),
  location: locationSchema,
  benefits: z.array(nonEmptyString),
  culture: nonEmptyString.optional(),
  values: z.array(nonEmptyString).optional(),
  metaTitle: nonEmptyString.optional(),
  metaDescription: nonEmptyString.optional(),
  activeJobsCount: positiveNumber,
  totalJobsCount: positiveNumber,
  verified: z.boolean(),
  featured: z.boolean(),
  createdAt: dateString,
  updatedAt: dateString,
})

/**
 * Job schemas
 */
const jobSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString,
  slug: nonEmptyString,
  description: nonEmptyString,
  requirements: z.array(nonEmptyString),
  responsibilities: z.array(nonEmptyString),
  benefits: z.array(nonEmptyString),
  skills: z.array(nonEmptyString),
  companyId: nonEmptyString,
  company: companySchema,
  location: locationSchema,
  isRemote: z.boolean(),
  isHybrid: z.boolean(),
  employmentType: employmentTypeSchema,
  experienceLevel: experienceLevelSchema,
  salary: salaryInfoSchema.optional(),
  department: nonEmptyString.optional(),
  applicationUrl: urlSchema.optional(),
  applicationEmail: emailString.optional(),
  applicationDeadline: dateString.optional(),
  isActive: z.boolean(),
  metaTitle: nonEmptyString.optional(),
  metaDescription: nonEmptyString.optional(),
  keywords: z.array(nonEmptyString),
  postedAt: dateString,
  updatedAt: dateString,
  expiresAt: dateString.optional(),
  viewCount: positiveNumber,
  applicationCount: positiveNumber,
  featured: z.boolean(),
  priority: z.number().min(0).max(100),
})

/**
 * Pagination schemas
 */
const paginationMetaSchema = z.object({
  currentPage: positiveNumber,
  totalPages: positiveNumber,
  totalItems: positiveNumber,
  itemsPerPage: positiveNumber,
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
})

/**
 * API Response schemas
 */
const apiResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: nonEmptyString.optional(),
    message: nonEmptyString.optional(),
    pagination: paginationMetaSchema.optional(),
  })

/**
 * Search filter schemas
 */
const searchFiltersSchema = z.object({
  query: nonEmptyString.optional(),
  location: nonEmptyString.optional(),
  locationId: nonEmptyString.optional(),
  companyId: nonEmptyString.optional(),
  industry: nonEmptyString.optional(),
  employmentType: z.array(employmentTypeSchema).optional(),
  experienceLevel: z.array(experienceLevelSchema).optional(),
  salaryMin: positiveNumber.optional(),
  salaryMax: positiveNumber.optional(),
  isRemote: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  postedWithin: postedWithinSchema.optional(),
  sortBy: sortBySchema.optional(),
  page: positiveNumber.optional(),
  limit: positiveNumber.optional(),
})

/**
 * Search facet schemas
 */
const locationFacetSchema = z.object({
  location: locationSchema,
  count: positiveNumber,
})

const companyFacetSchema = z.object({
  company: companySchema,
  count: positiveNumber,
})

const industryFacetSchema = z.object({
  industry: nonEmptyString,
  count: positiveNumber,
})

const employmentTypeFacetSchema = z.object({
  type: employmentTypeSchema,
  count: positiveNumber,
})

const experienceLevelFacetSchema = z.object({
  level: experienceLevelSchema,
  count: positiveNumber,
})

const searchFacetsSchema = z.object({
  locations: z.array(locationFacetSchema),
  companies: z.array(companyFacetSchema),
  industries: z.array(industryFacetSchema),
  employmentTypes: z.array(employmentTypeFacetSchema),
  experienceLevels: z.array(experienceLevelFacetSchema),
})

/**
 * Search results schema
 */
const searchResultsSchema = z.object({
  jobs: z.array(jobSchema),
  companies: z.array(companySchema),
  locations: z.array(locationSchema),
  totalCount: positiveNumber,
  facets: searchFacetsSchema,
  suggestions: z.array(nonEmptyString),
})

/**
 * Job statistics schema
 */
const jobStatsSchema = z.object({
  totalJobs: positiveNumber,
  totalCompanies: positiveNumber,
  totalLocations: positiveNumber,
  newJobsToday: positiveNumber,
  newJobsThisWeek: positiveNumber,
  activeLocations: positiveNumber,
  featuredJobs: positiveNumber,
  remoteJobs: positiveNumber,
  popularLocations: z.array(locationFacetSchema),
  popularCompanies: z.array(companyFacetSchema),
  popularIndustries: z.array(industryFacetSchema),
})

/**
 * Application form schema
 */
const applicationDataSchema = z.object({
  jobId: nonEmptyString,
  fullName: nonEmptyString.min(2, 'Name must be at least 2 characters'),
  email: emailString,
  phone: nonEmptyString.min(10, 'Phone number must be at least 10 characters'),
  coverLetter: nonEmptyString.optional(),
  resume: z.instanceof(File).optional(),
  portfolio: urlSchema.optional(),
  linkedin: urlSchema.optional(),
  github: urlSchema.optional(),
  currentSalary: nonEmptyString.optional(),
  expectedSalary: nonEmptyString.optional(),
  availableDate: dateString.optional(),
  noticePeriod: nonEmptyString.optional(),
  additionalInfo: nonEmptyString.optional(),
})

/**
 * User profile schema
 */
const experienceSchema = z.object({
  id: nonEmptyString,
  company: nonEmptyString,
  position: nonEmptyString,
  description: nonEmptyString.optional(),
  startDate: dateString,
  endDate: dateString.optional(),
  current: z.boolean(),
  location: nonEmptyString.optional(),
  skills: z.array(nonEmptyString),
})

const educationSchema = z.object({
  id: nonEmptyString,
  institution: nonEmptyString,
  degree: nonEmptyString,
  field: nonEmptyString.optional(),
  startDate: dateString,
  endDate: dateString.optional(),
  current: z.boolean(),
  gpa: nonEmptyString.optional(),
  description: nonEmptyString.optional(),
})

const userProfileSchema = z.object({
  id: nonEmptyString,
  email: emailString,
  fullName: nonEmptyString.min(2),
  avatar: urlSchema.optional(),
  phone: nonEmptyString.optional(),
  location: locationSchema.optional(),
  bio: nonEmptyString.optional(),
  skills: z.array(nonEmptyString),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  resume: nonEmptyString.optional(),
  portfolio: urlSchema.optional(),
  linkedin: urlSchema.optional(),
  github: urlSchema.optional(),
  website: urlSchema.optional(),
  jobAlerts: z.boolean(),
  emailNotifications: z.boolean(),
  savedJobs: z.array(nonEmptyString),
  appliedJobs: z.array(nonEmptyString),
  createdAt: dateString,
  updatedAt: dateString,
})

/**
 * SEO metadata schemas
 */
const openGraphImageSchema = z.object({
  url: urlSchema,
  width: positiveNumber.optional(),
  height: positiveNumber.optional(),
  alt: nonEmptyString.optional(),
  type: nonEmptyString.optional(),
})

const openGraphMetadataSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  url: urlSchema,
  type: nonEmptyString,
  images: z.array(openGraphImageSchema).optional(),
  siteName: nonEmptyString.optional(),
  locale: nonEmptyString.optional(),
})

const twitterMetadataSchema = z.object({
  card: z.enum(['summary', 'summary_large_image']),
  title: nonEmptyString,
  description: nonEmptyString,
  images: z.array(urlSchema).optional(),
  creator: nonEmptyString.optional(),
  site: nonEmptyString.optional(),
})

const seoMetadataSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  keywords: z.array(nonEmptyString).optional(),
  canonical: urlSchema.optional(),
  openGraph: openGraphMetadataSchema.optional(),
  twitter: twitterMetadataSchema.optional(),
  jsonLd: z.array(z.record(z.any())).optional(),
})

/**
 * API response type schemas
 */
export const jobsResponseSchema = apiResponseSchema(z.array(jobSchema))
export const jobResponseSchema = apiResponseSchema(jobSchema)
export const companiesResponseSchema = apiResponseSchema(z.array(companySchema))
export const companyResponseSchema = apiResponseSchema(companySchema)
export const locationsResponseSchema = apiResponseSchema(z.array(locationSchema))
export const searchResponseSchema = apiResponseSchema(searchResultsSchema)
export const statsResponseSchema = apiResponseSchema(jobStatsSchema)

/**
 * Form validation schemas
 */
export const searchFormSchema = searchFiltersSchema
export const applicationFormSchema = applicationDataSchema
export const profileFormSchema = userProfileSchema

/**
 * Component prop validation schemas
 */
export const jobCardPropsSchema = z.object({
  job: jobSchema,
  featured: z.boolean().optional(),
  showCompany: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  compact: z.boolean().optional(),
  className: nonEmptyString.optional(),
})

export const companyCardPropsSchema = z.object({
  company: companySchema,
  showJobsCount: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  compact: z.boolean().optional(),
  className: nonEmptyString.optional(),
})

/**
 * Export type inference
 */
export type JobSchema = z.infer<typeof jobSchema>
export type CompanySchema = z.infer<typeof companySchema>
export type LocationSchema = z.infer<typeof locationSchema>
export type SearchFiltersSchema = z.infer<typeof searchFiltersSchema>
export type SearchResultsSchema = z.infer<typeof searchResultsSchema>
export type JobStatsSchema = z.infer<typeof jobStatsSchema>
export type ApplicationDataSchema = z.infer<typeof applicationDataSchema>
export type UserProfileSchema = z.infer<typeof userProfileSchema>
export type SeoMetadataSchema = z.infer<typeof seoMetadataSchema>

/**
 * Validation helper functions
 */
export function validateJob(data: unknown): JobSchema {
  return jobSchema.parse(data)
}

export function validateCompany(data: unknown): CompanySchema {
  return companySchema.parse(data)
}

export function validateLocation(data: unknown): LocationSchema {
  return locationSchema.parse(data)
}

export function validateSearchFilters(data: unknown): SearchFiltersSchema {
  return searchFiltersSchema.parse(data)
}

export function validateApplicationData(data: unknown): ApplicationDataSchema {
  return applicationDataSchema.parse(data)
}

export function validateJobStats(data: unknown): JobStatsSchema {
  return jobStatsSchema.parse(data)
}

/**
 * Safe validation functions (return null instead of throwing)
 */
export function safeValidateJob(data: unknown): JobSchema | null {
  try {
    return jobSchema.parse(data)
  } catch {
    return null
  }
}

export function safeValidateCompany(data: unknown): CompanySchema | null {
  try {
    return companySchema.parse(data)
  } catch {
    return null
  }
}

export function safeValidateLocation(data: unknown): LocationSchema | null {
  try {
    return locationSchema.parse(data)
  } catch {
    return null
  }
}