'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Badge, Card } from '@/components/ui/atomic'
import { cn } from '@/lib/utils/cn'
import type { SearchFilters, EmploymentType, ExperienceLevel } from '@/lib/types'

/**
 * Advanced Search Filters - Karirhub Inspired
 *
 * Comprehensive search interface with:
 * - Real-time search suggestions
 * - Multi-select filters
 * - Location autocomplete
 * - Salary range slider
 * - Mobile responsive
 * - Performance optimized
 */

interface AdvancedSearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: (filters: SearchFilters) => void
  loading?: boolean
  totalResults?: number
}

// Mock data for locations and suggestions
const popularLocations = [
  'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
  'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi'
]

const popularCompanies = [
  'Tokopedia', 'Gojek', 'Traveloka', 'Shopee', 'Bukalapak',
  'Telkom Indonesia', 'Bank Central Asia', 'Unilever', 'PT Astra International'
]

const jobCategories = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
  'Sales', 'Customer Service', 'Operations', 'Human Resources', 'Engineering'
]

export function AdvancedSearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  loading = false,
  totalResults = 0
}: AdvancedSearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [locationInput, setLocationInput] = useState(filters.location || '')
  const [companyInput, setCompanyInput] = useState(filters.company || '')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false)

  // Salary range state
  const [salaryRange, setSalaryRange] = useState({
    min: filters.salaryMin || 0,
    max: filters.salaryMax || 20000000
  })

  // Filtered suggestions
  const locationSuggestions = useMemo(() => {
    return popularLocations.filter(location =>
      location.toLowerCase().includes(locationInput.toLowerCase())
    ).slice(0, 5)
  }, [locationInput])

  const companySuggestions = useMemo(() => {
    return popularCompanies.filter(company =>
      company.toLowerCase().includes(companyInput.toLowerCase())
    ).slice(0, 5)
  }, [companyInput])

  // Debounced search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationInput.length > 0) {
        setShowLocationSuggestions(true)
      } else {
        setShowLocationSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [locationInput])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (companyInput.length > 0) {
        setShowCompanySuggestions(true)
      } else {
        setShowCompanySuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [companyInput])

  // Memoized handlers
  const handleLocationSelect = useCallback((location: string) => {
    setLocationInput(location)
    onFiltersChange({ ...filters, location })
    setShowLocationSuggestions(false)
  }, [filters, onFiltersChange])

  const handleCompanySelect = useCallback((company: string) => {
    setCompanyInput(company)
    onFiltersChange({ ...filters, company })
    setShowCompanySuggestions(false)
  }, [filters, onFiltersChange])

  const handleEmploymentTypeToggle = useCallback((type: EmploymentType) => {
    const currentTypes = filters.employmentType || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    onFiltersChange({ ...filters, employmentType: newTypes })
  }, [filters, onFiltersChange])

  const handleSalaryRangeChange = useCallback((min: number, max: number) => {
    setSalaryRange({ min, max })
    onFiltersChange({ ...filters, salaryMin: min, salaryMax: max })
  }, [filters, onFiltersChange])

  const handleSearch = useCallback(() => {
    onSearch(filters)
  }, [filters, onSearch])

  const handleReset = useCallback(() => {
    const emptyFilters: SearchFilters = {}
    onFiltersChange(emptyFilters)
    setLocationInput('')
    setCompanyInput('')
    setSalaryRange({ min: 0, max: 20000000 })
  }, [onFiltersChange])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.query) count++
    if (filters.location) count++
    if (filters.company) count++
    if (filters.employmentType?.length) count++
    if (filters.salaryMin || filters.salaryMax) count++
    if (filters.experienceLevel?.length) count++
    if (filters.isRemote) count++
    return count
  }, [filters])

  // Employment type options
  const employmentTypes: { value: EmploymentType; label: string }[] = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ]

  return (
    <Card className="p-6 space-y-6">
      {/* Main Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <div className="flex gap-2">
            {/* Keyword Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={filters.query || ''}
                onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
                placeholder="Search by job title, keyword, or skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              loading={loading}
              variant="primary"
              className="px-6"
            >
              Search Jobs
            </Button>
          </div>

          {/* Results count */}
          {totalResults > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Found {totalResults.toLocaleString()} jobs
              {activeFiltersCount > 0 && (
                <span> with {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}</span>
              )}
            </p>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.isRemote && (
            <Badge variant="success">
              Remote Only
              <button
                onClick={() => onFiltersChange({ ...filters, isRemote: false })}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.location && (
            <Badge variant="info">
              📍 {filters.location}
              <button
                onClick={() => {
                  setLocationInput('')
                  onFiltersChange({ ...filters, location: undefined })
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.company && (
            <Badge variant="info">
              🏢 {filters.company}
              <button
                onClick={() => {
                  setCompanyInput('')
                  onFiltersChange({ ...filters, company: undefined })
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.employmentType?.map(type => (
            <Badge key={type} variant="info">
              {type.replace('-', ' ')}
              <button
                onClick={() => handleEmploymentTypeToggle(type)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="border-t border-gray-200 pt-6">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span>Advanced Filters</span>
          <svg
            className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="City or province..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          {locationSuggestions.map((location, index) => (
                            <button
                              key={index}
                              onClick={() => handleLocationSelect(location)}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                              📍 {location}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={companyInput}
                        onChange={(e) => setCompanyInput(e.target.value)}
                        placeholder="Company name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {showCompanySuggestions && companySuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          {companySuggestions.map((company, index) => (
                            <button
                              key={index}
                              onClick={() => handleCompanySelect(company)}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                              🏢 {company}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      {jobCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Employment Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Employment Type</label>
                  <div className="flex flex-wrap gap-2">
                    {employmentTypes.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handleEmploymentTypeToggle(value)}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                          filters.employmentType?.includes(value)
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Salary Range: {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(salaryRange.min)} - {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(salaryRange.max)}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="20000000"
                      step="1000000"
                      value={salaryRange.min}
                      onChange={(e) => handleSalaryRangeChange(Number(e.target.value), salaryRange.max)}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="20000000"
                      step="1000000"
                      value={salaryRange.max}
                      onChange={(e) => handleSalaryRangeChange(salaryRange.min, Number(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSearch} loading={loading} variant="primary">
                    Apply Filters
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    Reset All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}