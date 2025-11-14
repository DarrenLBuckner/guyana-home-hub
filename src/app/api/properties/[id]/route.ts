import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const portalApiUrl = 'https://www.portalhomehub.com'
    const fullUrl = `${portalApiUrl}/api/public/properties/${id}`
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': 'guyana',
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