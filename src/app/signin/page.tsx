'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'

export default function AuthVerify() {
  const router = useRouter()
  const [supabase] = useState(() =>
    createBrowserSupabaseClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })
  )
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    // supabase.auth.getSessionFromUrl may not be typed, so cast to any
    (supabase.auth as any)
      .getSessionFromUrl({ storeSession: true })
      .then(({ data: { session }, error }: { data: { session: Session | null }; error: any }) => {
        if (error || !session) {
          console.error('Email confirmation error:', error)
          setMessage('Verification failed. Please try signing in again.')
        } else {
          router.replace('/dashboard')
        }
      })
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p className="text-center text-lg">{message}</p>
    </div>
  )
}
