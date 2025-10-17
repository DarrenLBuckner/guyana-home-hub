'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AgentRejected() {
  const router = useRouter()
  const supabase = createClient()
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
      } else if (vetting.status === 'pending_review') {
        router.push('/agent/pending')
      }
    }

    checkStatus()
  }, [supabase, router])

  const handleReapply = () => {
    router.push('/agent/vetting')
  }

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
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Application Not Approved</h1>
          <p className="text-lg text-gray-600">
            Unfortunately, we cannot approve your agent application at this time.
          </p>
        </div>

        {vettingData?.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Reason for Rejection</h2>
            <p className="text-red-700">{vettingData.rejection_reason}</p>
          </div>
        )}

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">What you can do:</h2>
          <div className="text-blue-700 space-y-2">
            <div className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Review the feedback provided above</span>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Address any issues mentioned in the rejection reason</span>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Gather additional documentation if required</span>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Submit a new application when ready</span>
            </div>
          </div>
        </div>

        {vettingData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Application History</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Company:</strong> {vettingData.company_name}</p>
              <p><strong>Submitted:</strong> {new Date(vettingData.submitted_at).toLocaleDateString()}</p>
              <p><strong>Reviewed:</strong> {vettingData.reviewed_at ? new Date(vettingData.reviewed_at).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Status:</strong> 
                <span className="ml-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                  REJECTED
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleReapply}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-semibold"
          >
            Submit New Application
          </button>
          <button
            onClick={handleSignOut}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Sign Out
          </button>
        </div>

        <div className="text-center mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500 mb-2">
            <strong>Need help?</strong> Contact our agent support team:
          </p>
          <p className="text-sm text-gray-600">
            Email: agents@guyanahomehub.com<br />
            Phone: <a href="tel:+5927629797" className="text-green-600 hover:text-green-700">+592 762 9797</a><br />
            WhatsApp: <a href="https://wa.me/5927629797" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">+592 762 9797</a>
          </p>
        </div>
      </div>
    </div>
  )
}
