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
import { useFavorites } from '@/hooks/useFavorites'

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
  
  // Favorites hook
  const { favoriteStatus, toggleFavorite, user } = useFavorites()

  // Filter states - Initialize with URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

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
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      }
      setLoading(false);
    }
    fetchProperties();
  }, []);

  const regions = [
    'Region 1 (Barima-Waini)',
    'Region 2 (Pomeroon-Supenaam)',
    'Region 3 (Essequibo Islands-West Demerara)',
    'Region 4 (Demerara-Mahaica)',
    'Region 5 (Mahaica-Berbice)',
    'Region 6 (East Berbice-Corentyne)',
    'Region 7 (Cuyuni-Mazaruni)',
    'Region 8 (Potaro-Siparuni)',
    'Region 9 (Upper Takutu-Upper Essequibo)',
    'Region 10 (Upper Demerara-Berbice)'
  ]

  const formatPrice = (price: number, type?: string) => {
    const formatted = price.toLocaleString()
    return type === 'rent' ? `GYD ${formatted}/month` : `GYD ${formatted}`
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedRegion('')
    setSelectedType('')
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('')
    setBathrooms('')
    setSelectedFeatures([])
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = !selectedRegion || property.region === selectedRegion
    const matchesType = !selectedType || property.property_type === selectedType
    const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms)
    const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms)
    
    // Filter by listing type (sale/rent) based on page
    const listingType = property.listing_type || 'sale' // Default to sale if missing
    const matchesListingType = filterType === 'all' || 
      (filterType === 'sale' && listingType === 'sale') ||
      (filterType === 'rent' && listingType === 'rent')
    
    let matchesPrice = true
    if (minPrice && property.price < parseInt(minPrice)) matchesPrice = false
    if (maxPrice && property.price > parseInt(maxPrice)) matchesPrice = false

    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => 
        property.features && property.features.includes(feature)
      )

    return matchesSearch && matchesRegion && matchesType && matchesBedrooms && matchesBathrooms && matchesPrice && matchesFeatures && matchesListingType
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
            {showFilters && (
              <button
                onClick={() => setShowFiltersModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 flex items-center gap-2 lg:hidden"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Filters - Hidden on Mobile */}
        {showFilters && (
          <div className="hidden lg:block bg-gradient-to-r from-green-600 to-yellow-500 p-6 shadow-lg rounded-lg mb-8">
            {/* Main Search Bar */}
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  />
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Filter Dropdowns Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {/* Property Type Dropdown */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Min Price Dropdown */}
              <div className="relative">
                <select
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="">Min Price</option>
                  <option value="5000000">GYD 5M</option>
                  <option value="10000000">GYD 10M</option>
                  <option value="25000000">GYD 25M</option>
                  <option value="50000000">GYD 50M</option>
                  <option value="100000000">GYD 100M</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Max Price Dropdown */}
              <div className="relative">
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="">Max Price</option>
                  <option value="25000000">GYD 25M</option>
                  <option value="50000000">GYD 50M</option>
                  <option value="100000000">GYD 100M</option>
                  <option value="200000000">GYD 200M</option>
                  <option value="500000000">GYD 500M</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Bedrooms Dropdown */}
              <div className="relative">
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="">Bedrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Bathrooms Dropdown */}
              <div className="relative">
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="">Bathrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Region Dropdown */}
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Checkbox Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Features Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 text-lg">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Pet Friendly', 'Garden', 'Pool', 'Security Estate', 'AC', 'Security System', 'Fenced', 'Backup Generator', 'Garage', 'Furnished'].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2 text-white cursor-pointer hover:bg-white/10 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 text-lg">Other</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['WiFi', 'Cable TV', 'Kitchen Appliances', 'Washing Machine'].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2 text-white cursor-pointer hover:bg-white/10 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedFeatures.length > 0 || searchTerm || selectedRegion || selectedType || minPrice || maxPrice || bedrooms || bathrooms) && (
              <div className="mt-6 text-center">
                <button
                  onClick={clearAllFilters}
                  className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Clear All Filters ({selectedFeatures.length + (searchTerm ? 1 : 0) + (selectedRegion ? 1 : 0) + (selectedType ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (bedrooms ? 1 : 0) + (bathrooms ? 1 : 0)})
                </button>
              </div>
            )}
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
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavorite({
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        location: property.location || '',
                        property_type: property.property_type,
                        listing_type: property.listing_type || 'sale'
                      })
                    }}
                    className={`absolute top-2 right-2 p-1 rounded-full shadow transition-colors ${
                      favoriteStatus[property.id] 
                        ? 'bg-red-100 hover:bg-red-200' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    title={favoriteStatus[property.id] ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-colors ${
                        favoriteStatus[property.id] 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </button>
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
                    {filterType === 'rent' ? 'Monthly Rent (GYD)' : 'Price (GYD)'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Min Price</option>
                      <option value="5000000">GYD 5M</option>
                      <option value="10000000">GYD 10M</option>
                      <option value="25000000">GYD 25M</option>
                      <option value="50000000">GYD 50M</option>
                      <option value="100000000">GYD 100M</option>
                    </select>
                    <select
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Max Price</option>
                      <option value="25000000">GYD 25M</option>
                      <option value="50000000">GYD 50M</option>
                      <option value="100000000">GYD 100M</option>
                      <option value="200000000">GYD 200M</option>
                      <option value="500000000">GYD 500M</option>
                    </select>
                  </div>
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

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                
                {/* Advanced Filters - Collapsible */}
                <details className="border-t pt-4">
                  <summary className="font-medium cursor-pointer text-green-600 hover:text-green-700">
                    + More Filters
                  </summary>
                  <div className="mt-4 space-y-3">
                    {['Pet Friendly', 'Garden', 'Pool', 'Security Estate', 'AC', 'Security System', 'Fenced', 'Backup Generator', 'Garage', 'Furnished', 'WiFi', 'Cable TV', 'Kitchen Appliances', 'Washing Machine'].map((feature) => (
                      <label key={feature} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFeatures.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </details>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                {(selectedFeatures.length > 0 || searchTerm || selectedRegion || selectedType || minPrice || maxPrice || bedrooms || bathrooms) && (
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
