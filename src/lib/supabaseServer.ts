// src/lib/supabaseServer.ts
// Supabase helpers for the Next.js App Router (async cookie API)

import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const getSupabaseServer = () =>
  createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      /* ─────────── READ ─────────── */
      async get(name: string) {
        const store = await cookies()
        return store.get(name)?.value
      },

      /* ─────────── WRITE ────────── */
      async set(name: string, value: string, options?: CookieOptions) {
        const store = await cookies()
        store.set(name, value, options)
      },

      /* ─────────── REMOVE ───────── */
      async remove(name: string, options?: CookieOptions) {
        const store = await cookies()
        store.set(name, '', { ...options, maxAge: 0 })
      },
    },
  })

/* ───────── helper: { user, role } ───────── */
export async function getUserWithRole() {
  const supabase = getSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { user: null, role: 'guest' as const }

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return {
    user,
    role: (data?.role ?? 'guest') as 'guest' | 'agent' | 'admin' | 'super',
  }
}
