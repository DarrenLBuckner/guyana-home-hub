'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Check if user has admin role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type, roles')
          .eq('id', data.user.id)
          .single()

        if (profileError || !profile) {
          setError('Unable to verify admin access')
        } else {
          // Check if user has admin role (handle both text and array formats)
          const isAdmin = profile.user_type === 'admin' || 
                         profile.roles === 'admin' || 
                         (Array.isArray(profile.roles) && profile.roles.includes('admin'))
          
          const isSuperAdmin = profile.user_type === 'super_admin' || 
                              profile.roles === 'super_admin' || 
                              (Array.isArray(profile.roles) && profile.roles.includes('super_admin'))
          
          if (!isAdmin && !isSuperAdmin) {
            setError('Access denied: Admin privileges required')
          } else {
            router.push('/admin/dashboard')
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-700">Admin Login</h1>
        <p className="text-gray-600 text-center mb-6">
          Guyana Home Hub Staff Only
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="admin@guyanahomehub.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/agent-login" className="text-sm text-gray-600 hover:text-gray-800">
            Agent Login →
          </a>
        </div>
      </div>
    </div>
  )
}
