'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
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
import ContactAgent from '@/components/ContactAgent'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  region?: string
  property_type: string
  price_type?: string
  bedrooms: number
  bathrooms: number
  home_size?: string
  lot_size?: string | null
  features?: string[]
  image_urls?: string[]
  hero_index?: number
  status: string
  user_id: string
  created_at: string
}

interface PropertiesListingProps {
  title: string
  filterType?: 'sale' | 'rent' | 'all'
  showFilters?: boolean
}

export default function PropertiesListing({ 
  title, 
  filterType = 'all', 
  showFilters = true 
}: PropertiesListingProps) {
  const supabase = createClientComponentClient()
  
  // Mock data for testing - replace with database when fixed
  const mockProperties: Property[] = [
    {
      id: 'mock-1',
      title: 'Luxury Villa with Pool and Garden',
      description: 'Beautiful 4-bedroom villa with swimming pool, garden, and security system',
      price: 150000000,
      location: 'Bel Air Park, Georgetown',
      region: 'Region 4 (Demerara-Mahaica)',
      property_type: 'house',
      price_type: 'sale',
      bedrooms: 4,
      bathrooms: 3,
      home_size: '3500',
      lot_size: '8000',
      features: ['Pool', 'Garden', 'Security Estate', 'AC', 'Security System', 'Fenced', 'Backup Generator'],
      image_urls: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      hero_index: 0,
      status: 'approved',
      user_id: 'test-user-1',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'mock-2',
      title: 'Pet-Friendly Family Home with Fruit Trees',
      description: 'Charming 3-bedroom home with mature fruit trees and pet-friendly features',
      price: 85000000,
      location: 'Diamond, East Bank Demerara',
      region: 'Region 4 (Demerara-Mahaica)',
      property_type: 'house',
      price_type: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      home_size: '2200',
      lot_size: '12000',
      features: ['Pet Friendly', 'Garden', 'AC', 'Fenced', 'Backup Generator'],
      image_urls: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      hero_index: 0,
      status: 'approved',
      user_id: 'test-user-2',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'mock-3',
      title: 'Modern Townhouse in Security Estate',
      description: 'Brand new 3-bedroom townhouse in gated community with pool and gym',
      price: 95000000,
      location: 'Turkeyen, Greater Georgetown',
      region: 'Region 4 (Demerara-Mahaica)',
      property_type: 'house',
      price_type: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      home_size: '1800',
      lot_size: '2500',
      features: ['Security Estate', 'AC', 'Pool', 'Garage', 'Security System'],
      image_urls: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      hero_index: 0,
      status: 'approved',
      user_id: 'test-user-3',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'mock-4',
      title: 'Apartment with WiFi and Cable TV',
      description: 'Modern 1-bedroom apartment with all amenities and balcony',
      price: 45000000,
      location: 'Camp Street, Georgetown',
      region: 'Region 4 (Demerara-Mahaica)',
      property_type: 'apartment',
      price_type: 'sale',
      bedrooms: 1,
      bathrooms: 1,
      home_size: '800',
      lot_size: null,
      features: ['Furnished', 'WiFi', 'Cable TV', 'AC', 'Backup Generator'],
      image_urls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      hero_index: 0,
      status: 'approved',
      user_id: 'test-user-4',
      created_at: '2024-01-01T00:00:00Z'
    }
  ]

  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

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
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = !selectedRegion || property.region === selectedRegion
    const matchesType = !selectedType || property.property_type === selectedType
    const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms)
    const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms)
    
    let matchesPrice = true
    if (minPrice && property.price < parseInt(minPrice)) matchesPrice = false
    if (maxPrice && property.price > parseInt(maxPrice)) matchesPrice = false

    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => 
        property.features && property.features.includes(feature)
      )

    return matchesSearch && matchesRegion && matchesType && matchesBedrooms && matchesBathrooms && matchesPrice && matchesFeatures
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">{title}</h1>
          <p className="text-gray-600">{filteredProperties.length} properties found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property24-style Filters */}
        {showFilters && (
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-6 shadow-lg rounded-lg mb-8">
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
                  {property.image_urls && property.image_urls.length > 0 ? (
                    <img
                      src={property.image_urls[property.hero_index || 0] || property.image_urls[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                      {property.price_type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </div>
                  <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Property Details */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProperty(property)
                          setShowContactModal(true)
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium transition-colors"
                      >
                        Contact Agent
                      </button>
                      <Link 
                        href={`/properties/${property.id}`}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm font-medium transition-colors"
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

      {/* Contact Agent Modal */}
      {showContactModal && selectedProperty && (
        <ContactAgent 
          property={{
            id: selectedProperty.id,
            title: selectedProperty.title,
            location: selectedProperty.location,
            price: selectedProperty.price,
          }}
          isModal={true}
          onCloseAction={() => {
            setShowContactModal(false)
            setSelectedProperty(null)
          }}
        />
      )}
    </div>
  )
}
