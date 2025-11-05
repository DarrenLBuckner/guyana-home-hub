import { NextRequest, NextResponse } from 'next/server'

const PORTAL_HUB_URL = process.env.NEXT_PUBLIC_PORTAL_HUB_URL || 'http://localhost:3002'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    const url = `${PORTAL_HUB_URL}/api/public/properties/${propertyId}/likes`
    
    console.log(`🔄 Proxying likes GET request to: ${url}`)
    
    // Forward the request to Portal Home Hub
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-real-ip': request.headers.get('x-real-ip') || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
    })

    const data = await response.json()
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Error proxying likes GET:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch likes',
      likes_count: 0,
      user_has_liked: false 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    const url = `${PORTAL_HUB_URL}/api/public/properties/${propertyId}/likes`
    
    console.log(`🔄 Proxying likes POST request to: ${url}`)
    
    // Forward the request to Portal Home Hub
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-real-ip': request.headers.get('x-real-ip') || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
    })

    const data = await response.json()
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Error proxying likes POST:', error)
    return NextResponse.json({ 
      error: 'Failed to add like',
      likes_count: 0,
      user_has_liked: false 
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}