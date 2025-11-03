import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get country from cookies for site-specific filtering
    const cookieStore = await cookies()
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
    
    // Proxy request to backend portal with search parameters
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    const queryParams = new URLSearchParams()
    
    // Set site filter
    queryParams.set('site', siteName)
    
    // Add comprehensive search parameters
    queryParams.set('search', searchQuery)
    queryParams.set('location', searchQuery) // Also search in location field
    queryParams.set('limit', '20') // More results for search
    
    // Special handling for known Guyanese locations
    const guyanLocations = {
      'diamond': 'Diamond, East Bank Demerara',
      'georgetown': 'Georgetown',
      'providence': 'Providence, East Bank Demerara', 
      'eccles': 'Eccles, East Bank Demerara',
      'new amsterdam': 'New Amsterdam, Region 6',
      'linden': 'Linden, Region 10',
      'anna regina': 'Anna Regina, Region 2',
      'berbice': 'Berbice, Region 6',
      'demerara': 'Demerara',
      'essequibo': 'Essequibo'
    }
    
    // Check if search query matches a known location
    const searchLower = searchQuery.toLowerCase()
    if (guyanLocations[searchLower as keyof typeof guyanLocations]) {
      queryParams.set('location_exact', guyanLocations[searchLower as keyof typeof guyanLocations])
    }
    
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
    
    // If no results from exact search, try broader search
    if ((!data.properties || data.properties.length === 0) && searchQuery.length > 3) {
      console.log('🔍 No exact matches, trying broader search...')
      
      // Try property type search
      const propertyTypes = ['house', 'apartment', 'land', 'villa', 'commercial', 'townhouse', 'condo']
      const matchedType = propertyTypes.find(type => searchLower.includes(type))
      
      if (matchedType) {
        queryParams.set('property_type', matchedType)
        queryParams.delete('location_exact')
        
        const broaderResponse = await fetch(`${portalApiUrl}/api/public/properties?${queryParams.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-site-id': siteName,
            'x-search-query': searchQuery
          },
        })
        
        if (broaderResponse.ok) {
          const broaderData = await broaderResponse.json()
          if (broaderData.properties && broaderData.properties.length > 0) {
            console.log(`🔍 Broader search found: ${broaderData.properties.length} properties`)
            return NextResponse.json(broaderData)
          }
        }
      }
    }
    
    return NextResponse.json(data)
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