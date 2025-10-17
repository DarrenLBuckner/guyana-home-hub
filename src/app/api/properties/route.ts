import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get country from cookies
    const cookieStore = await cookies()
    const countryCode = cookieStore.get('country-code')?.value || 'GY'
    
    // Map country codes to site names
    const siteMapping = {
      'GY': 'guyana',
      'JM': 'jamaica'
    }
    const siteName = siteMapping[countryCode as keyof typeof siteMapping] || 'guyana'
    
    console.log(`🌍 API: Using site filter: ${siteName} (from country: ${countryCode})`)
    
    // Proxy request to backend portal with dynamic site filtering
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    const url = new URL(request.url)
    const queryParams = new URLSearchParams(url.search)
    
    // Include dynamic site filter based on detected country
    queryParams.set('site', siteName)
    
    const response = await fetch(`${portalApiUrl}/api/public/properties?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': siteName,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from backend')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties', properties: [], total: 0 },
      { status: 500 }
    )
  }
}