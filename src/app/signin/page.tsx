'use client'

import { useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserClient } from '@supabase/ssr'

export default function CustomerSignIn() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4 text-green-700">Sign In to Guyana Home Hub</h2>
      <p className="mb-6 text-gray-600 text-center">
        Use Google, Facebook, or email to access listings and save properties.
      </p>

      <div className="w-full max-w-md bg-white p-6 rounded shadow">
      <Auth
  supabaseClient={supabase}
  appearance={{ theme: ThemeSupa }}
  providers={['google', 'facebook']}
  magicLink={true}
/>

      </div>
    </div>
  )
}
