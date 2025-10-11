import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Proxy request to backend portal with site filtering for Guyana
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    const url = new URL(request.url)
    const queryParams = new URLSearchParams(url.search)
    
    // Always include site=guyana filter
    queryParams.set('site', 'guyana')
    
    const response = await fetch(`${portalApiUrl}/api/public/properties?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': 'guyana',
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