import { NextResponse, type NextRequest } from 'next/server'

// Country detection helper
function getCountryFromHost(hostname: string): 'GY' | 'JM' {
  console.log(`🌍 MIDDLEWARE: Checking hostname: ${hostname}`);
  
  // Check for Jamaica domains
  if (hostname.includes('jamaicahomehub') || 
      hostname.includes('jamaica') || 
      hostname.includes('jm') ||
      hostname.startsWith('jamaicahomehub')) {
    console.log(`🇯🇲 MIDDLEWARE: Jamaica domain detected!`);
    return 'JM';
  }
  
  console.log(`🇬🇾 MIDDLEWARE: Defaulting to Guyana`);
  return 'GY'; // Default to Guyana
}

export async function middleware(request: NextRequest) {
  // Detect country from hostname
  const country = getCountryFromHost(request.nextUrl.hostname);
  console.log(`🌍 MIDDLEWARE: Detected country: ${country} from hostname: ${request.nextUrl.hostname}`);

  const response = NextResponse.next();

  // Set country cookie for both server and client access
  response.cookies.set('country-code', country, {
    httpOnly: false, // Allow client-side access
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });

  console.log(`🍪 MIDDLEWARE: Set country-code cookie to: ${country}`);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
}