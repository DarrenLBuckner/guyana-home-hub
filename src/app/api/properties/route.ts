import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Proxy request to backend portal
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    const response = await fetch(`${portalApiUrl}/api/public/properties`, {
      headers: {
        'Content-Type': 'application/json',
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