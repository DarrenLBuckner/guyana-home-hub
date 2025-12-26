'use client'

import { useState, useEffect } from 'react'
import { PropertyCard } from '@/components/PropertyCard'
import { useCountryTheme } from '@/components/CountryThemeProvider'

interface FeaturedProperty {
  id: string
  title: string
  description: string
  price: number
  location: string
  property_type: string
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

interface FeaturedPropertiesProps {
  countryName?: string
}

export default function FeaturedProperties({ countryName }: FeaturedPropertiesProps) {
  const [properties, setProperties] = useState<FeaturedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { country } = useCountryTheme()

  // Use provided countryName or derive from country code
  const displayCountryName = countryName || (country === 'JM' ? 'Jamaica' : 'Guyana')

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        setError(false)

        // Fetch 6 properties to ensure we get at least 3 with images
        const response = await fetch('/api/properties?limit=6')

        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }

        const data = await response.json()

        // Filter for valid properties with required fields and at least one image
        const propertiesWithImages = (data.properties || [])
          .filter((p: FeaturedProperty) =>
            p &&
            p.id &&
            p.title &&
            p.price !== undefined &&
            p.images &&
            p.images.length > 0
          )
          .slice(0, 3)

        setProperties(propertiesWithImages)
      } catch (err) {
        console.error('Error fetching featured properties:', err)
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
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Discover Beautiful Properties Across {displayCountryName}
        </h2>
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

  // Render live property cards with section heading
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Discover Beautiful Properties Across {displayCountryName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </section>
  )
}
