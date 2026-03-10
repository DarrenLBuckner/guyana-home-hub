'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const REGION_MAP: Record<string, string> = {
  'GY-R4': 'East Bank Demerara',
  'GY-Georgetown': 'Georgetown',
  'GY-R3': 'West Demerara / Essequibo Islands',
  'GY-R6': 'East Berbice-Corentyne',
  'GY-R2': 'Pomeroon-Supenaam',
  'GY-R4-Diamond': 'Diamond, East Bank Demerara',
}

// Fields used for completeness scoring — maps section to fields and their labels
const COMPLETENESS_FIELDS: { section: string; field: string; label: string }[] = [
  { section: 'Identity', field: 'full_name', label: 'Full name' },
  { section: 'Identity', field: 'years_active', label: 'Years active' },
  { section: 'Identity', field: 'languages', label: 'Languages' },
  { section: 'Identity', field: 'headshot_url', label: 'Headshot photo' },
  { section: 'Specialization', field: 'property_types', label: 'Property types' },
  { section: 'Specialization', field: 'primary_regions', label: 'Primary regions' },
  { section: 'Specialization', field: 'price_range_min_usd', label: 'Price range (min)' },
  { section: 'Specialization', field: 'price_range_max_usd', label: 'Price range (max)' },
  { section: 'Buyer Persona', field: 'buyer_types', label: 'Buyer types' },
  { section: 'Track Record', field: 'total_transactions', label: 'Total transactions' },
  { section: 'Track Record', field: 'transactions_12mo', label: 'Transactions (12mo)' },
  { section: 'Track Record', field: 'notable_neighborhoods', label: 'Notable neighborhoods' },
  { section: 'Contact', field: 'phone', label: 'Phone number' },
  { section: 'Contact', field: 'email', label: 'Email address' },
]

function getMissingFields(agent: any): string[] {
  const missing: string[] = []
  for (const f of COMPLETENESS_FIELDS) {
    const val = agent[f.field]
    if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
      missing.push(f.label)
    }
  }
  // Special case: diaspora_cities required if diaspora buyer type selected
  if (
    (agent.buyer_types || []).includes('Guyanese diaspora buyers living abroad') &&
    (!agent.diaspora_cities || agent.diaspora_cities.length === 0)
  ) {
    missing.push('Diaspora cities')
  }
  return missing
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-700 bg-green-100'
  if (score >= 70) return 'text-blue-700 bg-blue-100'
  if (score >= 50) return 'text-yellow-700 bg-yellow-100'
  return 'text-red-700 bg-red-100'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Complete'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Incomplete'
  return 'Insufficient'
}

type AgentRow = any & { _flagged?: boolean }

export default function AdminAgentsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [authorized, setAuthorized] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [agents, setAgents] = useState<AgentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState('')

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('admin_level')
        .eq('id', user.id)
        .single()

      if (!profile || (profile.admin_level !== 'super' && profile.admin_level !== 'owner')) {
        router.push('/unauthorized')
        return
      }

      setAuthorized(true)
      setAuthChecked(true)
    }
    checkAuth()
  }, [supabase, router])

  // Fetch unpublished agents
  useEffect(() => {
    if (!authorized) return

    const fetchAgents = async () => {
      setLoading(true)
      const { data, error: fetchErr } = await supabase
        .from('agents')
        .select('*')
        .eq('is_published', false)
        .order('profile_completeness', { ascending: false })

      if (fetchErr) {
        setError('Failed to load agents.')
        setLoading(false)
        return
      }

      setAgents((data || []).map(a => ({ ...a, _flagged: false })))
      setLoading(false)
    }

    fetchAgents()
  }, [authorized, supabase])

  // --- Actions ---
  const handleApprove = async (agent: AgentRow) => {
    setActionLoading(agent.id)
    setError('')

    try {
      const { error: updateErr } = await supabase
        .from('agents')
        .update({
          is_published: true,
          is_verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq('id', agent.id)

      if (updateErr) throw updateErr

      // Remove from list
      setAgents(prev => prev.filter(a => a.id !== agent.id))
    } catch (err: any) {
      setError(err.message || 'Failed to approve agent.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (agent: AgentRow) => {
    if (!rejectReason.trim()) {
      setError('Please enter a rejection reason.')
      return
    }

    setActionLoading(agent.id)
    setError('')

    try {
      const missing = getMissingFields(agent)
      const reasonWithFields = `${rejectReason.trim()}${missing.length > 0 ? `\n\nMissing fields: ${missing.join(', ')}` : ''}`

      // Save reason to differentiation_flags temporarily
      const { error: updateErr } = await supabase
        .from('agents')
        .update({
          differentiation_flags: reasonWithFields,
        })
        .eq('id', agent.id)

      if (updateErr) throw updateErr

      // Send rejection email via edge function or API
      // For now, use the existing track API pattern to log the rejection
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'agent_rejected',
            payload: {
              agent_id: agent.id,
              email: agent.email,
              full_name: agent.full_name,
              reason: reasonWithFields,
              missing_fields: missing,
            },
          }),
        })
      } catch {
        // Non-blocking — rejection is saved even if tracking fails
      }

      setRejectingId(null)
      setRejectReason('')
      // Update in list to show rejection was saved
      setAgents(prev => prev.map(a =>
        a.id === agent.id ? { ...a, differentiation_flags: reasonWithFields } : a
      ))
    } catch (err: any) {
      setError(err.message || 'Failed to reject agent.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleFlag = (agentId: string) => {
    setAgents(prev => prev.map(a =>
      a.id === agentId ? { ...a, _flagged: !a._flagged } : a
    ))
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Checking authorization...</p>
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Agent Review Queue</h1>
          <p className="text-sm text-gray-600 mt-1">
            Agents pending approval, sorted by profile completeness (highest first).
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No agents pending review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agents.map(agent => {
              const missing = getMissingFields(agent)
              const score = agent.profile_completeness || 0
              const regions = (agent.primary_regions || [])
                .map((r: string) => REGION_MAP[r] || r)
                .join(', ')

              return (
                <div
                  key={agent.id}
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                    agent._flagged
                      ? 'border-l-yellow-500'
                      : agent.differentiation_flags
                        ? 'border-l-red-400'
                        : 'border-l-transparent'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Agent info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {agent.headshot_url && (
                          <img
                            src={agent.headshot_url}
                            alt={agent.full_name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {agent.full_name}
                            {agent._flagged && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                                Flagged
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Regions: </span>
                          <span className="text-gray-900">{regions || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted: </span>
                          <span className="text-gray-900">
                            {agent.joined_at ? new Date(agent.joined_at).toLocaleDateString() : 'Draft'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Score: </span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
                            {score}% — {getScoreLabel(score)}
                          </span>
                        </div>
                      </div>

                      {/* Completeness bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            score >= 70 ? 'bg-green-600' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      {/* Missing fields */}
                      {missing.length > 0 && (
                        <div className="text-xs text-gray-500">
                          <span className="font-medium text-gray-700">Missing: </span>
                          {missing.join(', ')}
                        </div>
                      )}

                      {/* Rejection reason if present */}
                      {agent.differentiation_flags && !rejectingId && (
                        <div className="mt-2 bg-red-50 border border-red-100 rounded p-2 text-xs text-red-700">
                          <span className="font-medium">Rejection saved: </span>
                          {agent.differentiation_flags.split('\n')[0]}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 lg:min-w-[160px]">
                      <button
                        onClick={() => handleApprove(agent)}
                        disabled={actionLoading === agent.id}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 text-sm font-medium"
                      >
                        {actionLoading === agent.id ? 'Saving...' : 'Approve'}
                      </button>

                      {rejectingId === agent.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            rows={3}
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReject(agent)}
                              disabled={actionLoading === agent.id}
                              className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => { setRejectingId(null); setRejectReason('') }}
                              className="flex-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRejectingId(agent.id)}
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 text-sm font-medium"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleFlag(agent.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          agent._flagged
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {agent._flagged ? 'Unflag' : 'Flag for Follow-up'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
