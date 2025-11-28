'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Search } from 'lucide-react'

/** ---------- 1. Shape of a property card ---------- */
interface PropertyCard {
  id: string
  title: string
  price: number
  status: string
  images?: string[]
  hero_index?: number
  location?: string
  bedrooms?: number
  bathrooms?: number
  home_size?: string
  property_type?: string
  listing_type?: 'sale' | 'rent'
}

/** ---------- 2. Client component ---------- */
export default function SearchClient() {
  const params = useSearchParams()
  const q = params.get('q')?.trim() ?? ''

  const [results, setResults] = useState<PropertyCard[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [totalCount, setTotalCount] = useState<number>(0)

  useEffect(() => {
    // if no search term, clear results
    if (!q) {
      setResults([])
      setTotalCount(0)
      return
    }

    setLoading(true)
    setError('')
    
    fetch(`/api/properties/search?q=${encodeURIComponent(q)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        // Handle the response structure from our API
        if (data.properties) {
          setResults(data.properties)
          setTotalCount(data.total || data.properties.length)
        } else if (Array.isArray(data)) {
          // Fallback for direct array response
          setResults(data)
          setTotalCount(data.length)
        } else {
          setResults([])
          setTotalCount(0)
        }
        
        if (data.message && (!data.properties || data.properties.length === 0)) {
          setError(data.message)
        }
      })
      .catch((err) => {
        console.error('Search error:', err)
        setResults([])
        setTotalCount(0)
        setError('Search temporarily unavailable. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [q])

  if (!q) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Search Properties</h1>
          <p className="text-gray-600 mb-8">Enter a location, property type, or keyword to find your perfect home</p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {loading ? 'Searching...' : `Search results for "${q}"`}
        </h1>
        {!loading && totalCount > 0 && (
          <p className="text-gray-600">
            Found {totalCount} {totalCount === 1 ? 'property' : 'properties'}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
          ))}
        </div>
      )}

      {/* Error State - Improved UX */}
      {!loading && error && (
        <div className="text-center py-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-3">Search Temporarily Unavailable</h3>
            <p className="text-blue-700 mb-6">
              We're having trouble connecting to our property database right now. Please try again in a few moments.
            </p>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </button>
                <Link 
                  href="/properties"
                  className="inline-flex items-center px-6 py-3 border border-blue-300 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                >
                  Browse All Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results - Enhanced with Marketing Flow */}
      {!loading && !error && results.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-2xl mx-auto">
            {/* Icon and Main Message */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-full p-4">
                <MapPin className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No properties currently available in "{q}"
            </h3>
            
            <p className="text-lg text-gray-600 mb-8">
              But don't worry! We're constantly expanding our listings across Guyana. 
              <span className="font-semibold text-emerald-700"> Properties in this area will be available soon.</span>
            </p>
            
            {/* Primary CTA - List Your Property */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 mb-8">
              <h4 className="text-xl font-semibold text-emerald-800 mb-3">
                🏡 Do you own property in {q}?
              </h4>
              <p className="text-emerald-700 mb-4">
                Be the first to list in this area and capture all the interested buyers and renters!
              </p>
              <a
                href="https://portalhomehub.com/register/select-country"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                List Your Property (Free)
              </a>
            </div>
            
            {/* Secondary Options */}
            <div className="space-y-4">
              <p className="text-gray-600 font-medium">Or browse our current listings:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/properties/buy"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Browse Properties for Sale
                </Link>
                <Link 
                  href="/properties/rent"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Browse Properties for Rent
                </Link>
              </div>
              
              {/* Notification Signup */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Want to be notified when properties become available in {q}?
                </p>
                <Link 
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-emerald-300 text-sm font-medium rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  Get Email Alerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((property) => {
            // Fix image loading - use images array with hero_index or first image
            const imageUrl = property.images && property.images.length > 0 
              ? property.images[property.hero_index || 0] 
              : null
              
            // Fix currency formatting to match site (GYD instead of $)
            const priceFormatted = property.listing_type === 'rent' 
              ? `GYD ${property.price.toLocaleString()}/month` 
              : `GYD ${property.price.toLocaleString()}`
            
            return (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden cursor-pointer">
                  <div className="relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-48 object-cover transition-opacity duration-300"
                        loading="lazy"
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.opacity = '1'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          // Hide broken image and show placeholder
                          target.style.display = 'none'
                          const placeholder = target.nextElementSibling as HTMLElement
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                        style={{ opacity: 0 }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-48 bg-gray-200 flex items-center justify-center ${imageUrl ? 'hidden' : 'flex'}`}
                    >
                      <div className="text-center">
                        <div className="text-4xl text-gray-400 mb-2">🏠</div>
                        <p className="text-gray-500 text-sm">No image available</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.listing_type === 'rent' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    {property.location && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-green-600">
                        {priceFormatted}
                      </span>
                      {property.property_type && (
                        <span className="text-sm text-gray-500 capitalize">
                          {property.property_type}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm space-x-4">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms} bath</span>
                        </div>
                      )}
                      {property.home_size && (
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          <span>{property.home_size} sq ft</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Suggested Searches */}
      {!loading && results.length === 0 && !error && (
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {['Georgetown', 'Providence', 'Eccles', 'New Amsterdam', 'Diamond', 'Linden'].map((location) => (
              <Link 
                key={location}
                href={`/search?q=${encodeURIComponent(location)}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                {location}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}