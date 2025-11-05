"use client"

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  MapPin,
  Bed,
  Bath,
  Square,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  MessageSquare,
  Eye,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { usePropertyEngagement } from '@/hooks/usePropertyEngagement'

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
  filterType?: 'sale' | 'rent' | 'all'
  showFilters?: boolean
}

function PropertiesListingContent({ 
  title, 
  filterType = 'all', 
  showFilters = true
}: PropertiesListingProps) {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  
  // Property engagement hook (likes + favorites)
  const { 
    favoriteStatus, 
    toggleFavorite, 
    user,
    likesData,
    fetchLikes,
    addLike,
    getLikesCount,
    getUserHasLiked,
    isFavorited,
    isLikesLoading
  } = usePropertyEngagement()

  // Filter states - Initialize with URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '')
  const [selectedType, setSelectedType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [sortBy, setSortBy] = useState('price-high') // Default to highest price first

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const result = await response.json();
        setProperties(result.properties || []);
        
        // Fetch likes data for all properties
        if (result.properties?.length > 0) {
          result.properties.forEach((property: Property) => {
            fetchLikes(property.id);
          });
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      }
      setLoading(false);
    }
    fetchProperties();
  }, [fetchLikes]);

  // Smart price ranges based on listing type
  const getPriceRanges = () => {
    if (filterType === 'rent') {
      return [
        { label: 'Under GYD 50K', value: '0-50000' },
        { label: 'GYD 50K - 100K', value: '50000-100000' },
        { label: 'GYD 100K - 200K', value: '100000-200000' },
        { label: 'GYD 200K - 500K', value: '200000-500000' },
        { label: 'GYD 500K+', value: '500000-999999999' }
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
  };

  const formatPrice = (price: number, type?: string) => {
    const formatted = price.toLocaleString()
    return type === 'rent' ? `GYD ${formatted}/month` : `GYD ${formatted}`
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
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !selectedType || property.property_type === selectedType
    const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms)
    const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms)
    
    // Filter by listing type (sale/rent) based on page
    const listingType = property.listing_type || 'sale' // Default to sale if missing
    const matchesListingType = filterType === 'all' || 
      (filterType === 'sale' && listingType === 'sale') ||
      (filterType === 'rent' && listingType === 'rent')
    
    // Handle price range filtering
    let matchesPrice = true
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(p => parseInt(p))
      matchesPrice = property.price >= min && property.price <= max
    }

    return matchesSearch && matchesType && matchesBedrooms && matchesBathrooms && matchesPrice && matchesListingType
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Filter Bar - Zillow Style */}
        {showFilters && (
          <div className="bg-white p-4 shadow-sm rounded-lg mb-6 border">
            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4 flex-wrap">
              {/* Price Range */}
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">{filterType === 'rent' ? 'Monthly Rent' : 'Price Range'}</option>
                  {getPriceRanges().map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="relative">
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Beds</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div className="relative">
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Baths</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex-1 relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search location, title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedType || priceRange || bedrooms || bathrooms) && (
                <button
                  onClick={clearAllFilters}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFiltersModal(true)}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters & Sort
              </button>
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
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                      {property.price_type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </div>
                  {/* Improved Engagement Buttons - Better UX & Spacing */}
                  <div className="absolute top-2 right-2 flex flex-col gap-4 items-end">
                    {/* Anonymous Like Button - Clear & Prominent */}
                    <button 
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        
                        if (getUserHasLiked(property.id)) {
                          return; // Already liked
                        }
                        
                        const result = await addLike(property.id)
                        if (!result.success && result.error === 'Already liked this property today') {
                          // Show user-friendly message
                          alert('👍 Thanks! You already liked this property today')
                        }
                      }}
                      disabled={isLikesLoading(property.id) || getUserHasLiked(property.id)}
                      className={`px-3 py-2 min-w-[60px] sm:min-w-[70px] rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 text-sm font-bold touch-manipulation ${
                        getUserHasLiked(property.id)
                          ? 'bg-blue-500 text-white cursor-default transform scale-95'
                          : 'bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 hover:shadow-xl active:scale-95 active:bg-blue-100'
                      }`}
                      title={getUserHasLiked(property.id) ? '👍 You liked this!' : '👍 Like this property (no signup needed)'}
                    >
                      {isLikesLoading(property.id) ? (
                        <span className="animate-spin text-sm">⏳</span>
                      ) : (
                        <span className="text-sm">{getUserHasLiked(property.id) ? '👍' : '🤍'}</span>
                      )}
                      <span className="font-bold">{getLikesCount(property.id)}</span>
                      <span className="hidden sm:inline text-xs">{getUserHasLiked(property.id) ? 'Liked' : 'Like'}</span>
                    </button>

                    {/* Authenticated Save Button - Clear Distinction */}
                    <button 
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        
                        const result = await toggleFavorite({
                          id: property.id,
                          title: property.title,
                          price: property.price,
                          location: property.location || '',
                          property_type: property.property_type,
                          listing_type: property.listing_type || 'sale'
                        })
                        
                        if (!result.success && result.requiresAuth) {
                          // Better UX for login requirement
                          alert('🔐 Sign in to save properties and get price drop alerts!')
                        }
                      }}
                      className={`px-3 py-2 min-w-[60px] sm:min-w-[70px] rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 text-sm font-bold touch-manipulation ${
                        isFavorited(property.id)
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600 transform scale-95' 
                          : 'bg-white hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 hover:shadow-xl active:scale-95 active:bg-yellow-100'
                      }`}
                      title={
                        user 
                          ? (isFavorited(property.id) ? '💾 Remove from saved' : '💾 Save & get alerts') 
                          : '💾 Sign in to save & get price alerts'
                      }
                    >
                      <span className="text-sm">
                        {isFavorited(property.id) ? '💾' : '📌'}
                      </span>
                      <span className="hidden sm:inline text-xs">
                        {isFavorited(property.id) ? 'Saved' : 'Save'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Property Details */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {(() => {
                      const location = property.location as { city?: string; country?: string } | string | null;
                      return (
                        <span className="text-sm">
                          {location
                            ? typeof location === 'object'
                              ? `${location.city ?? ''}${location.city && location.country ? ', ' : ''}${location.country ?? ''}`
                              : location
                            : 'Location not specified'}
                        </span>
                      );
                    })()}
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
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(property.price, property.price_type)}
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



      {/* Mobile Filter Drawer */}
      {showFiltersModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFiltersModal(false)}
          />
          
          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
                <button 
                  onClick={() => setShowFiltersModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Filter Fields */}
              <div className="space-y-4">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filterType === 'rent' ? 'Monthly Rent (GYD)' : 'Price Range (GYD)'}
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => handlePriceRangeChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Prices</option>
                    {getPriceRanges().map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Beds/Baths */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
                
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                {(searchTerm || selectedType || priceRange || bedrooms || bathrooms) && (
                  <button 
                    onClick={clearAllFilters}
                    className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Reset
                  </button>
                )}
                <button 
                  onClick={() => setShowFiltersModal(false)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500"
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
