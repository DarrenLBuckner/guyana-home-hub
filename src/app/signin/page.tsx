'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserClient } from '@supabase/ssr'

export default function SignIn() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  /** Safe redirect: works in build (no window) and in browser */
  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard`
      : '/dashboard'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo={redirectTo}
      />
    </div>
  )
}
