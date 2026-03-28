import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PropertyDetailClient from './PropertyDetailClient'
import Breadcrumbs from '@/components/Breadcrumbs'

const BASE_URL = 'https://www.guyanahomehub.com'
const PORTAL_API_URL = 'https://www.portalhomehub.com'

// UUID v4 pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface Property {
  id: string
  title: string
  description: string
  price: number
  slug?: string
  location?: string | null
  city?: string
  region?: string
  neighborhood?: string
  bedrooms?: number
  bathrooms?: number
  listing_type?: 'sale' | 'rent' | 'lease'
  property_type?: string
  images?: string[]
  property_media?: Array<{
    media_url: string
    display_order: number
    is_primary: boolean
  }>
  currency?: string
  latitude?: number | null
  longitude?: number | null
  house_size_value?: number
  house_size_unit?: string
  updated_at?: string
}

// Resolve the route parameter to a property ID and slug
async function resolveProperty(idOrSlug: string): Promise<{ id: string; slug: string | null } | null> {
  try {
    const supabase = await createClient()

    if (UUID_REGEX.test(idOrSlug)) {
      // It's a UUID - look up the slug for redirect
      const { data } = await supabase
        .from('properties')
        .select('id, slug')
        .eq('id', idOrSlug)
        .single()

      return data ? { id: data.id, slug: data.slug || null } : null
    } else {
      // It's a slug - look up the property ID
      const { data } = await supabase
        .from('properties')
        .select('id, slug')
        .eq('slug', idOrSlug)
        .single()

      return data ? { id: data.id, slug: data.slug || null } : null
    }
  } catch {
    return null
  }
}

// Fetch property data from Portal API
async function getProperty(id: string): Promise<Property | null> {
  try {
    const response = await fetch(`${PORTAL_API_URL}/api/public/properties/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': 'guyana',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

// Format listing type for display
function formatListingType(listingType?: string): string {
  switch (listingType) {
    case 'rent': return 'for Rent'
    case 'lease': return 'for Lease'
    default: return 'for Sale'
  }
}

// Build SEO-optimized title
function buildSeoTitle(property: Property): string {
  const parts: string[] = []

  if (property.bedrooms) {
    parts.push(`${property.bedrooms} Bedroom`)
  }

  if (property.property_type) {
    parts.push(property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1))
  }

  parts.push(formatListingType(property.listing_type))

  const location = property.neighborhood || property.city
  if (location) {
    parts.push(`in ${location}`)
  }

  return parts.join(' ')
}

// Build SEO-optimized description
function buildSeoDescription(property: Property): string {
  const parts: string[] = []

  const type = property.property_type
    ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)
    : 'Property'

  parts.push(`${type} ${formatListingType(property.listing_type)}`)

  const location = [property.neighborhood, property.city, 'Guyana'].filter(Boolean).join(', ')
  parts.push(`in ${location}`)

  if (property.bedrooms) parts.push(`${property.bedrooms} bedrooms`)
  if (property.bathrooms) parts.push(`${property.bathrooms} bathrooms`)
  if (property.house_size_value) {
    parts.push(`${property.house_size_value.toLocaleString()} sq ft`)
  }

  const currency = property.currency || 'GYD'
  if (property.price) {
    const symbol = currency === 'USD' ? 'US$' : 'G$'
    parts.push(`Price: ${symbol}${property.price.toLocaleString()}`)
  }

  parts.push('Verified listing on Guyana Home Hub.')

  return parts.join('. ')
}

// Resolve the best OG image as an absolute URL
function getOgImage(property: Property): string {
  // Priority: property_media (sorted by display_order) > images[0] > default
  const mediaUrl = property.property_media
    ?.sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return a.display_order - b.display_order
    })[0]?.media_url

  const raw = mediaUrl || property.images?.[0]
  if (!raw) return `${BASE_URL}/opengraph-image`

  // Ensure absolute URL — Supabase storage URLs are already absolute
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return `${BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`
}

// Build short social-card description: "For Sale in Georgetown · G$12,000,000"
function buildSocialDescription(property: Property): string {
  const parts: string[] = []

  const type = property.property_type
    ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) + ' '
    : ''
  parts.push(`${type}${formatListingType(property.listing_type)}`)

  const location = property.region || property.city
  if (location) parts.push(`in ${location}`)

  if (property.price) {
    const currency = property.currency || 'GYD'
    const symbol = currency === 'USD' ? 'US$' : 'G$'
    const suffix = property.listing_type === 'rent' || property.listing_type === 'lease' ? '/mo' : ''
    parts.push(`${symbol}${property.price.toLocaleString()}${suffix}`)
  }

  return parts.join(' · ')
}

// Generate dynamic metadata for SEO and social sharing
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: idOrSlug } = await params
  const resolved = await resolveProperty(idOrSlug)

  if (!resolved) {
    return {
      title: 'Property Not Found',
      description: 'The property you are looking for could not be found.',
    }
  }

  // If UUID with a slug, we'll redirect in the page component. Return minimal metadata.
  if (UUID_REGEX.test(idOrSlug) && resolved.slug) {
    return { title: 'Redirecting...' }
  }

  const property = await getProperty(resolved.id)

  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The property you are looking for could not be found.',
    }
  }

  const seoTitle = buildSeoTitle(property)
  const seoDescription = buildSeoDescription(property)
  const socialDescription = buildSocialDescription(property)
  const ogImage = getOgImage(property)
  const canonicalPath = `/properties/${resolved.slug || resolved.id}`

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: property.title,
      description: socialDescription,
      url: `${BASE_URL}${canonicalPath}`,
      siteName: 'Guyana Home Hub',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${property.title} - Property in ${property.city || 'Guyana'}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: socialDescription,
      images: [ogImage],
    },
  }
}

// Server component - handles slug routing, SSR, and structured data
export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idOrSlug } = await params
  const resolved = await resolveProperty(idOrSlug)

  // If UUID with a known slug, 308 permanent redirect to slug URL
  if (resolved && UUID_REGEX.test(idOrSlug) && resolved.slug) {
    permanentRedirect(`/properties/${resolved.slug}`)
  }

  // Fetch full property data server-side for SSR
  let initialData = null
  if (resolved) {
    initialData = await getProperty(resolved.id)
  }

  // Build breadcrumb data
  const listingTypeLabel = initialData?.listing_type === 'rent' ? 'Rent'
    : initialData?.listing_type === 'lease' ? 'Rent'
    : initialData?.property_type === 'commercial' ? 'Commercial'
    : 'Buy'

  const listingTypeHref = listingTypeLabel === 'Rent' ? '/properties/rent'
    : listingTypeLabel === 'Commercial' ? '/properties/commercial'
    : '/properties/buy'

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: listingTypeLabel, href: listingTypeHref },
    ...(initialData?.city ? [{ label: initialData.city }] : []),
    { label: initialData?.title || 'Property Details' },
  ]

  // Build JSON-LD structured data (rendered server-side so Google sees it)
  const propertySlugOrId = resolved?.slug || resolved?.id || idOrSlug
  const jsonLd = initialData ? buildPropertyJsonLd(initialData, propertySlugOrId, breadcrumbItems) : null

  return (
    <>
      {/* Server-rendered JSON-LD for Google */}
      {jsonLd && jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Visual breadcrumbs */}
      {initialData && (
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      )}

      {/* Client component with SSR data */}
      <PropertyDetailClient
        propertyId={resolved?.id || idOrSlug}
        initialData={initialData}
      />
    </>
  )
}

// Build combined JSON-LD schemas
function buildPropertyJsonLd(
  property: Property,
  slugOrId: string,
  breadcrumbItems: { label: string; href?: string }[]
) {
  const propertyUrl = `${BASE_URL}/properties/${slugOrId}`

  const listing: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": propertyUrl,
    "url": propertyUrl,
    "name": property.title,
    "description": property.description,
    "datePosted": property.updated_at || new Date().toISOString(),
  }

  if (property.images?.length) {
    listing.image = property.images
  }

  if (property.price) {
    listing.offers = {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency || "GYD",
      "availability": "https://schema.org/InStock",
    }
  }

  const addressParts: Record<string, string> = {
    "@type": "PostalAddress",
    "addressCountry": "Guyana",
  }
  if (property.neighborhood) addressParts.addressLocality = property.neighborhood
  if (property.city) addressParts.addressRegion = property.city
  listing.address = addressParts

  if (property.latitude && property.longitude) {
    listing.geo = {
      "@type": "GeoCoordinates",
      "latitude": property.latitude,
      "longitude": property.longitude,
    }
  }

  if (property.bedrooms) listing.numberOfBedrooms = property.bedrooms
  if (property.bathrooms) listing.numberOfBathroomsTotal = property.bathrooms
  if (property.house_size_value) {
    listing.floorSize = {
      "@type": "QuantitativeValue",
      "value": property.house_size_value,
      "unitText": property.house_size_unit || "square feet",
    }
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href ? { "item": `${BASE_URL}${item.href}` } : {}),
    })),
  }

  return [listing, breadcrumb]
}
