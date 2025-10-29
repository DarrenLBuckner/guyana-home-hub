import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
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
    } else {
      return NextResponse.redirect(`${origin}/onboard/profile`)
    }
  }

  // No code parameter, redirect to signin
  return NextResponse.redirect(`${origin}/signin`)
}