'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AgentReport {
  name: string
  email: string | null
  whatsapp: number
  request_viewing: number
  email_clicks: number
  phone: number
  share: number
  total: number
}

type DateRange = 'this_week' | 'this_month' | 'last_month' | 'custom'

function getDateRange(range: DateRange, customStart?: string, customEnd?: string) {
  const now = new Date()

  switch (range) {
    case 'this_week': {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      start.setHours(0, 0, 0, 0)
      return { start: start.toISOString(), end: now.toISOString() }
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start: start.toISOString(), end: now.toISOString() }
    }
    case 'last_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
      return { start: start.toISOString(), end: end.toISOString() }
    }
    case 'custom': {
      return {
        start: customStart ? new Date(customStart).toISOString() : new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        end: customEnd ? new Date(customEnd + 'T23:59:59').toISOString() : now.toISOString(),
      }
    }
  }
}

export default function EngagementReportPage() {
  const [report, setReport] = useState<Record<string, AgentReport>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>('this_month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [totalClicks, setTotalClicks] = useState(0)

  const supabase = createClient()

  const fetchReport = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { start, end } = getDateRange(dateRange, customStart, customEnd)

    const { data, error: fetchError } = await supabase
      .from('agent_engagement_clicks')
      .select(`
        agent_id,
        action_type,
        profiles!agent_id (
          full_name,
          email
        )
      `)
      .gte('created_at', start)
      .lte('created_at', end)

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    const aggregated = (data as any[])?.reduce((acc: Record<string, AgentReport>, click: any) => {
      const agentId = click.agent_id || '_unknown'
      if (!acc[agentId]) {
        acc[agentId] = {
          name: click.profiles?.full_name ?? 'Unknown / No Agent',
          email: click.profiles?.email ?? null,
          whatsapp: 0,
          request_viewing: 0,
          email_clicks: 0,
          phone: 0,
          share: 0,
          total: 0,
        }
      }
      const action = click.action_type as string
      if (action === 'whatsapp') acc[agentId].whatsapp++
      else if (action === 'request_viewing') acc[agentId].request_viewing++
      else if (action === 'email') acc[agentId].email_clicks++
      else if (action === 'phone') acc[agentId].phone++
      else if (action === 'share') acc[agentId].share++
      acc[agentId].total++
      return acc
    }, {} as Record<string, AgentReport>) || {}

    setReport(aggregated)
    setTotalClicks(Object.values(aggregated as Record<string, AgentReport>).reduce((sum, a) => sum + a.total, 0))
    setLoading(false)
  }, [supabase, dateRange, customStart, customEnd])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const sortedAgents = Object.entries(report).sort(([, a], [, b]) => b.total - a.total)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Agent Engagement Report</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track WhatsApp, viewing requests, email, phone, and share clicks across all agent listings and profiles.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          )}

          <button
            onClick={fetchReport}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{totalClicks}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Clicks</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {Object.values(report).reduce((s, a) => s + a.whatsapp, 0)}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">WhatsApp</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {Object.values(report).reduce((s, a) => s + a.request_viewing, 0)}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Viewing Requests</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-700">
              {Object.values(report).reduce((s, a) => s + a.phone + a.email_clicks, 0)}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Phone + Email</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Agent</th>
                  <th className="text-center px-3 py-3 font-semibold text-green-700">WhatsApp</th>
                  <th className="text-center px-3 py-3 font-semibold text-blue-700">Viewings</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700">Email</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700">Phone</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700">Share</th>
                  <th className="text-center px-3 py-3 font-semibold text-emerald-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      Loading engagement data...
                    </td>
                  </tr>
                ) : sortedAgents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No engagement data for this period.
                    </td>
                  </tr>
                ) : (
                  sortedAgents.map(([agentId, agent]) => (
                    <tr key={agentId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{agent.name}</div>
                        {agent.email && (
                          <div className="text-xs text-gray-400">{agent.email}</div>
                        )}
                      </td>
                      <td className="text-center px-3 py-3 tabular-nums">{agent.whatsapp || '-'}</td>
                      <td className="text-center px-3 py-3 tabular-nums">{agent.request_viewing || '-'}</td>
                      <td className="text-center px-3 py-3 tabular-nums">{agent.email_clicks || '-'}</td>
                      <td className="text-center px-3 py-3 tabular-nums">{agent.phone || '-'}</td>
                      <td className="text-center px-3 py-3 tabular-nums">{agent.share || '-'}</td>
                      <td className="text-center px-3 py-3 font-bold text-emerald-600 tabular-nums">{agent.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
