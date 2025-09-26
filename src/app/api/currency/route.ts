import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_PORTAL_API_URL}/api/currency`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-site-id': 'guyana'
      },
      body: JSON.stringify({ ...body, site: 'guyana' })
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Currency proxy POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Currency conversion failed'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    searchParams.set('site', 'guyana');
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PORTAL_API_URL}/api/currency?${searchParams.toString()}`,
      {
        headers: {
          'x-site-id': 'guyana'
        }
      }
    );
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Currency proxy GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Currency data fetch failed'
    }, { status: 500 });
  }
}