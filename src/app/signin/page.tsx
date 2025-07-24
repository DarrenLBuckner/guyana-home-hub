'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export default function CustomerSignIn() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Listen for all auth events (including OAuth)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // whenever someone signs in (email, magic link or OAuth),
        // immediately redirect them to the onboarding/profile page
        router.push('/onboard/profile')
      }
    })

    // Cleanup our listener on unmount
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router, supabase])

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
          // note: redirectTo only works for magic links; our listener will handle OAuth
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
