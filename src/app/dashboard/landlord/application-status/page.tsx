'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  user_type: string
  approval_status: 'pending' | 'approved' | 'needs_correction' | 'rejected' | 'suspended'
  rejection_reason: string | null
  created_at: string
}

export default function LandlordApplicationStatus() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        router.push('/signin')
        return
      }

      // Verify user is Landlord
      if (profileData.user_type !== 'landlord') {
        router.push('/dashboard')
        return
      }

      setProfile(profileData)
      setLoading(false)

      // If approved, redirect to main dashboard
      if (profileData.approval_status === 'approved') {
        router.push('/dashboard')
      }
    }

    checkStatus()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳', label: 'Pending Review' }
      case 'approved':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅', label: 'Approved' }
      case 'needs_correction':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '⚠️', label: 'Needs Correction' }
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌', label: 'Rejected' }
      case 'suspended':
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '🚫', label: 'Suspended' }
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '❓', label: status }
    }
  }

  const statusInfo = getStatusDisplay(profile?.approval_status || 'pending')

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-8 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Application Status</h1>
            <p className="text-white/80">Landlord Account</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusInfo.color}`}>
                <span className="text-xl">{statusInfo.icon}</span>
                <span className="font-semibold">{statusInfo.label}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Your Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {profile?.first_name} {profile?.last_name}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Phone:</strong> {profile?.phone || 'Not provided'}</p>
                <p><strong>Account Type:</strong> Landlord</p>
                <p><strong>Registered:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            {/* Needs Correction - Show reason and edit button */}
            {profile?.approval_status === 'needs_correction' && (
              <>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">Action Required</h3>
                  <p className="text-orange-700 mb-3">
                    {profile.rejection_reason || 'Please review and update your information.'}
                  </p>
                </div>
                <Link
                  href="/dashboard/landlord/application-status/edit"
                  className="block w-full bg-green-600 text-white text-center px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
                >
                  Edit & Resubmit Application
                </Link>
              </>
            )}

            {/* Pending - Show waiting message */}
            {profile?.approval_status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Under Review</h3>
                <p className="text-yellow-700">
                  Your application is being reviewed by our team. This typically takes 1-2 business days.
                  You'll receive an email once your account is approved.
                </p>
              </div>
            )}

            {/* Rejected - Show reason and contact support */}
            {profile?.approval_status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Application Rejected</h3>
                <p className="text-red-700 mb-3">
                  {profile.rejection_reason || 'Your application has been rejected.'}
                </p>
                <p className="text-red-600 text-sm">
                  If you believe this is an error, please contact support.
                </p>
              </div>
            )}

            {/* Suspended - Show reason */}
            {profile?.approval_status === 'suspended' && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Account Suspended</h3>
                <p className="text-gray-700">
                  {profile.rejection_reason || 'Your account has been suspended. Please contact support for more information.'}
                </p>
              </div>
            )}

            {/* Contact Support */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Need help?</p>
              <p className="text-sm text-gray-600">
                Email: <a href="mailto:support@guyanahomehub.com" className="text-green-600 hover:underline">support@guyanahomehub.com</a>
                <br />
                WhatsApp: <a href="https://wa.me/5927629797" className="text-green-600 hover:underline">+592 762 9797</a>
              </p>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
