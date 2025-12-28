import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  resolveLocationAlias,
  getRegionDisplayMessage,
} from '@/lib/location-aliases'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// TODO: Portal API filtering is broken in production. This client-side filtering
// is a temporary Phase 1 solution. Before scaling past 100 properties, fix the
// Portal API's search/location parameters to filter server-side.
// See: Portal-home-hub/src/app/api/public/properties/route.ts

export async function GET(request: Request) {
  try {
    // Get country from cookies for site-specific filtering
    const cookieStore = cookies()
    const countryCode = cookieStore.get('country-code')?.value || 'GY'

    // Map country codes to site names
    const siteMapping = {
      'GY': 'guyana',
      'JM': 'jamaica'
    }
    const siteName = siteMapping[countryCode as keyof typeof siteMapping] || 'guyana'

    console.log(`🔍 Search API: Using site filter: ${siteName} (from country: ${countryCode})`)

    // Parse search query from URL
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get('q')?.trim() || ''

    if (!searchQuery) {
      return NextResponse.json({
        properties: [],
        total: 0,
        message: 'Please provide a search query'
      })
    }

    const searchLower = searchQuery.toLowerCase()
    console.log(`🔍 Searching for: "${searchQuery}"`)

    // Step 1: Check for location alias match
    const regionCode = resolveLocationAlias(searchQuery)
    let regionMessage: string | null = null

    if (regionCode) {
      console.log(`🔍 Location alias matched: "${searchQuery}" -> ${regionCode}`)
      regionMessage = getRegionDisplayMessage(regionCode, searchQuery)
    }

    // Step 2: Fetch ALL properties from Portal API (filtering is broken server-side)
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    const queryParams = new URLSearchParams()
    queryParams.set('site', siteName)
    queryParams.set('limit', '100') // Fetch all for client-side filtering

    console.log(`🔍 Fetching all properties from: ${portalApiUrl}/api/public/properties?${queryParams.toString()}`)

    const response = await fetch(`${portalApiUrl}/api/public/properties?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': siteName,
      },
    })

    if (!response.ok) {
      console.error('Backend request failed:', response.status, response.statusText)
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()
    const allProperties = data.properties || []

    console.log(`🔍 Fetched ${allProperties.length} total properties, now filtering...`)

    // Step 3: Client-side filtering
    let filteredProperties = []

    if (regionCode) {
      // Filter by region code match
      filteredProperties = allProperties.filter((p: any) => {
        const propRegion = (p.region || '').toLowerCase()
        const propCity = (p.city || '').toLowerCase()
        const propLocation = (p.location || '').toLowerCase()
        const regionLower = regionCode.toLowerCase()

        return propRegion === regionLower ||
               propCity === regionLower ||
               propLocation === regionLower
      })
      console.log(`🔍 Region filter (${regionCode}): ${filteredProperties.length} matches`)
    } else {
      // Text search across multiple fields
      filteredProperties = allProperties.filter((p: any) => {
        const title = (p.title || '').toLowerCase()
        const description = (p.description || '').toLowerCase()
        const location = (p.location || '').toLowerCase()
        const city = (p.city || '').toLowerCase()
        const neighborhood = (p.neighborhood || '').toLowerCase()
        const region = (p.region || '').toLowerCase()

        return title.includes(searchLower) ||
               description.includes(searchLower) ||
               location.includes(searchLower) ||
               city.includes(searchLower) ||
               neighborhood.includes(searchLower) ||
               region.includes(searchLower)
      })
      console.log(`🔍 Text search: ${filteredProperties.length} matches`)
    }

    // Step 4: Transform properties to match expected frontend format
    // Portal API returns flat structure, but PropertyCard expects nested features object
    const transformedProperties = filteredProperties.map((p: any) => ({
      ...p,
      features: {
        bedrooms: p.bedrooms ?? null,
        bathrooms: p.bathrooms ?? null,
        square_footage: p.square_footage ?? p.floor_size_sqft ?? null,
        lot_length: p.lot_length ?? null,
        lot_width: p.lot_width ?? null,
        lot_dimension_unit: p.lot_dimension_unit ?? 'ft',
        land_size_value: p.land_size_value ?? null,
        land_size_unit: p.land_size_unit ?? 'sq ft',
        parking_spaces: p.parking_spaces ?? null,
        year_built: p.year_built ?? null,
      }
    }))

    console.log(`🔍 Final result: ${transformedProperties.length} properties`)

    return NextResponse.json({
      properties: transformedProperties,
      total: transformedProperties.length,
      regionCode: regionCode,
      regionMessage: regionMessage,
      searchTerm: searchQuery
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      {
        error: 'Search temporarily unavailable',
        properties: [],
        total: 0,
        message: 'Please try again later or browse our featured properties.'
      },
      { status: 500 }
    )
  }
}
