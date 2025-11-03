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
  hero_image?: string
  image_urls?: string[]
  location?: string
  bedrooms?: number
  bathrooms?: number
  property_size?: number
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
    <div className="px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Search results for “{q}”
      </h1>

      {loading && <p>Loading…</p>}
      {!loading && results.length === 0 && <p>No listings found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((p) => {
          // pick hero_image if set, otherwise first image_urls entry
          const imageUrl = p.hero_image || p.image_urls?.[0] || ''
          return (
            <div key={p.id} className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-medium mb-1">{p.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                ${p.price.toLocaleString()}
              </p>

              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
