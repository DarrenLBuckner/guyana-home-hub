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

// Static fallback cards (original design)
function StaticFallbackCards({ country }: { country: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src="/images/hero-house-desktop.jpg"
          alt="Georgetown Villa"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800">
            {country === 'JM' ? 'Kingston Properties' : 'Georgetown Luxury Homes'}
          </h3>
          <p className="text-gray-600">
            {country === 'JM'
              ? 'Capital city homes and apartments for locals'
              : 'Prime locations in the capital city'
            }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src="/images/villa-beachfront.jpg"
          alt="Beachfront Property"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800">
            {country === 'JM' ? 'Family Homes' : 'Coastal Properties'}
          </h3>
          <p className="text-gray-600">
            {country === 'JM'
              ? 'Quality homes for Jamaican families'
              : 'Stunning beachfront and waterfront homes'
            }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src="/images/land-berbice.jpg"
          alt="Development Land"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800">
            {country === 'JM' ? 'Affordable Housing' : 'Investment Opportunities'}
          </h3>
          <p className="text-gray-600">
            {country === 'JM'
              ? 'Budget-friendly options for first-time buyers'
              : 'Prime land for development projects'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<FeaturedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { country } = useCountryTheme()

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

        // Filter for properties with at least one image, take first 3
        const propertiesWithImages = (data.properties || [])
          .filter((p: FeaturedProperty) => p.images && p.images.length > 0)
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

  // Show loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </div>
    )
  }

  // Fallback to static cards if error or fewer than 3 properties with images
  if (error || properties.length < 3) {
    return <StaticFallbackCards country={country} />
  }

  // Render live property cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property as any}
          variant="grid"
          showStats={false}
        />
      ))}
    </div>
  )
}
