'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AgentPending() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [vettingData, setVettingData] = useState<any>(null)

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/agent-login')
        return
      }

      // Get vetting information
      const { data: vetting, error } = await supabase
        .from('agent_vetting')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching vetting data:', error)
        router.push('/agent/vetting')
        return
      }

      setVettingData(vetting)
      setLoading(false)

      // If status changed, redirect accordingly
      if (vetting.status === 'approved') {
        router.push('/agent/home')
      } else if (vetting.status === 'rejected') {
        router.push('/agent/rejected')
      } else if (vetting.status === 'needs_revision') {
        router.push('/agent/vetting')
      }
    }

    checkStatus()
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Application Under Review</h1>
          <p className="text-lg text-gray-600">
            Thank you for submitting your agent verification application!
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">What happens next?</h2>
          <div className="text-left text-yellow-700 space-y-2">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">1.</span>
              <span>Our team reviews your application and documents</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">2.</span>
              <span>We may contact your references for verification</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">3.</span>
              <span>You'll receive an email notification with our decision</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">4.</span>
              <span>Once approved, you can start listing properties</span>
            </div>
          </div>
        </div>

        {vettingData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Application Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Company:</strong> {vettingData.company_name}</p>
              <p><strong>Submitted:</strong> {new Date(vettingData.submitted_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> 
                <span className="ml-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  {vettingData.status.replace('_', ' ').toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p><strong>Expected Review Time:</strong> 2-3 business days</p>
            <p><strong>Questions?</strong> Contact us at agents@guyanahomehub.com</p>
          </div>
          
          <div className="border-t pt-4">
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
