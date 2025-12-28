import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  resolveLocationAlias,
  getRegionDisplayMessage,
  getRegionDisplayName,
  findMatchingRegions
} from '@/lib/location-aliases'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

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

    console.log(`🔍 Searching for: "${searchQuery}"`)

    // Step 1: Check for location alias match
    const regionCode = resolveLocationAlias(searchQuery)
    let regionMessage: string | null = null

    if (regionCode) {
      console.log(`🔍 Location alias matched: "${searchQuery}" -> ${regionCode}`)
      regionMessage = getRegionDisplayMessage(regionCode, searchQuery)
    } else {
      // Try partial matching for autocomplete-style searches
      const partialMatches = findMatchingRegions(searchQuery)
      if (partialMatches.length > 0) {
        console.log(`🔍 Partial location matches found: ${partialMatches.join(', ')}`)
      }
    }

    // Proxy request to backend portal with search parameters
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    const queryParams = new URLSearchParams()

    // Set site filter
    queryParams.set('site', siteName)

    // If we have a region code match, search by region AND the original search term
    // This ensures we find properties in that region even if they don't have the exact text
    if (regionCode) {
      // Search by region code for exact region match
      queryParams.set('region', regionCode)
      // Also include text search for broader matching
      queryParams.set('search', searchQuery)
    } else {
      // No alias match - do full text search across all fields
      queryParams.set('search', searchQuery)
    }

    queryParams.set('limit', '20') // More results for search

    console.log(`🔍 Fetching from: ${portalApiUrl}/api/public/properties?${queryParams.toString()}`)

    const response = await fetch(`${portalApiUrl}/api/public/properties?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': siteName,
        'x-search-query': searchQuery
      },
    })

    if (!response.ok) {
      console.error('Backend search request failed:', response.status, response.statusText)
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()

    // Log search results for debugging
    console.log(`🔍 Search results: ${data.properties?.length || 0} properties found`)

    // If region search returned no results, try text-only search as fallback
    if (regionCode && (!data.properties || data.properties.length === 0)) {
      console.log(`🔍 Region search returned 0 results, trying text-only fallback...`)

      const fallbackParams = new URLSearchParams()
      fallbackParams.set('site', siteName)
      fallbackParams.set('search', searchQuery)
      fallbackParams.set('limit', '20')

      const fallbackResponse = await fetch(
        `${portalApiUrl}/api/public/properties?${fallbackParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-site-id': siteName,
            'x-search-query': searchQuery
          },
        }
      )

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json()
        if (fallbackData.properties?.length > 0) {
          console.log(`🔍 Fallback search found ${fallbackData.properties.length} results`)
          return NextResponse.json({
            ...fallbackData,
            regionCode: regionCode,
            regionMessage: regionMessage,
            searchTerm: searchQuery
          })
        }
      }
    }

    // Return results with region messaging
    return NextResponse.json({
      ...data,
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