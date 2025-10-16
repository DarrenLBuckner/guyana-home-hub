import { CountryCode } from './country-theme';

export async function getCountryFromHeaders(): Promise<CountryCode> {
  try {
    // This will be called server-side only, dynamic import to avoid client issues
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const countryCookie = cookieStore.get('country-code');
    
    if (countryCookie?.value === 'JM' || countryCookie?.value === 'GY') {
      console.log(`🍪 SERVER: Read country from cookie: ${countryCookie.value}`);
      return countryCookie.value as CountryCode;
    }
  } catch (error) {
    console.log('Could not read cookies, falling back to GY');
  }
  
  return 'GY'; // Default to Guyana
}

export function getCountryFromDomain(hostname: string): CountryCode {
  if (hostname.includes('jamaica')) {
    return 'JM';
  }
  
  return 'GY'; // Default to Guyana
}

// Client-side cookie reading function
export function getCountryFromCookies(): CountryCode {
  if (typeof window === 'undefined') return 'GY';
  
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('country-code='))
    ?.split('=')[1];
    
  if (cookieValue === 'JM' || cookieValue === 'GY') {
    console.log(`🍪 CLIENT: Read country from cookie: ${cookieValue}`);
    return cookieValue as CountryCode;
  }
  
  // Fallback to hostname detection
  const hostnameCountry = getCountryFromDomain(window.location.hostname);
  console.log(`🌐 CLIENT: Fallback to hostname detection: ${hostnameCountry}`);
  return hostnameCountry;
}