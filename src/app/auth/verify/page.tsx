'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'

export default function AuthVerify() {
  const router = useRouter()
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    (supabase.auth as any)
      .getSessionFromUrl({ storeSession: true })
      .then(({ data: { session }, error }: { data: { session: Session | null }, error: any }) => {
        if (error || !session) {
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
