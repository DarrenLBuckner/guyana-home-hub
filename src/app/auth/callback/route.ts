import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Sanitize return URL to prevent open redirect attacks.
 * Only allows internal paths starting with /.
 */
function sanitizeReturnUrl(url: string | null): string | null {
  if (!url) return null
  // Must start with / (internal path)
  if (!url.startsWith('/')) return null
  // Block protocol-relative URLs
  if (url.startsWith('//')) return null
  // Block paths that could cause redirect loops
  const blocked = ['/auth/', '/signin', '/onboard', '/admin-login', '/agent-login']
  if (blocked.some((b) => url.startsWith(b))) return null
  return url
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const returnTo = requestUrl.searchParams.get('returnTo')

  // 🎯 CRITICAL: Get the origin domain from the request
  const origin = requestUrl.origin // This preserves the domain!

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/signin?error=auth_failed`)
    }

    // Check if user came from agent login by checking the referrer or state
    const referrer = request.headers.get('referer') || ''
    const isAgentLogin = referrer.includes('/agent-login')

    // 🔥 CRITICAL: Redirect to the SAME domain, not hardcoded domain
    // This ensures Jamaica users stay on jamaicahomehub.com
    // and Guyana users stay on guyanahomehub.com
    if (isAgentLogin) {
      return NextResponse.redirect(`${origin}/agent/home`)
    }

    // For returning users with a completed profile, redirect to where they were
    const sanitizedReturnTo = sanitizeReturnUrl(returnTo)
    if (sanitizedReturnTo) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .single()

        if (profile?.first_name && profile?.last_name && profile?.phone) {
          return NextResponse.redirect(`${origin}${sanitizedReturnTo}`)
        }
      }
    }

    // Default: new user or no return URL -> onboarding
    return NextResponse.redirect(`${origin}/onboard/profile`)
  }

  // No code parameter, redirect to signin
  return NextResponse.redirect(`${origin}/signin`)
}
