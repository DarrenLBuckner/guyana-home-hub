"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Bed,
  Bath,
  Square,
  Search,
  Grid,
  List,
  Eye,
  Home,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { PropertyStatusRibbon } from '@/components/PropertyStatusRibbon'
import { FSBOBadge } from '@/components/FSBOBadge'
import { WatchButton } from '@/components/WatchButton'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string | null
  region?: string
  property_type: string
  listing_type: string
  price_type?: string
  bedrooms: number
  bathrooms: number
  home_size?: string
  lot_size?: string | null
  features?: string[] | null
  images?: string[]
  hero_index?: number
  status: string
  user_id: string
  created_at: string
  views?: number
  // Additional fields from API
  city?: string
  neighborhood?: string
  year_built?: number
  amenities?: string[]
  listed_by_type?: string
  rental_type?: string | null
}

interface PropertiesListingProps {
  title: string
  filterType?: 'sale' | 'rent' | 'lease' | 'all' | string[]
  propertyCategory?: 'residential' | 'commercial' | 'all'
  showFilters?: boolean
}

// Property type options based on category — values MUST match database (Title Case)
const RESIDENTIAL_PROPERTY_TYPES = [
  { value: 'House', label: 'House' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Condo', label: 'Condo' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Land', label: 'Land' },
]

const COMMERCIAL_PROPERTY_TYPES = [
  { value: 'Office', label: 'Office' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Mixed Use', label: 'Mixed Use' },
  { value: 'Commercial Land', label: 'Commercial Land' },
  { value: 'Agricultural Land', label: 'Agricultural Land' },
]

function PropertiesListingContent({
  title,
  filterType = 'all',
  propertyCategory = 'all',
  showFilters = true
}: PropertiesListingProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  // Filter states - Initialize from URL parameters (back-compat: read 'location' as fallback for 'q')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || searchParams.get('location') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [bedrooms, setBedrooms] = useState(searchParams.get('beds') || '')
  const [bathrooms, setBathrooms] = useState(searchParams.get('baths') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'price-high')

  // Reactively sync FROM URL params when they change (e.g. from PropertySearchTabs)
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || searchParams.get('location') || '')
    setSelectedType(searchParams.get('type') || '')
    setPriceRange(searchParams.get('price') || '')
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
    setBedrooms(searchParams.get('beds') || '')
    setBathrooms(searchParams.get('baths') || '')
    setSortBy(searchParams.get('sort') || 'price-high')
  }, [searchParams])

  // Sync filter state to URL params (debounced) — only when this component owns the filters
  const urlSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const syncFiltersToUrl = useCallback(() => {
    if (!showFilters) return // PropertySearchTabs owns the URL when filters are hidden
    if (urlSyncTimer.current) clearTimeout(urlSyncTimer.current)
    urlSyncTimer.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (searchTerm) params.set('q', searchTerm)
      if (selectedType) params.set('type', selectedType)
      if (priceRange) params.set('price', priceRange)
      if (bedrooms) params.set('beds', bedrooms)
      if (bathrooms) params.set('baths', bathrooms)
      if (sortBy && sortBy !== 'price-high') params.set('sort', sortBy)
      const qs = params.toString()
      router.replace(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false })
    }, 300)
  }, [searchTerm, selectedType, priceRange, bedrooms, bathrooms, sortBy, pathname, router, showFilters])

  useEffect(() => {
    syncFiltersToUrl()
    return () => { if (urlSyncTimer.current) clearTimeout(urlSyncTimer.current) }
  }, [syncFiltersToUrl])

  // Count of active secondary filters (for badge on "More" button) — searchTerm excluded, location search hidden
  const moreFilterCount = (bathrooms ? 1 : 0) + (sortBy !== 'price-high' ? 1 : 0)
  const hasAnyFilter = !!(selectedType || priceRange || bedrooms || bathrooms)

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        // Build API URL with filters
        const params = new URLSearchParams();
        if (filterType !== 'all') {
          if (Array.isArray(filterType)) {
            // For multiple filter types, we'll handle this on the backend
            params.append('listing_type_multiple', filterType.join(','));
          } else {
            params.append('listing_type', filterType);
          }
        }
        if (propertyCategory !== 'all') {
          params.append('property_category', propertyCategory);
        }
        
        const apiUrl = `/api/properties${params.toString() ? '?' + params.toString() : ''}`;
        console.log('Fetching properties with filters:', { filterType, propertyCategory, apiUrl });
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const result = await response.json();
        setProperties(result.properties || []);
        
        } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      }
      setLoading(false);
    }
    fetchProperties();
  }, [filterType, propertyCategory]);

  // Smart price ranges based on listing type and property category
  const getPriceRanges = () => {
    if (filterType === 'rent' || filterType === 'lease') {
      if (propertyCategory === 'commercial') {
        return [
          { label: 'Under GYD 100K', value: '0-100000' },
          { label: 'GYD 100K - 250K', value: '100000-250000' },
          { label: 'GYD 250K - 500K', value: '250000-500000' },
          { label: 'GYD 500K - 1M', value: '500000-1000000' },
          { label: 'GYD 1M+', value: '1000000-999999999' }
        ];
      } else {
        return [
          { label: 'Under GYD 50K', value: '0-50000' },
          { label: 'GYD 50K - 100K', value: '50000-100000' },
          { label: 'GYD 100K - 200K', value: '100000-200000' },
          { label: 'GYD 200K - 500K', value: '200000-500000' },
          { label: 'GYD 500K+', value: '500000-999999999' }
        ];
      }
    } else {
      if (propertyCategory === 'commercial') {
        return [
          { label: 'Under GYD 25M', value: '0-25000000' },
          { label: 'GYD 25M - 50M', value: '25000000-50000000' },
          { label: 'GYD 50M - 100M', value: '50000000-100000000' },
          { label: 'GYD 100M - 250M', value: '100000000-250000000' },
          { label: 'GYD 250M+', value: '250000000-999999999' }
        ];
      } else {
        return [
          { label: 'Under GYD 10M', value: '0-10000000' },
          { label: 'GYD 10M - 25M', value: '10000000-25000000' },
          { label: 'GYD 25M - 50M', value: '25000000-50000000' },
          { label: 'GYD 50M - 100M', value: '50000000-100000000' },
          { label: 'GYD 100M+', value: '100000000-999999999' }
        ];
      }
    }
  };

  const formatPrice = (price: number, type?: string) => {
    const formatted = price.toLocaleString()
    return (type === 'rent' || type === 'lease') ? `GYD ${formatted}/month` : `GYD ${formatted}`
  }

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedType('')
    setPriceRange('')
    setBedrooms('')
    setBathrooms('')
    setSortBy('price-high')
    router.replace(pathname, { scroll: false })
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Property type filter - supports comma-separated multi-select (e.g. "house,apartment")
    let matchesType = !selectedType;
    if (selectedType) {
      const typeValues = selectedType.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      if (typeValues.length === 0) {
        matchesType = true
      } else if (typeValues.includes('commercial')) {
        // If "commercial" is one of the selected types, also match by category
        const otherTypes = typeValues.filter(t => t !== 'commercial')
        const matchesCategory = (property as any).property_category === 'commercial'
        const matchesSpecific = otherTypes.length > 0 && otherTypes.includes(property.property_type?.toLowerCase() || '')
        matchesType = matchesCategory || matchesSpecific
      } else {
        matchesType = typeValues.includes(property.property_type?.toLowerCase() || '')
      }
    }
    
    const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms)
    const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms)
    
    // Filter by listing type (sale/rent/lease) based on page
    const listingType = property.listing_type || 'sale' // Default to sale if missing
    const matchesListingType = filterType === 'all' || 
      (Array.isArray(filterType) ? filterType.includes(listingType) : filterType === listingType)
    
    // Filter by property category - backwards compatible approach
    const databaseCategory = (property as any).property_category;
    let matchesCategory = true;
    
    if (propertyCategory !== 'all') {
      if (databaseCategory) {
        // Use database field if available
        matchesCategory = (propertyCategory === 'commercial' && databaseCategory === 'commercial') ||
                         (propertyCategory === 'residential' && databaseCategory === 'residential');
      } else {
        // Fallback to property type inference for older properties
        const propertyType = property.property_type?.toLowerCase() || ''
        const commercialTypes = ['office', 'retail', 'warehouse', 'industrial', 'mixed use', 'commercial land', 'commercial']
        const isCommercial = commercialTypes.some(type => propertyType.includes(type.toLowerCase()))
        matchesCategory = (propertyCategory === 'commercial' && isCommercial) ||
                         (propertyCategory === 'residential' && !isCommercial);
      }
    }
    
    // Handle price range filtering (supports both old 'price=min-max' and new 'minPrice'/'maxPrice')
    let matchesPrice = true
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(p => parseInt(p))
      matchesPrice = property.price >= min && property.price <= max
    } else {
      if (minPrice) matchesPrice = property.price >= parseInt(minPrice)
      if (maxPrice) matchesPrice = matchesPrice && property.price <= parseInt(maxPrice)
    }

    return matchesSearch && matchesType && matchesBedrooms && matchesBathrooms && matchesPrice && matchesListingType && matchesCategory
  }).sort((a, b) => {
    // Apply sorting
    switch (sortBy) {
      case 'price-high':
        return b.price - a.price // Highest first
      case 'price-low':
        return a.price - b.price // Lowest first
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      default:
        return b.price - a.price // Default to highest price first
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - ALWAYS VISIBLE */}
      <div className="sticky top-0 bg-white z-30 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-700">{title}</h1>
              <p className="text-gray-600 text-sm">{filteredProperties.length} properties found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Banner for Diaspora Buyers - Hidden on mobile for cleaner UX */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📚</div>
              <div>
                <p className="text-green-800 font-semibold">New to buying property in Guyana?</p>
                <p className="text-green-700 text-sm">Learn how to buy safely and avoid scams with our expert guides.</p>
              </div>
            </div>
            <Link
              href="/guides/buying-from-abroad"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
            >
              Read Guide
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        {showFilters && (
          <div className="bg-white shadow-sm rounded-lg mb-6 border">
            {/* ── DESKTOP FILTERS (lg+) ── */}
            <div className="hidden lg:block p-4">
              {/* Primary row: Type, Price, Beds, Search, Clear */}
              <div className="flex items-center gap-3">
                {/* Property Type */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`px-4 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    selectedType ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <option value="">Property Type</option>
                  {(propertyCategory === 'commercial' ? COMMERCIAL_PROPERTY_TYPES : RESIDENTIAL_PROPERTY_TYPES).map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                {/* Price Range */}
                <select
                  value={priceRange}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className={`px-4 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    priceRange ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <option value="">{filterType === 'rent' ? 'Monthly Rent' : 'Price Range'}</option>
                  {getPriceRanges().map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>

                {/* Bedrooms */}
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className={`px-4 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    bedrooms ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <option value="">Beds</option>
                  <option value="1">1+ Bed</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                  <option value="5">5+ Beds</option>
                </select>

                {/* TEMPORARILY HIDDEN - Location search not yet functional - TODO: Build proper geocoding
                <div className="flex-1 relative min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search location, title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                */}

                {/* More Filters toggle */}
                <button
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    showMoreFilters || moreFilterCount > 0
                      ? 'border-green-500 text-green-700 bg-green-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  More
                  {moreFilterCount > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {moreFilterCount}
                    </span>
                  )}
                </button>

                {/* Clear All */}
                {hasAnyFilter && (
                  <button
                    onClick={clearAllFilters}
                    className="text-green-600 hover:text-green-700 text-sm font-medium whitespace-nowrap"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Secondary row: Baths, Sort (expandable) */}
              {showMoreFilters && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                  {/* Bathrooms */}
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className={`px-4 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      bathrooms ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    <option value="">Baths</option>
                    <option value="1">1+ Bath</option>
                    <option value="2">2+ Baths</option>
                    <option value="3">3+ Baths</option>
                    <option value="4">4+ Baths</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              )}
            </div>

            {/* ── MOBILE INLINE FILTERS (<lg) ── */}
            <div className="lg:hidden p-3">
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                {/* Property Type pill */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`flex-shrink-0 px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none bg-no-repeat bg-[length:12px] bg-[center_right_8px] ${
                    selectedType
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, paddingRight: '24px' }}
                >
                  <option value="">Type</option>
                  {(propertyCategory === 'commercial' ? COMMERCIAL_PROPERTY_TYPES : RESIDENTIAL_PROPERTY_TYPES).map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                {/* Price pill */}
                <select
                  value={priceRange}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className={`flex-shrink-0 px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none bg-no-repeat bg-[length:12px] bg-[center_right_8px] ${
                    priceRange
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, paddingRight: '24px' }}
                >
                  <option value="">Price</option>
                  {getPriceRanges().map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>

                {/* Beds pill */}
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className={`flex-shrink-0 px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none bg-no-repeat bg-[length:12px] bg-[center_right_8px] ${
                    bedrooms
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, paddingRight: '24px' }}
                >
                  <option value="">Beds</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>

                {/* More pill — opens drawer for secondary filters */}
                <button
                  onClick={() => setShowFiltersModal(true)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 border rounded-full text-sm font-medium ${
                    moreFilterCount > 0
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  More
                  {moreFilterCount > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {moreFilterCount}
                    </span>
                  )}
                </button>

                {/* Clear pill — only shows when filters active */}
                {hasAnyFilter && (
                  <button
                    onClick={clearAllFilters}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-2 border border-red-200 rounded-full text-sm text-red-600 bg-red-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredProperties.map((property) => (
              <div key={property.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex' : ''
              }`}>
                {/* Property Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'h-48'}`}>
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[property.hero_index || 0] || property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${property.images && property.images.length > 0 ? 'hidden' : ''}`}>
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                  {/* Property Status Ribbon */}
                  <PropertyStatusRibbon
                    status={property.status}
                    listingType={property.listing_type as 'sale' | 'rent' | 'lease' | 'short_term_rent'}
                  />

                  {/* Views Badge - Bottom Left */}
                  {property.views && property.views > 0 && (
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center shadow-sm">
                      <Eye className="h-3 w-3 mr-1" />
                      {property.views.toLocaleString()}
                    </div>
                  )}

                  {/* Watch Button */}
                  <div className="absolute top-2 right-2">
                    <WatchButton propertyId={property.id} variant="icon" />
                  </div>
                </div>

                {/* Property Details */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>

                  {/* Property Features */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    {property.home_size && (
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.home_size} sq ft</span>
                      </div>
                    )}
                  </div>

                  {/* Property Tags */}
                  {property.features && property.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.features.slice(0, 3).map((feature) => (
                        <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                      {property.features.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          +{property.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price and Actions */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(property.price, property.price_type)}
                      </div>
                      {/* FSBO Badge */}
                      <FSBOBadge listedByType={property.listed_by_type} className="mt-1" />
                    </div>
                    <div className="flex">
                      <Link 
                        href={`/properties/${property.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Mobile "More Filters" Drawer — secondary filters only */}
      {showFiltersModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFiltersModal(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto animate-slide-up">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">More Filters</h2>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* TEMPORARILY HIDDEN - Location search not yet functional - TODO: Build proper geocoding
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Location, title, keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                */}

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+ Bath</option>
                    <option value="2">2+ Baths</option>
                    <option value="3">3+ Baths</option>
                    <option value="4">4+ Baths</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                {hasAnyFilter && (
                  <button
                    onClick={() => { clearAllFilters(); setShowFiltersModal(false) }}
                    className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Reset All
                  </button>
                )}
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-sm"
                >
                  Show {filteredProperties.length} Properties
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function PropertiesListing(props: PropertiesListingProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesListingContent {...props} />
    </Suspense>
  )
}
