'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AgentLogin() {
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
        // Check agent vetting status before redirecting
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('vetting_status, user_type, roles')
          .eq('id', data.user.id)
          .single()

        if (profileError || !profile) {
          console.log('PROFILE FETCH ERROR:', profileError, profile);
          setError('Unable to verify account status');
          return;
        }

        // Ensure user is marked as agent (handle both single and multiple roles)
        // Debug: log the profile object
        console.log('AGENT LOGIN PROFILE:', profile);

        // Robust agent role check
        let rolesArr = [];
        if (typeof profile.roles === 'string') {
          rolesArr = profile.roles.split(',').map(r => r.trim().toLowerCase());
        } else if (Array.isArray(profile.roles)) {
          rolesArr = profile.roles.map(r => r.trim().toLowerCase());
        }
        const isAgent = profile.user_type === 'agent' || rolesArr.includes('agent');

        if (!isAgent) {
          setError('This login is for registered agents only');
          return;
        }

        // Check for dual admin+agent roles - only allowed for Qumar
        const hasAdminRole = profile.user_type === 'admin' || 
                           profile.roles === 'admin' ||
                           (typeof profile.roles === 'string' && profile.roles.includes('admin')) ||
                           (Array.isArray(profile.roles) && profile.roles.includes('admin'))
        
        if (hasAdminRole && data.user.email !== 'qumar.torrington@gmail.com') {
          setError('Dual admin/agent access is restricted')
          return
        }
        // Only Qumar can have dual admin+agent roles
        if (hasAdminRole && data.user.email !== 'qumartorrington@caribbeanhomehub.com') {
          setError('Dual admin/agent access is restricted')
          return
        }

        // Redirect based on vetting status
        switch (profile.vetting_status) {
          case 'not_submitted':
            router.push('/agent/vetting')
            break
          case 'pending_review':
            router.push('/agent/pending')
            break
          case 'needs_revision':
            router.push('/agent/vetting')
            break
          case 'approved':
            router.push('/agent/home')
            break
          case 'rejected':
            router.push('/agent/rejected')
            break
          default:
            router.push('/agent/vetting')
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
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Agent Login</h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to manage your property listings
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don't have an agent account?{' '}
            <a href="/agent-register" className="text-green-600 hover:text-green-800 font-medium">
              Register here
            </a>
          </p>
          <p className="mt-2">
            Need help? {' '}
            <a href="/contact" className="text-green-600 hover:text-green-800 font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
