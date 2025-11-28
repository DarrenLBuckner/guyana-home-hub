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
    
    // Use search parameter now that Portal API is fixed
    queryParams.set('search', searchQuery) // Full text search across title, description, location
    queryParams.set('limit', '20') // More results for search
    
    // Portal API's 'q' parameter handles all search intelligently - no need for complex mapping
    
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
    
    // Portal API's 'q' parameter already handles broad search - no manual fallback needed
    
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