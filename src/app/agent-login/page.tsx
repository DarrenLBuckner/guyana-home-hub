'use client'

console.log('AGENT LOGIN PAGE LOADED - REACT COMPONENT EXECUTING')

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentLogin() {
  console.log('INSIDE AGENT LOGIN COMPONENT')
  
  const router = useRouter()
  
  // FIXED: Use same client creation method as upload page
  const [supabase] = useState(() => {
    console.log('CREATING SUPABASE CLIENT')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING')
    
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  })

  // FIXED: Better auth state management
 useEffect(() => {
  console.log('USEEFFECT STARTING - Setting up auth handlers')
  
  // MANUALLY CHECK FOR AUTH CODE IN URL FIRST
  const urlParams = new URLSearchParams(window.location.search)
  const authCode = urlParams.get('code')
  if (authCode) {
    console.log('AUTH CODE FOUND IN URL:', authCode)
    console.log('PROCESSING AUTH CODE...')
    
    // Let Supabase process the auth code
    supabase.auth.exchangeCodeForSession(authCode).then(({ data, error }) => {
      console.log('CODE EXCHANGE RESULT:', data ? 'SUCCESS' : 'FAILED')
      if (error) {
        console.error('CODE EXCHANGE ERROR:', error)
      } else {
        console.log('SESSION CREATED, REDIRECTING...')
        router.push('/agent/home')
      }
    })
    return // Exit early if processing auth code
  }
  
  // Check if already logged in (only if no auth code)
  const checkAuth = async () => {
    console.log('CHECKING EXISTING AUTH')
    const { data: { session } } = await supabase.auth.getSession()
    console.log('EXISTING SESSION:', session ? 'EXISTS' : 'NONE')
    if (session) {
      console.log('ALREADY LOGGED IN, REDIRECTING TO /agent/home')
      router.push('/agent/home')
    }
  }
  
  checkAuth()

  // Listen for auth changes
  console.log('SETTING UP AUTH STATE LISTENER')
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('AUTH STATE CHANGE EVENT:', event)
    console.log('AUTH STATE CHANGE SESSION:', session ? 'EXISTS' : 'NONE')
    
    if (event === 'SIGNED_IN' && session) {
      console.log('Agent signed in:', session.user.email)
      console.log('REDIRECTING TO /agent/home')
      router.push('/agent/home')
    }
  })

  return () => {
    console.log('CLEANING UP AUTH LISTENER')
    subscription.unsubscribe()
  }
}, [supabase, router])

  // ... rest of your component code

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