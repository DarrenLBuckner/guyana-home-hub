import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Get country from cookies
    const cookieStore = await cookies()
    const countryCode = cookieStore.get('country-code')?.value || 'GY'
    const siteMapping = { 'GY': 'guyana', 'JM': 'jamaica' }
    const siteName = siteMapping[countryCode as keyof typeof siteMapping] || 'guyana'
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_PORTAL_API_URL}/api/currency`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-site-id': siteName
      },
      body: JSON.stringify({ ...body, site: siteName })
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
    // Get country from cookies  
    const cookieStore = await cookies()
    const countryCode = cookieStore.get('country-code')?.value || 'GY'
    const siteMapping = { 'GY': 'guyana', 'JM': 'jamaica' }
    const siteName = siteMapping[countryCode as keyof typeof siteMapping] || 'guyana'
    
    const { searchParams } = new URL(req.url);
    searchParams.set('site', siteName);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PORTAL_API_URL}/api/currency?${searchParams.toString()}`,
      {
        headers: {
          'x-site-id': siteName
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