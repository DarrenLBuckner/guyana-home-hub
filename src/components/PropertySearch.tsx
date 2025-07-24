'use client'

// Enhanced Property Search - Zillow-style Search Experience
// src/components/PropertySearch.tsx

import React, { useState, useCallback, useMemo } from 'react'
import { Search, MapPin, Filter, Grid, List, SortAsc, Map } from 'lucide-react'
import { PropertyFilters } from './PropertyFilters'
import { PropertyCard } from './PropertyCard'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { Property, PropertyFilters as IPropertyFilters, PropertySortOptions } from '@/types/property'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { useProperties } from '@/hooks/useProperties'
import { useDebounce } from '@/hooks/useDebounce'

interface PropertySearchProps {
  initialFilters?: IPropertyFilters
  showMap?: boolean
  className?: string
}

export function PropertySearch({ 
  initialFilters = {}, 
  showMap = false,
  className 
}: PropertySearchProps) {
  const [filters, setFilters] = useState<IPropertyFilters>(initialFilters)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState<PropertySortOptions>({ 
    field: 'created_at', 
    direction: 'desc' 
  })

  // Debounce search terms to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 300)

  // Use the properties hook with our filters
  const {
    data: propertiesData,
    isLoading,
    error,
    refetch
  } = useProperties(
    debouncedFilters,
    sortBy,
    1,
    { enabled: true }
  )

  const properties = propertiesData?.properties || []
  const totalCount = propertiesData?.total || 0

  const handleFiltersChange = useCallback((newFilters: IPropertyFilters) => {
    setFilters(newFilters)
  }, [])

  const handleSortChange = useCallback((newSort: PropertySortOptions) => {
    setSortBy(newSort)
  }, [])

  const handlePropertyFavorite = useCallback((propertyId: string) => {
    // TODO: Implement favorite functionality
    console.log('Favoriting property:', propertyId)
  }, [])

  const handlePropertyShare = useCallback((property: Property) => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: `${window.location.origin}/properties/${property.id}`
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/properties/${property.id}`)
    }
  }, [])

  const handlePropertyContact = useCallback((property: Property) => {
    // TODO: Implement contact modal/navigation
    console.log('Contacting about property:', property.id)
  }, [])

  const sortOptions = [
    { field: 'created_at', direction: 'desc', label: 'Newest First' },
    { field: 'created_at', direction: 'asc', label: 'Oldest First' },
    { field: 'price', direction: 'asc', label: 'Price: Low to High' },
    { field: 'price', direction: 'desc', label: 'Price: High to Low' },
    { field: 'views', direction: 'desc', label: 'Most Popular' },
  ] as const

  const getActiveFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search_term) count++
    if (filters.location) count++
    if (filters.property_type?.length) count++
    if (filters.listing_type?.length) count++
    if (filters.status?.length) count++
    if (filters.price_min || filters.price_max) count++
    if (filters.bedrooms_min) count++
    if (filters.bathrooms_min) count++
    return count
  }, [filters])

  const formatResultsText = () => {
    if (totalCount === 0) return 'No properties found'
    if (totalCount === 1) return '1 property found'
    return `${totalCount.toLocaleString()} properties found`
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Quick Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address, neighborhood, or property type..."
              value={filters.search_term || ''}
              onChange={(e) => handleFiltersChange({ ...filters, search_term: e.target.value || undefined })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={filters.location || ''}
              onChange={(e) => handleFiltersChange({ ...filters, location: e.target.value || undefined })}
              className="w-full lg:w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="px-6 py-3 flex items-center"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {getActiveFiltersCount > 0 && (
              <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                {getActiveFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <PropertyFilters
          filters={filters}
          onFiltersChangeAction={handleFiltersChange}
          showAdvanced={showAdvancedFilters}
          onToggleAdvancedAction={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />
      )}

      {/* Results Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {formatResultsText()}
          </h2>
          {isLoading && (
            <LoadingSpinner size="small" color="primary" />
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-gray-400" />
            <select
              value={`${sortBy.field}-${sortBy.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-') as [PropertySortOptions['field'], PropertySortOptions['direction']]
                handleSortChange({ field, direction })
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {sortOptions.map((option) => (
                <option 
                  key={`${option.field}-${option.direction}`} 
                  value={`${option.field}-${option.direction}`}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                viewMode === 'grid' 
                  ? "bg-green-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                viewMode === 'list' 
                  ? "bg-green-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              <List className="h-4 w-4" />
            </button>
            {showMap && (
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors",
                  viewMode === 'map' 
                    ? "bg-green-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                <Map className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Content */}
      {error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold">Error loading properties</h3>
            <p className="text-sm">{error.message}</p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <h3 className="text-lg font-semibold">No properties found</h3>
            <p className="text-sm">Try adjusting your search criteria or filters</p>
          </div>
          <Button 
            onClick={() => {
              setFilters({})
              setShowFilters(false)
            }}
            variant="outline"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Map View */}
          {viewMode === 'map' && (
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Map className="h-12 w-12 mx-auto mb-4" />
                <p>Map view coming soon</p>
              </div>
            </div>
          )}

          {/* List/Grid View */}
          {viewMode !== 'map' && (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            )}>
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  variant={viewMode}
                  showStats={true}
                  showContactButtons={true}
                  onFavorite={handlePropertyFavorite}
                  onShare={handlePropertyShare}
                  onContact={handlePropertyContact}
                />
              ))}
            </div>
          )}

          {/* Load More / Pagination */}
          {properties.length < totalCount && (
            <div className="text-center pt-8">
              <Button variant="outline" size="lg">
                Load More Properties
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
