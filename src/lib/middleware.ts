import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()
  const supabase = await createClient()

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protected routes
    const protectedPaths = ['/admin', '/agent']
    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedPath && !session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Role-based access
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single()

      if (request.nextUrl.pathname.startsWith('/admin') && profile?.user_type !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      if (request.nextUrl.pathname.startsWith('/agent') && profile?.user_type !== 'agent') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*', '/agent/:path*']
}