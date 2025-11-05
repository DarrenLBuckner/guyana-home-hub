import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get country from cookies
    const cookieStore = await cookies()
    const countryCode = cookieStore.get('country-code')?.value || 'GY'
    
    console.log(`🌍 Services API: Using country: ${countryCode}`)
    
    // Proxy request to backend portal
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    const url = new URL(request.url)
    const queryParams = new URLSearchParams(url.search)
    
    const response = await fetch(`${portalApiUrl}/api/public/services/${countryCode}?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch from backend: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Services proxy error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch services',
        countryCode: 'GY',
        countryName: 'Guyana', 
        services: [], 
        servicesByCategory: {},
        packages: [],
        featuredPackage: null
      },
      { status: 500 }
    )
  }
}