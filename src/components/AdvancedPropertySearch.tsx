'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Sliders, X, Check } from 'lucide-react'

interface AdvancedSearchProps {
  onSearchAction: (filters: any) => void
  onResetAction: () => void
}

export default function AdvancedPropertySearch({ onSearchAction, onResetAction }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    // Location & Property Type
    region: '',
    location: '',
    propertyType: '',
    
    // Price Range
    minPrice: '',
    maxPrice: '',
    priceType: '',
    
    // Property Features
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    maxBathrooms: '',
    
    // Size
    minHomeSize: '',
    maxHomeSize: '',
    minLotSize: '',
    maxLotSize: '',
    
    // Amenities & Features
    amenities: [] as string[],
    features: [] as string[],
    
    // Advanced Options
    listingAge: '',
    priceReduction: false,
    openHouse: false,
    virtualTour: false,
    furnished: '',
    petPolicy: '',
    
    // Accessibility
    wheelchairAccessible: false,
    elevator: false,
    
    // Investment Properties
    rentalYield: '',
    cashFlow: '',
    
    // Commercial Properties
    zoning: '',
    buildingClass: '',
    
    // Proximity Features
    nearSchools: false,
    nearHospitals: false,
    nearShopping: false,
    nearTransport: false,
    nearBeach: false,
    
    // Utilities & Infrastructure
    electricity: '',
    water: '',
    internet: '',
    sewage: '',
    
    // Security
    gatedCommunity: false,
    securityGuard: false,
    cctv: false,
    
    // Environmental
    floodZone: '',
    solarPanels: false,
    energyRating: ''
  })

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

  const propertyTypes = [
    'House', 'Apartment', 'Villa', 'Townhouse', 'Condo', 'Land', 
    'Commercial', 'Office', 'Retail', 'Warehouse', 'Industrial',
    'Resort', 'Hotel', 'Farm', 'Ranch'
  ]

  const amenitiesList = [
    'Swimming Pool', 'Gym/Fitness Center', 'Tennis Court', 'Basketball Court',
    'Playground', 'Garden', 'Fruit Trees', 'Parking Garage', 'Covered Parking',
    'Air Conditioning', 'Central Heating', 'Fireplace', 'Balcony', 'Terrace',
    'Rooftop Access', 'Storage Room', 'Maid\'s Quarters', 'Guest House',
    'Home Office', 'Workshop', 'Wine Cellar', 'Spa/Jacuzzi', 'Sauna',
    'Generator', 'Solar Panels', 'Water Tank', 'Borehole/Well'
  ]

  const securityFeatures = [
    'Gated Community', 'Security Guard', 'CCTV Cameras', 'Alarm System',
    'Electric Fence', 'Access Control', 'Intercom System'
  ]

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleArrayFilter = (key: string, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key as keyof typeof prev] as string[]
      return {
        ...prev,
        [key]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      }
    })
  }

  const handleSearch = () => {
    onSearchAction(filters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setFilters({
      region: '', location: '', propertyType: '', minPrice: '', maxPrice: '', priceType: '',
      minBedrooms: '', maxBedrooms: '', minBathrooms: '', maxBathrooms: '',
      minHomeSize: '', maxHomeSize: '', minLotSize: '', maxLotSize: '',
      amenities: [], features: [], listingAge: '', priceReduction: false,
      openHouse: false, virtualTour: false, furnished: '', petPolicy: '',
      wheelchairAccessible: false, elevator: false, rentalYield: '', cashFlow: '',
      zoning: '', buildingClass: '', nearSchools: false, nearHospitals: false,
      nearShopping: false, nearTransport: false, nearBeach: false,
      electricity: '', water: '', internet: '', sewage: '', gatedCommunity: false,
      securityGuard: false, cctv: false, floodZone: '', solarPanels: false, energyRating: ''
    })
    onResetAction()
    setIsOpen(false)
  }

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'boolean') return value === true
      return value !== '' && value !== null && value !== undefined
    }).length
  }

  return (
    <>
      {/* Search Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        <Sliders className="h-4 w-4" />
        <span>Advanced Search</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-green-800 text-green-100 px-2 py-1 rounded-full text-xs">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Advanced Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Advanced Property Search</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Location & Property Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Property Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <select 
                      value={filters.region}
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Regions</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City/Area</label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="e.g. Georgetown, New Amsterdam"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select 
                      value={filters.propertyType}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (GYD)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="5,000,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      ~$24K USD (for reference)
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (GYD)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="100,000,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      ~$475K USD (for reference)
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                    <select 
                      value={filters.priceType}
                      onChange={(e) => handleFilterChange('priceType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Both Sale & Rent</option>
                      <option value="sale">For Sale Only</option>
                      <option value="rent">For Rent Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Bedrooms</label>
                    <select 
                      value={filters.minBedrooms}
                      onChange={(e) => handleFilterChange('minBedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Any</option>
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num}+ Bedrooms</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Bedrooms</label>
                    <select 
                      value={filters.maxBedrooms}
                      onChange={(e) => handleFilterChange('maxBedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Any</option>
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} Max</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Bathrooms</label>
                    <select 
                      value={filters.minBathrooms}
                      onChange={(e) => handleFilterChange('minBathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Any</option>
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}+ Bathrooms</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Bathrooms</label>
                    <select 
                      value={filters.maxBathrooms}
                      onChange={(e) => handleFilterChange('maxBathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Any</option>
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num} Max</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleArrayFilter('amenities', amenity)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Proximity Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { key: 'nearSchools', label: 'Near Schools' },
                    { key: 'nearHospitals', label: 'Near Hospitals' },
                    { key: 'nearShopping', label: 'Near Shopping' },
                    { key: 'nearTransport', label: 'Near Transport' },
                    { key: 'nearBeach', label: 'Near Beach' }
                  ].map(item => (
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters[item.key as keyof typeof filters] as boolean}
                        onChange={(e) => handleFilterChange(item.key, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Options</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'priceReduction', label: 'Price Reduced' },
                    { key: 'openHouse', label: 'Open House' },
                    { key: 'virtualTour', label: 'Virtual Tour' },
                    { key: 'wheelchairAccessible', label: 'Wheelchair Accessible' },
                    { key: 'gatedCommunity', label: 'Gated Community' },
                    { key: 'securityGuard', label: 'Security Guard' },
                    { key: 'solarPanels', label: 'Solar Panels' },
                    { key: 'cctv', label: 'CCTV Security' }
                  ].map(item => (
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters[item.key as keyof typeof filters] as boolean}
                        onChange={(e) => handleFilterChange(item.key, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Reset All
                </button>
                <span className="text-sm text-gray-500 flex items-center">
                  {getActiveFiltersCount()} filters active
                </span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
