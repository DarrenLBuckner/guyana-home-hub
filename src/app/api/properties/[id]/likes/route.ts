import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    
    // Forward the request to Portal Hub with original headers
    const response = await fetch(`${portalApiUrl}/api/public/properties/${propertyId}/likes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward IP for rate limiting
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-real-ip': request.headers.get('x-real-ip') || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Proxy error in likes GET:', error)
    return NextResponse.json(
      { error: 'Failed to fetch likes', likes_count: 0, user_has_liked: false },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    
    // Forward the request to Portal Hub with original headers
    const response = await fetch(`${portalApiUrl}/api/public/properties/${propertyId}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward IP and user agent for rate limiting and tracking
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-real-ip': request.headers.get('x-real-ip') || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error('Proxy error in likes POST:', error)
    return NextResponse.json(
      { error: 'Failed to add like', likes_count: 0, user_has_liked: false },
      { status: 500 }
    )
  }
}