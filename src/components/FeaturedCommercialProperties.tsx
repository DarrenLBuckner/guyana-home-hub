'use client'

import { useState, useEffect } from 'react'
import { PropertyCard } from '@/components/PropertyCard'
import { useCountryTheme } from '@/components/CountryThemeProvider'
import { useRouter } from 'next/navigation'

interface FeaturedProperty {
  id: string
  title: string
  description: string
  price: number
  location: string
  property_type: string
  property_category: string
  listing_type: string
  status: string
  bedrooms: number
  bathrooms: number
  images: string[]
  views?: number
  created_at: string
  updated_at: string
  features?: any
  listed_by_type?: string
}

// Loading skeleton for property cards
function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  )
}

interface FeaturedCommercialPropertiesProps {
  countryName?: string
}

export default function FeaturedCommercialProperties({ countryName }: FeaturedCommercialPropertiesProps) {
  const [properties, setProperties] = useState<FeaturedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { country } = useCountryTheme()
  const router = useRouter()

  // Use provided countryName or derive from country code
  const displayCountryName = countryName || (country === 'JM' ? 'Jamaica' : 'Guyana')

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        setError(false)

        // Fetch commercial properties - filter by property_category = 'commercial'
        const response = await fetch('/api/properties?limit=9&category=commercial')

        if (!response.ok) {
          throw new Error('Failed to fetch commercial properties')
        }

        const data = await response.json()

        // Filter for valid commercial properties with required fields and at least one image
        const commercialPropertiesWithImages = (data.properties || [])
          .filter((p: FeaturedProperty) =>
            p &&
            p.id &&
            p.title &&
            p.price !== undefined &&
            p.images &&
            p.images.length > 0 &&
            p.property_category === 'commercial'
          )
          .slice(0, 3)

        setProperties(commercialPropertiesWithImages)
      } catch (err) {
        console.error('Error fetching featured commercial properties:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Show loading skeletons (brief loading state during fetch)
  if (loading) {
    return (
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Commercial Real Estate Opportunities
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Explore prime commercial properties, office spaces, and investment opportunities across {displayCountryName}.
          From retail locations to industrial facilities, find your next business opportunity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
      </section>
    )
  }

  // Hide section entirely if no properties or error (Phase 1 - limited inventory)
  if (error || properties.length === 0) {
    return null
  }

  // Render live commercial property cards with section heading
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Commercial Real Estate Opportunities
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Explore prime commercial properties, office spaces, and investment opportunities across {displayCountryName}.
        From retail locations to industrial facilities, find your next business opportunity.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {properties.map((property) => {
          if (!property) return null

          // Normalize property with defensive defaults
          const normalizedProperty = {
            ...property,
            bedrooms: property.bedrooms ?? 0,
            bathrooms: property.bathrooms ?? 0,
            description: property.description || '',
            location: property.location || 'Location not specified',
            features: property.features || {},
          }

          return (
            <PropertyCard
              key={property.id}
              property={normalizedProperty as any}
              variant="grid"
              showStats={false}
            />
          )
        })}
      </div>
      
      {/* Browse All Commercial Properties Button */}
      <button
        onClick={() => router.push('/properties/commercial')}
        className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
      >
        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3a1 1 0 00-1-1zM5 16a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        Browse All Commercial Properties
      </button>
    </section>
  )
}
