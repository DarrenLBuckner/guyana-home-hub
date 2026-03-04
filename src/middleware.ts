import { NextResponse, type NextRequest } from 'next/server'
import { get } from '@vercel/edge-config'

export const runtime = 'edge'

interface TerritoryData {
  status: 'active' | 'pending' | 'suspended' | 'terminated'
  display_name: string
  domain: string
  default_language: string
  flag_emoji?: string
  primary_color?: string
}

function getCountryCodeFromHostname(hostname: string): string {
  // Handle localhost and preview URLs - default to GY
  if (hostname.includes('localhost') || hostname.includes('.vercel.app')) {
    return 'GY'
  }

  // Extract country from pattern: {country}homehub.com
  const match = hostname.match(/^([a-z]+)homehub\./i)
  if (match) {
    const country = match[1].toUpperCase()
    const countryMap: Record<string, string> = {
      GUYANA: 'GY',
      JAMAICA: 'JM',
      COLOMBIA: 'CO',
      KENYA: 'KE',
      GHANA: 'GH',
      TRINIDAD: 'TT',
      BARBADOS: 'BB',
      BAHAMAS: 'BS',
    }
    return countryMap[country] || country.substring(0, 2)
  }

  // Default fallback
  return 'GY'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip routing for status pages and API routes to prevent rewrite loops
  if (
    pathname.startsWith('/coming-soon/') ||
    pathname.startsWith('/suspended/') ||
    pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  const hostname = request.nextUrl.hostname
  const countryCode = getCountryCodeFromHostname(hostname)
  console.log(`🌍 MIDDLEWARE: Detected ${countryCode} from ${hostname}`)

  // Look up territory in Edge Config
  let territory: TerritoryData | undefined
  try {
    territory = await get<TerritoryData>(countryCode)
  } catch (error) {
    // Fail open: if Edge Config is unavailable, allow request through
    console.error(`❌ MIDDLEWARE: Edge Config lookup failed for ${countryCode}:`, error)
    const response = NextResponse.next()
    response.cookies.set('country-code', countryCode, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
    return response
  }

  // Territory not found in Edge Config
  if (!territory) {
    console.log(`⛔ MIDDLEWARE: Territory ${countryCode} not configured`)
    return new NextResponse('Territory not configured', { status: 404 })
  }

  const { status } = territory
  console.log(`📊 MIDDLEWARE: Territory ${countryCode} status: ${status}`)

  // Status-based routing
  switch (status) {
    case 'active': {
      console.log(`→ MIDDLEWARE: Routing to active site for ${countryCode}`)
      const response = NextResponse.next()
      response.cookies.set('country-code', countryCode, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      response.cookies.set('territory-data', JSON.stringify(territory), {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      return response
    }

    case 'pending': {
      const destination = `/coming-soon/${countryCode.toLowerCase()}`
      console.log(`→ MIDDLEWARE: Routing to ${destination}`)
      return NextResponse.rewrite(new URL(destination, request.url))
    }

    case 'suspended': {
      const destination = `/suspended/${countryCode.toLowerCase()}`
      console.log(`→ MIDDLEWARE: Routing to ${destination}`)
      return NextResponse.rewrite(new URL(destination, request.url))
    }

    case 'terminated': {
      console.log(`→ MIDDLEWARE: Territory ${countryCode} terminated, returning 404`)
      return new NextResponse('Territory no longer available', { status: 404 })
    }

    default: {
      console.log(`→ MIDDLEWARE: Unknown status "${status}" for ${countryCode}, allowing through`)
      const response = NextResponse.next()
      response.cookies.set('country-code', countryCode, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      return response
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
}
