'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AgentLogin() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    console.log('✅ AGENT LOGIN PAGE LOADED - REACT COMPONENT EXECUTING')
    const urlParams = new URLSearchParams(window.location.search)
    const authCode = urlParams.get('code')
    if (authCode) {
      console.log('✅ AUTH CODE FOUND IN URL:', authCode)
      supabase.auth.exchangeCodeForSession(authCode).then(({ data, error }) => {
        if (error) {
          console.error('❌ CODE EXCHANGE ERROR:', error)
          alert('Failed to login!')
        } else if (data.session) {
          console.log('✅ CODE EXCHANGE RESULT: SUCCESS, redirecting...')
          router.push('/agent/home')
        } else {
          console.error('❌ CODE EXCHANGE: No session returned')
        }
      })
    } else {
      console.log('⏳ No auth code in URL, rendering login button')
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', session)
      if (session) {
        console.log('User is logged in:', session.user.email)
      }
    })
  }, [supabase, router])

  // -------- FIXED: Correct function name & no duplicate supabase ----------
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/agent-login`,
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Agent Login</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded text-lg"
      >
        Sign in with Google
      </button>
      <p className="mt-6 text-sm text-gray-500">
        Console will log auth steps. If you don’t see logs, page isn’t running latest code!
      </p>
    </div>
  )
}
