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

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Search Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Link 
              href="/properties"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Browse All Properties
            </Link>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any properties matching "{q}". Try searching with different keywords or browse our available properties.
          </p>
          <div className="space-x-4">
            <Link 
              href="/properties/buy"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Browse Properties for Sale
            </Link>
            <Link 
              href="/properties/rent"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Browse Properties for Rent
            </Link>
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