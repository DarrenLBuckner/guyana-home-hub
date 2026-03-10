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

const PRICE_BUCKETS = [
  { label: 'Under $10,000', min: 0, max: 9999.99 },
  { label: '$10,000 - $50,000', min: 10000, max: 50000 },
  { label: '$50,000 - $200,000', min: 50000.01, max: 200000 },
  { label: '$200,000 - $500,000', min: 200000.01, max: 500000 },
  { label: 'Over $500,000', min: 500000.01, max: Infinity },
]

function getQuarterStart(): string {
  const now = new Date()
  const quarter = Math.floor(now.getMonth() / 3)
  const start = new Date(now.getFullYear(), quarter * 3, 1)
  return start.toISOString().split('T')[0]
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

type ReportData = {
  statusSummary: { status: string; count: number }[]
  byPropertyType: { property_type: string; count: number; avg_usd: number; median_usd: number }[]
  byRegion: { region: string; region_name: string; count: number; total_views: number; avg_usd: number }[]
  topViewed: any[]
  priceDist: { label: string; count: number }[]
  amenityFreq: { amenity: string; count: number; pct: number }[]
  newPerMonth: { month: string; count: number }[]
  soldInRange: any[]
  currencySummary: {
    gyd: { avg: number; median: number; count: number }
    usd: { avg: number; median: number; count: number }
  }
}

export default function ReportExportPage() {
  const router = useRouter()
  const supabase = createClient()

  const [authorized, setAuthorized] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [dateFrom, setDateFrom] = useState(getQuarterStart)
  const [dateTo, setDateTo] = useState(getToday)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState('')

  // Auth check: admin_level must be 'super' or 'owner'
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

  const runReport = async () => {
    setLoading(true)
    setError('')

    try {
      const fromISO = `${dateFrom}T00:00:00Z`
      const toISO = `${dateTo}T23:59:59Z`

      // Fetch all properties in date range for local processing
      const { data: allProps, error: fetchErr } = await supabase
        .from('properties')
        .select('id, title, status, property_type, region, neighborhood, views, view_count_30d, view_count_60d, price, currency, usd_price, amenities, first_listed_at, status_changed_at, created_at')
        .gte('created_at', fromISO)
        .lte('created_at', toISO)

      if (fetchErr) throw fetchErr
      const props = allProps || []

      // a. Total listings by status
      const statusMap: Record<string, number> = {}
      props.forEach(p => {
        statusMap[p.status] = (statusMap[p.status] || 0) + 1
      })
      const statusSummary = Object.entries(statusMap).map(([status, count]) => ({ status, count }))

      // b. Listings grouped by property_type
      const typeMap: Record<string, { prices: number[] }> = {}
      props.forEach(p => {
        const t = p.property_type || 'Unknown'
        if (!typeMap[t]) typeMap[t] = { prices: [] }
        if (p.usd_price) typeMap[t].prices.push(Number(p.usd_price))
      })
      const byPropertyType = Object.entries(typeMap).map(([property_type, d]) => ({
        property_type,
        count: d.prices.length,
        avg_usd: d.prices.length ? Math.round(d.prices.reduce((a, b) => a + b, 0) / d.prices.length) : 0,
        median_usd: Math.round(median(d.prices)),
      }))

      // c. Listings grouped by region
      const regionMap: Record<string, { prices: number[]; views: number }> = {}
      props.forEach(p => {
        const r = p.region || 'Unknown'
        if (!regionMap[r]) regionMap[r] = { prices: [], views: 0 }
        if (p.usd_price) regionMap[r].prices.push(Number(p.usd_price))
        regionMap[r].views += p.views || 0
      })
      const byRegion = Object.entries(regionMap).map(([region, d]) => ({
        region,
        region_name: REGION_MAP[region] || region,
        count: d.prices.length,
        total_views: d.views,
        avg_usd: d.prices.length ? Math.round(d.prices.reduce((a, b) => a + b, 0) / d.prices.length) : 0,
      }))

      // d. Top 10 most-viewed
      const topViewed = [...props]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10)
        .map(p => ({
          title: p.title,
          region: REGION_MAP[p.region] || p.region,
          property_type: p.property_type,
          usd_price: p.usd_price,
          price: p.price,
          currency: p.currency,
          views: p.views,
          view_count_30d: p.view_count_30d,
        }))

      // e. Price distribution in USD buckets
      const priceDist = PRICE_BUCKETS.map(bucket => {
        const count = props.filter(p => {
          const up = Number(p.usd_price)
          return up >= bucket.min && up <= bucket.max
        }).length
        return { label: bucket.label, count }
      })

      // f. Amenity frequency for active listings (database-level via RPC)
      const { data: amenityData, error: amenityErr } = await supabase.rpc('get_amenity_frequency')
      if (amenityErr) throw amenityErr
      const amenityFreq = (amenityData || []).map((r: any) => ({
        amenity: r.amenity,
        count: Number(r.count),
        pct: Number(r.total_active) > 0 ? Math.round((Number(r.count) / Number(r.total_active)) * 100) : 0,
      }))

      // g. New listings per month (use first_listed_at)
      // Fetch with first_listed_at filter separately since it's a different date field
      const { data: newListings } = await supabase
        .from('properties')
        .select('first_listed_at')
        .gte('first_listed_at', fromISO)
        .lte('first_listed_at', toISO)
        .not('first_listed_at', 'is', null)

      const monthMap: Record<string, number> = {}
      ;(newListings || []).forEach(p => {
        const month = p.first_listed_at?.substring(0, 7) // YYYY-MM
        if (month) monthMap[month] = (monthMap[month] || 0) + 1
      })
      const newPerMonth = Object.entries(monthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, count }))

      // h. Sold within date range
      const { data: soldData } = await supabase
        .from('properties')
        .select('id, title, region, property_type, usd_price, price, currency, status_changed_at')
        .eq('status', 'sold')
        .gte('status_changed_at', fromISO)
        .lte('status_changed_at', toISO)

      const soldInRange = (soldData || []).map(p => ({
        ...p,
        region_name: REGION_MAP[p.region] || p.region,
      }))

      // i. Dual currency summaries
      const gydPrices = props.filter(p => p.currency === 'GYD').map(p => Number(p.price))
      const usdPrices = props.filter(p => p.currency === 'USD').map(p => Number(p.usd_price))

      const currencySummary = {
        gyd: {
          count: gydPrices.length,
          avg: gydPrices.length ? Math.round(gydPrices.reduce((a, b) => a + b, 0) / gydPrices.length) : 0,
          median: Math.round(median(gydPrices)),
        },
        usd: {
          count: usdPrices.length,
          avg: usdPrices.length ? Math.round(usdPrices.reduce((a, b) => a + b, 0) / usdPrices.length) : 0,
          median: Math.round(median(usdPrices)),
        },
      }

      setReport({
        statusSummary,
        byPropertyType,
        byRegion,
        topViewed,
        priceDist,
        amenityFreq,
        newPerMonth,
        soldInRange,
        currencySummary,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to generate report.')
    } finally {
      setLoading(false)
    }
  }

  // --- Downloads ---
  const downloadJSON = () => {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ghh-report-${dateFrom}-to-${dateTo}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadCSV = () => {
    if (!report) return
    const sections: string[] = []

    // Status summary
    sections.push('LISTINGS BY STATUS')
    sections.push('Status,Count')
    report.statusSummary.forEach(r => sections.push(`${r.status},${r.count}`))

    sections.push('')
    sections.push('LISTINGS BY PROPERTY TYPE')
    sections.push('Property Type,Count,Avg USD Price,Median USD Price')
    report.byPropertyType.forEach(r =>
      sections.push(`${r.property_type},${r.count},${r.avg_usd},${r.median_usd}`)
    )

    sections.push('')
    sections.push('LISTINGS BY REGION')
    sections.push('Region,Count,Total Views,Avg USD Price')
    report.byRegion.forEach(r =>
      sections.push(`"${r.region_name}",${r.count},${r.total_views},${r.avg_usd}`)
    )

    sections.push('')
    sections.push('TOP 10 MOST VIEWED')
    sections.push('Title,Region,Type,USD Price,Original Price,Currency,Views,30d Views')
    report.topViewed.forEach(r =>
      sections.push(`"${r.title}","${r.region}",${r.property_type},${r.usd_price},${r.price},${r.currency},${r.views},${r.view_count_30d || 0}`)
    )

    sections.push('')
    sections.push('PRICE DISTRIBUTION (USD)')
    sections.push('Bucket,Count')
    report.priceDist.forEach(r => sections.push(`"${r.label}",${r.count}`))

    sections.push('')
    sections.push('AMENITY FREQUENCY (ACTIVE LISTINGS)')
    sections.push('Amenity,Count,Percentage')
    report.amenityFreq.forEach(r => sections.push(`${r.amenity},${r.count},${r.pct}%`))

    sections.push('')
    sections.push('NEW LISTINGS PER MONTH')
    sections.push('Month,Count')
    report.newPerMonth.forEach(r => sections.push(`${r.month},${r.count}`))

    sections.push('')
    sections.push('SOLD IN PERIOD')
    sections.push('Title,Region,Type,USD Price,Original Price,Currency,Date Sold')
    report.soldInRange.forEach(r =>
      sections.push(`"${r.title}","${r.region_name}",${r.property_type},${r.usd_price},${r.price},${r.currency},${r.status_changed_at}`)
    )

    sections.push('')
    sections.push('CURRENCY SUMMARY')
    sections.push(`GYD Listings,${report.currencySummary.gyd.count},Avg GYD,${report.currencySummary.gyd.avg},Median GYD,${report.currencySummary.gyd.median}`)
    sections.push(`USD Listings,${report.currencySummary.usd.count},Avg USD,${report.currencySummary.usd.avg},Median USD,${report.currencySummary.usd.median}`)

    const blob = new Blob([sections.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ghh-report-${dateFrom}-to-${dateTo}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Checking authorization...</p>
      </div>
    )
  }

  if (!authorized) return null

  const fmt = (n: number) => n.toLocaleString()
  const fmtUSD = (n: number) => `$${n.toLocaleString()}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Export</h1>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={runReport}
              disabled={loading}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Running...' : 'Run Report'}
            </button>

            {report && (
              <>
                <button
                  onClick={downloadJSON}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium"
                >
                  Download JSON
                </button>
                <button
                  onClick={downloadCSV}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium"
                >
                  Download CSV
                </button>
              </>
            )}
          </div>

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {/* Report Results */}
        {report && (
          <div className="space-y-6">
            {/* a. Status Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Listings by Status</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {report.statusSummary.map(s => (
                  <div key={s.status} className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{s.count}</p>
                    <p className="text-sm text-gray-600 capitalize">{s.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* b. By Property Type */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">By Property Type</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-600">Type</th>
                      <th className="text-right py-2 text-gray-600">Count</th>
                      <th className="text-right py-2 text-gray-600">Avg USD</th>
                      <th className="text-right py-2 text-gray-600">Median USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.byPropertyType.map(r => (
                      <tr key={r.property_type} className="border-b border-gray-100">
                        <td className="py-2 text-gray-900">{r.property_type}</td>
                        <td className="py-2 text-right text-gray-900">{r.count}</td>
                        <td className="py-2 text-right text-gray-900">{fmtUSD(r.avg_usd)}</td>
                        <td className="py-2 text-right text-gray-900">{fmtUSD(r.median_usd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* c. By Region */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">By Region</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-600">Region</th>
                      <th className="text-right py-2 text-gray-600">Count</th>
                      <th className="text-right py-2 text-gray-600">Total Views</th>
                      <th className="text-right py-2 text-gray-600">Avg USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.byRegion.map(r => (
                      <tr key={r.region} className="border-b border-gray-100">
                        <td className="py-2 text-gray-900">{r.region_name}</td>
                        <td className="py-2 text-right text-gray-900">{r.count}</td>
                        <td className="py-2 text-right text-gray-900">{fmt(r.total_views)}</td>
                        <td className="py-2 text-right text-gray-900">{fmtUSD(r.avg_usd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* d. Top 10 Most Viewed */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Most Viewed</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-600">Title</th>
                      <th className="text-left py-2 text-gray-600">Region</th>
                      <th className="text-left py-2 text-gray-600">Type</th>
                      <th className="text-right py-2 text-gray-600">USD Price</th>
                      <th className="text-right py-2 text-gray-600">Original Price</th>
                      <th className="text-right py-2 text-gray-600">Views</th>
                      <th className="text-right py-2 text-gray-600">30d Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topViewed.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 text-gray-900 max-w-[200px] truncate">{r.title}</td>
                        <td className="py-2 text-gray-600">{r.region}</td>
                        <td className="py-2 text-gray-600">{r.property_type}</td>
                        <td className="py-2 text-right text-gray-900">{fmtUSD(Number(r.usd_price))}</td>
                        <td className="py-2 text-right text-gray-600">{r.currency} {fmt(Number(r.price))}</td>
                        <td className="py-2 text-right font-medium text-gray-900">{fmt(r.views || 0)}</td>
                        <td className="py-2 text-right text-gray-600">{fmt(r.view_count_30d || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* e. Price Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Distribution (USD)</h2>
              <div className="space-y-3">
                {report.priceDist.map(b => {
                  const total = report.priceDist.reduce((a, x) => a + x.count, 0)
                  const pct = total > 0 ? Math.round((b.count / total) * 100) : 0
                  return (
                    <div key={b.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{b.label}</span>
                        <span className="text-gray-900 font-medium">{b.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* f. Amenity Frequency */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenity Frequency (Active Listings)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {report.amenityFreq.map(a => (
                  <div key={a.amenity} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-700 capitalize">{a.amenity}</span>
                    <span className="text-sm font-medium text-gray-900">{a.count} ({a.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* g. New Listings Per Month */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">New Listings Per Month</h2>
              {report.newPerMonth.length > 0 ? (
                <div className="space-y-2">
                  {report.newPerMonth.map(m => (
                    <div key={m.month} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <span className="text-sm text-gray-700">{m.month}</span>
                      <span className="text-sm font-medium text-gray-900">{m.count} listings</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No new listings in this period.</p>
              )}
            </div>

            {/* h. Sold In Range */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sold in Period</h2>
              {report.soldInRange.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-600">Title</th>
                        <th className="text-left py-2 text-gray-600">Region</th>
                        <th className="text-left py-2 text-gray-600">Type</th>
                        <th className="text-right py-2 text-gray-600">USD Price</th>
                        <th className="text-right py-2 text-gray-600">Date Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.soldInRange.map((r, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2 text-gray-900">{r.title}</td>
                          <td className="py-2 text-gray-600">{r.region_name}</td>
                          <td className="py-2 text-gray-600">{r.property_type}</td>
                          <td className="py-2 text-right text-gray-900">{fmtUSD(Number(r.usd_price))}</td>
                          <td className="py-2 text-right text-gray-600">{r.status_changed_at?.split('T')[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No listings sold in this period.</p>
              )}
            </div>

            {/* i. Currency Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Currency Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">GYD Listings ({report.currencySummary.gyd.count})</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Price</span>
                      <span className="font-medium text-gray-900">GYD {fmt(report.currencySummary.gyd.avg)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Median Price</span>
                      <span className="font-medium text-gray-900">GYD {fmt(report.currencySummary.gyd.median)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">USD Listings ({report.currencySummary.usd.count})</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Price</span>
                      <span className="font-medium text-gray-900">{fmtUSD(report.currencySummary.usd.avg)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Median Price</span>
                      <span className="font-medium text-gray-900">{fmtUSD(report.currencySummary.usd.median)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
