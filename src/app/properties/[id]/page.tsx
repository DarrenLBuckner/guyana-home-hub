import { Metadata } from 'next'
import PropertyDetailClient from './PropertyDetailClient'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location?: string | null
  city?: string
  region?: string
  neighborhood?: string
  bedrooms?: number
  bathrooms?: number
  listing_type?: 'sale' | 'rent'
  property_type?: string
  images?: string[]
  currency?: string
}

// Fetch property data for metadata generation
async function getProperty(id: string): Promise<Property | null> {
  try {
    const portalApiUrl = 'https://www.portalhomehub.com'
    const response = await fetch(`${portalApiUrl}/api/public/properties/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': 'guyana',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching property for metadata:', error)
    return null
  }
}

// Helper function to format price
function formatPrice(property: Property): string {
  const price = property.price?.toLocaleString() || 'Contact for price'
  const currency = property.currency || 'GYD'

  if (property.listing_type === 'rent') {
    return `${price} ${currency}/month`
  }
  return `${price} ${currency}`
}

// Helper function to build description
function buildDescription(property: Property): string {
  const parts = []

  // Listing type
  const listingType = property.listing_type === 'rent' ? 'For Rent' : 'For Sale'
  parts.push(listingType)

  // Property type
  if (property.property_type) {
    parts.push(property.property_type)
  }

  // Beds/Baths (if residential)
  if (property.bedrooms) {
    parts.push(`${property.bedrooms} bed`)
  }
  if (property.bathrooms) {
    parts.push(`${property.bathrooms} bath`)
  }

  // Location
  const location = [property.neighborhood, property.city, property.region]
    .filter(Boolean)
    .join(', ')
  if (location) {
    parts.push(`in ${location}`)
  }

  // Price
  parts.push(formatPrice(property))

  return parts.join(' | ')
}

// Generate dynamic metadata for Open Graph
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    return {
      title: 'Property Not Found | Guyana Home Hub',
      description: 'The property you are looking for could not be found.',
    }
  }

  const description = buildDescription(property)
  const ogImage = property.images?.[0] || '/images/default-property-og.jpg'

  return {
    title: `${property.title} | Guyana Home Hub`,
    description: description,
    openGraph: {
      title: property.title,
      description: description,
      url: `https://www.guyanahomehub.com/properties/${property.id}`,
      siteName: 'Guyana Home Hub',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: property.title,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: description,
      images: [ogImage],
    },
  }
}

// Server component that renders the client component
export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PropertyDetailClient propertyId={id} />
}
