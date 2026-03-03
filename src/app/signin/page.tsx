'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [origin, setOrigin] = useState('')

  const returnTo = searchParams.get('returnTo')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session exists:', !!session)

      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, redirecting to profile page')
        router.push('/onboard/profile')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router, supabase])

  // Build callback URL, preserving returnTo if present
  const callbackUrl = origin
    ? returnTo
      ? `${origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`
      : `${origin}/auth/callback`
    : '/auth/callback'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4 text-green-700">
        Sign In to Guyana Home Hub
      </h2>
      <p className="mb-6 text-gray-600 text-center">
        Use Google, Facebook, or email to access listings and save properties.
      </p>

      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'facebook']}
          magicLink={true}
          redirectTo={callbackUrl}
        />
      </div>

      {/* Agent Login Link */}
      <div className="mt-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
          <p className="text-sm text-green-800 mb-2">
            <strong>Are you a Property Agent?</strong>
          </p>
          <a
            href="/agent-login"
            className="text-green-700 hover:text-green-800 font-medium underline"
          >
            Click here for Agent Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CustomerSignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
