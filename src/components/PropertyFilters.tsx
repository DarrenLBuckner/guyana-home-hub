'use client'

// Zillow-style Property Filters - Advanced Search Interface
// src/components/PropertyFilters.tsx

import React, { useState, useCallback } from 'react'
import { 
  Search, 
  MapPin, 
  Home, 
  Building2, 
  Warehouse, 
  TreePine,
  Bed,
  Bath,
  DollarSign,
  Calendar,
  Filter,
  X,
  ChevronDown,
  Sliders
} from 'lucide-react'
import { Property, PropertyFilters as IPropertyFilters } from '@/types/property'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PropertyFiltersProps {
  filters: IPropertyFilters
  onFiltersChangeAction: (filters: IPropertyFilters) => void
  className?: string
  showAdvanced?: boolean
  onToggleAdvancedAction?: () => void
}

export function PropertyFilters({ 
  filters, 
  onFiltersChangeAction, 
  className,
  showAdvanced = false,
  onToggleAdvancedAction
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<IPropertyFilters>(filters)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const propertyTypes = [
    { value: 'house', label: 'House', icon: Home },
    { value: 'apartment', label: 'Apartment', icon: Building2 },
    { value: 'condo', label: 'Condo', icon: Building2 },
    { value: 'commercial', label: 'Commercial', icon: Warehouse },
    { value: 'land', label: 'Land', icon: TreePine },
  ] as const

  const listingTypes = [
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
  ] as const

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' },
  ] as const

  const bedroomOptions = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 5, label: '5+' },
  ]

  const bathroomOptions = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
  ]

  const priceRanges = [
    { min: 0, max: 10500000, label: 'Under G$10.5M (~$50K)' },
    { min: 10500000, max: 21000000, label: 'G$10.5M - G$21M (~$50K - $100K)' },
    { min: 21000000, max: 42000000, label: 'G$21M - G$42M (~$100K - $200K)' },
    { min: 42000000, max: 105000000, label: 'G$42M - G$105M (~$200K - $500K)' },
    { min: 105000000, max: 210000000, label: 'G$105M - G$210M (~$500K - $1M)' },
    { min: 210000000, max: undefined, label: 'G$210M+ (~$1M+)' },
  ]

  const updateFilters = useCallback((newFilters: Partial<IPropertyFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters }
    setLocalFilters(updatedFilters)
    onFiltersChangeAction(updatedFilters)
  }, [localFilters, onFiltersChangeAction])

  const clearFilters = () => {
    const clearedFilters: IPropertyFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChangeAction(clearedFilters)
  }

  const togglePropertyType = (type: Property['property_type']) => {
    const currentTypes = localFilters.property_type || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    
    updateFilters({ property_type: newTypes.length > 0 ? newTypes : undefined })
  }

  const toggleStatus = (status: Property['status']) => {
    const currentStatuses = localFilters.status || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    
    updateFilters({ status: newStatuses.length > 0 ? newStatuses : undefined })
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    }
    return `$${price.toLocaleString()}`
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.search_term) count++
    if (localFilters.location) count++
    if (localFilters.property_type?.length) count++
    if (localFilters.listing_type?.length) count++
    if (localFilters.status?.length) count++
    if (localFilters.price_min || localFilters.price_max) count++
    if (localFilters.bedrooms_min) count++
    if (localFilters.bathrooms_min) count++
    return count
  }

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-200">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Content */}
      <div className={cn(
        "p-4 space-y-4",
        showMobileFilters ? "block" : "hidden lg:block"
      )}>
        {/* Search and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={localFilters.search_term || ''}
              onChange={(e) => updateFilters({ search_term: e.target.value || undefined })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={localFilters.location || ''}
              onChange={(e) => updateFilters({ location: e.target.value || undefined })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Property Type</h4>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => {
              const Icon = type.icon
              const isSelected = localFilters.property_type?.includes(type.value)
              return (
                <button
                  key={type.value}
                  onClick={() => togglePropertyType(type.value)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Listing Type */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Listing Type</h4>
          <div className="flex gap-2">
            {listingTypes.map((type) => {
              const isSelected = localFilters.listing_type?.includes(type.value)
              return (
                <button
                  key={type.value}
                  onClick={() => {
                    const currentTypes = localFilters.listing_type || []
                    const newTypes = currentTypes.includes(type.value)
                      ? currentTypes.filter(t => t !== type.value)
                      : [...currentTypes, type.value]
                    updateFilters({ listing_type: newTypes.length > 0 ? newTypes : undefined })
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Price Range</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="Min price"
                value={localFilters.price_min || ''}
                onChange={(e) => updateFilters({ 
                  price_min: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="Max price"
                value={localFilters.price_max || ''}
                onChange={(e) => updateFilters({ 
                  price_max: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => updateFilters({ 
                  price_min: range.min,
                  price_max: range.max
                })}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Bed className="h-4 w-4 mr-2" />
              Bedrooms
            </h4>
            <div className="flex gap-2">
              {bedroomOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ 
                    bedrooms_min: localFilters.bedrooms_min === option.value ? undefined : option.value 
                  })}
                  className={cn(
                    "px-3 py-1 rounded text-sm transition-colors",
                    localFilters.bedrooms_min === option.value
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Bath className="h-4 w-4 mr-2" />
              Bathrooms
            </h4>
            <div className="flex gap-2">
              {bathroomOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ 
                    bathrooms_min: localFilters.bathrooms_min === option.value ? undefined : option.value 
                  })}
                  className={cn(
                    "px-3 py-1 rounded text-sm transition-colors",
                    localFilters.bathrooms_min === option.value
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => {
                  const isSelected = localFilters.status?.includes(status.value)
                  return (
                    <button
                      key={status.value}
                      onClick={() => toggleStatus(status.value)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {status.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            Clear All
          </Button>
          <div className="flex items-center space-x-2">
            {onToggleAdvancedAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleAdvancedAction}
                className="flex items-center"
              >
                <Sliders className="h-4 w-4 mr-2" />
                {showAdvanced ? 'Less' : 'More'} Filters
              </Button>
            )}
            {getActiveFiltersCount() > 0 && (
              <span className="text-sm text-gray-600">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
