'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentLogin() {
  const router = useRouter()
  
  // FIXED: Use same client creation method as upload page
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  // FIXED: Better auth state management
  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/agent/home')
      }
    }
    
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('Agent signed in:', session.user.email)
        router.push('/agent/home')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Agent Login
            </h1>
            <p className="text-gray-600">
              Sign in to manage your property listings
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { 
                  background: '#15803d',
                  color: 'white',
                },
                anchor: { 
                  color: '#15803d' 
                },
              }
            }}
            providers={['google', 'facebook']}
            magicLink={true}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign in as Agent',
                  loading_button_label: 'Signing in...',
                },
                sign_up: {
                  email_label: 'Email address', 
                  password_label: 'Create a password',
                  button_label: 'Create Agent Account',
                  loading_button_label: 'Creating account...',
                }
              }
            }}
          />

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Need agent access? 
              <a href="/contact" className="text-green-700 hover:underline ml-1">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}