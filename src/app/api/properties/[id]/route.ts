import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Proxy request to backend portal
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
    const response = await fetch(`${portalApiUrl}/api/public/properties/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Property not found')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Property not found' },
      { status: 404 }
    )
  }
}