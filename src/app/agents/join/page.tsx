'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TOTAL_SECTIONS = 5
const SECTION_LABELS = [
  'About You',
  'Specialization',
  'Who You Serve',
  'Track Record',
  'Contact',
]

const LANGUAGES = ['English', 'Hindi', 'Creolese', 'Portuguese', 'Spanish', 'Other']

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Land', 'Luxury', 'New Builds']

const REGIONS = [
  { label: 'Georgetown', code: 'GY-Georgetown' },
  { label: 'East Bank Demerara', code: 'GY-R4' },
  { label: 'West Demerara / Essequibo Islands', code: 'GY-R3' },
  { label: 'East Berbice-Corentyne', code: 'GY-R6' },
  { label: 'Pomeroon-Supenaam', code: 'GY-R2' },
  { label: 'Other', code: 'Other' },
]

const BUYER_TYPES = [
  'Guyanese diaspora buyers living abroad',
  'International expats and investors',
  'Local first-time buyers',
  'Property investors',
  'Corporate and relocation buyers',
]

const DIASPORA_CITIES = ['New York', 'Toronto', 'London', 'South Florida', 'Montreal', 'Other']

type AgentDraft = {
  id?: string
  email: string
  full_name: string
  display_name: string
  license_number: string
  years_active: number | null
  is_independent: boolean
  brokerage_name: string
  languages: string[]
  headshot_url: string
  property_types: string[]
  transaction_types: string[]
  primary_regions: string[]
  primary_neighborhoods: string[]
  price_range_min_usd: number | null
  price_range_max_usd: number | null
  niche_expertise: string
  buyer_types: string[]
  diaspora_cities: string[]
  community_ties: string
  total_transactions: number | null
  transactions_12mo: number | null
  avg_days_to_close: number | null
  notable_neighborhoods: string[]
  certifications: string[]
  awards: string
  notable_transactions: string
  phone: string
  whatsapp: string
  preferred_contact: string
}

const INITIAL_DRAFT: AgentDraft = {
  email: '',
  full_name: '',
  display_name: '',
  license_number: '',
  years_active: null,
  is_independent: true,
  brokerage_name: '',
  languages: [],
  headshot_url: '',
  property_types: [],
  transaction_types: [],
  primary_regions: [],
  primary_neighborhoods: [],
  price_range_min_usd: 0,
  price_range_max_usd: 2000000,
  niche_expertise: '',
  buyer_types: [],
  diaspora_cities: [],
  community_ties: '',
  total_transactions: null,
  transactions_12mo: null,
  avg_days_to_close: null,
  notable_neighborhoods: [],
  certifications: [],
  awards: '',
  notable_transactions: '',
  phone: '',
  whatsapp: '',
  preferred_contact: 'email',
}

// --- Profile completeness scoring (used on save and final submit) ---
function calculateCompleteness(d: AgentDraft): number {
  let score = 0

  // Identity (20 pts): full_name, years_active, languages, headshot_url
  const identityFields = [d.full_name, d.years_active, d.languages?.length, d.headshot_url]
  score += Math.round((identityFields.filter(Boolean).length / 4) * 20)

  // Specialization (25 pts): property_types, primary_regions, price_range_min_usd, price_range_max_usd
  let specCount = 0
  if (d.property_types?.length) specCount++
  if (d.primary_regions?.length) specCount++
  if (d.price_range_min_usd !== null && d.price_range_min_usd !== undefined) specCount++
  if (d.price_range_max_usd !== null && d.price_range_max_usd !== undefined) specCount++
  score += Math.round((specCount / 4) * 25)

  // Buyer persona (20 pts): buyer_types, diaspora_cities (if diaspora selected)
  const hasDiaspora = d.buyer_types?.includes('Guyanese diaspora buyers living abroad')
  if (hasDiaspora) {
    let bpCount = 0
    if (d.buyer_types?.length) bpCount++
    if (d.diaspora_cities?.length) bpCount++
    score += Math.round((bpCount / 2) * 20)
  } else {
    score += d.buyer_types?.length ? 20 : 0
  }

  // Track record (25 pts): total_transactions, transactions_12mo, notable_neighborhoods
  let trCount = 0
  if (d.total_transactions !== null && d.total_transactions !== undefined) trCount++
  if (d.transactions_12mo !== null && d.transactions_12mo !== undefined) trCount++
  if (d.notable_neighborhoods?.length) trCount++
  score += Math.round((trCount / 3) * 25)

  // Contact (10 pts): at least one of phone / email / whatsapp
  if (d.phone || d.email || d.whatsapp) score += 10

  return Math.min(score, 100)
}

export default function AgentJoinPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<'email' | number>('email')
  const [draft, setDraft] = useState<AgentDraft>(INITIAL_DRAFT)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null)

  const [emailInput, setEmailInput] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  // --- Shared save helper ---
  const saveDraft = async (fields: Record<string, any>) => {
    const payload = {
      ...fields,
      profile_completeness: calculateCompleteness({ ...draft, ...fields }),
    }

    if (draft.id) {
      const { error } = await supabase.from('agents').update(payload).eq('id', draft.id)
      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('agents')
        .insert([{ email: draft.email, ...payload }])
        .select('id')
        .single()
      if (error) throw error
      setDraft(prev => ({ ...prev, id: data.id }))
    }
  }

  // --- Email entry / resume ---
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = emailInput.trim().toLowerCase()
    if (!email) return

    setEmailLoading(true)
    setError('')

    try {
      const { data: existing, error: fetchError } = await supabase
        .from('agents')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (fetchError) {
        setError('Something went wrong. Please try again.')
        setEmailLoading(false)
        return
      }

      if (existing) {
        setDraft({ ...INITIAL_DRAFT, ...existing })
        if (existing.headshot_url) setHeadshotPreview(existing.headshot_url)
      } else {
        setDraft({ ...INITIAL_DRAFT, email })
      }

      setStep(1)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  // --- Headshot upload ---
  const handleHeadshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`

      const { error: uploadError } = await supabase.storage
        .from('agent-headshots')
        .upload(filename, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        setUploading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('agent-headshots')
        .getPublicUrl(filename)

      setDraft(prev => ({ ...prev, headshot_url: publicUrl }))
      setHeadshotPreview(publicUrl)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // --- Section save handlers ---
  const handleSaveSection1 = async () => {
    if (!draft.full_name.trim()) { setError('Full name is required.'); return }
    if (!draft.years_active || draft.years_active < 0) { setError('Years active is required.'); return }
    if (!draft.headshot_url) { setError('Headshot photo is required.'); return }

    setSaving(true)
    setError('')
    try {
      await saveDraft({
        full_name: draft.full_name.trim(),
        display_name: draft.display_name.trim() || null,
        license_number: draft.license_number.trim() || null,
        years_active: draft.years_active,
        is_independent: draft.is_independent,
        brokerage_name: draft.is_independent ? null : draft.brokerage_name.trim() || null,
        languages: draft.languages.length > 0 ? draft.languages : null,
        headshot_url: draft.headshot_url,
      })
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSection2 = async () => {
    setSaving(true)
    setError('')
    try {
      await saveDraft({
        property_types: draft.property_types.length > 0 ? draft.property_types : null,
        transaction_types: draft.transaction_types.length > 0 ? draft.transaction_types : null,
        primary_regions: draft.primary_regions.length > 0 ? draft.primary_regions : null,
        primary_neighborhoods: draft.primary_neighborhoods.length > 0 ? draft.primary_neighborhoods : null,
        price_range_min_usd: draft.price_range_min_usd,
        price_range_max_usd: draft.price_range_max_usd,
        niche_expertise: draft.niche_expertise.trim() || null,
      })
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSection3 = async () => {
    setSaving(true)
    setError('')
    try {
      await saveDraft({
        buyer_types: draft.buyer_types.length > 0 ? draft.buyer_types : null,
        diaspora_cities: draft.diaspora_cities.length > 0 ? draft.diaspora_cities : null,
        community_ties: draft.community_ties.trim() || null,
      })
      setStep(4)
    } catch (err: any) {
      setError(err.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSection4 = async () => {
    setSaving(true)
    setError('')
    try {
      await saveDraft({
        total_transactions: draft.total_transactions,
        transactions_12mo: draft.transactions_12mo,
        avg_days_to_close: draft.avg_days_to_close,
        notable_neighborhoods: draft.notable_neighborhoods.length > 0 ? draft.notable_neighborhoods : null,
        certifications: draft.certifications.length > 0 ? draft.certifications : null,
        awards: draft.awards.trim() || null,
        notable_transactions: draft.notable_transactions.trim() || null,
      })
      setStep(5)
    } catch (err: any) {
      setError(err.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleFinalSubmit = async () => {
    if (!draft.phone.trim()) { setError('Phone number is required.'); return }
    if (!draft.email.trim()) { setError('Email address is required.'); return }

    setSaving(true)
    setError('')
    try {
      const completeness = calculateCompleteness(draft)
      await saveDraft({
        phone: draft.phone.trim(),
        whatsapp: draft.whatsapp.trim() || null,
        preferred_contact: draft.preferred_contact,
        is_published: false,
        joined_at: new Date().toISOString(),
        profile_completeness: completeness,
      })
      router.push('/agents/thank-you')
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // --- Toggle helpers ---
  const toggleArrayField = (field: keyof AgentDraft, value: string) => {
    setDraft(prev => {
      const arr = prev[field] as string[]
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      }
    })
  }

  // --- Progress bar ---
  const currentSection = typeof step === 'number' ? step : 0
  const progressPercent = Math.round((currentSection / TOTAL_SECTIONS) * 100)

  // Shared progress bar component
  const ProgressBar = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Section {currentSection} of {TOTAL_SECTIONS}: {SECTION_LABELS[currentSection - 1]}</span>
        <span>{progressPercent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )

  // Shared navigation buttons
  const NavButtons = ({ onSave, backStep }: { onSave: () => void; backStep: number }) => (
    <div className="space-y-3 pt-2">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="w-full bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {saving ? 'Saving...' : currentSection === 5 ? 'Submit Application' : 'Save & Continue'}
      </button>
      <button
        type="button"
        onClick={() => { setError(''); setStep(backStep) }}
        className="w-full text-green-700 hover:text-green-800 font-medium text-sm py-2"
      >
        &larr; Back to previous section
      </button>
    </div>
  )

  // Input class constant
  const inputClass = 'w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent'

  // =============================================
  // RENDER
  // =============================================

  // --- Email entry screen ---
  if (step === 'email') {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Join as an Agent
            </h1>
            <p className="text-gray-600 mb-4">
              Build your professional profile on Guyana Home Hub and connect with buyers across the diaspora.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-green-800 mb-2">
                Why does this matter?
              </h3>
              <p className="text-sm text-green-700">
                Guyana Home Hub uses proprietary matching technology to connect your listings
                with the right buyers — locally and across the diaspora. The more complete your
                profile, the better our system can surface your properties to serious, qualified
                buyers. Agents with complete profiles see significantly more inquiries.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">One-time setup.</span>{' '}
                This intake takes about 10 minutes. Once approved, you can update your headshot,
                contact info, specializations, and other details anytime from your agent dashboard settings.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {emailLoading ? 'Checking...' : 'Get Started'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // --- Section 1: About You ---
  if (step === 1) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <ProgressBar />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-green-700 mb-1">About You</h2>
            <p className="text-sm text-gray-500 mb-4">
              Tell us about yourself and your experience in Guyanese real estate.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              All information can be updated later from your agent dashboard settings.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={draft.full_name}
                  onChange={e => setDraft(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Your full legal name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={draft.display_name}
                  onChange={e => setDraft(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="How you want to appear publicly (optional)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Real Estate License Number</label>
                <input
                  type="text"
                  value={draft.license_number}
                  onChange={e => setDraft(prev => ({ ...prev, license_number: e.target.value }))}
                  placeholder="If applicable"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years Active in Guyanese Real Estate *</label>
                <input
                  type="number"
                  min="0"
                  value={draft.years_active ?? ''}
                  onChange={e => setDraft(prev => ({
                    ...prev,
                    years_active: e.target.value ? parseInt(e.target.value, 10) : null,
                  }))}
                  placeholder="e.g. 5"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDraft(prev => ({ ...prev, is_independent: true }))}
                    className={`flex-1 py-2 px-4 rounded border font-medium text-sm transition-colors ${
                      draft.is_independent
                        ? 'bg-green-700 text-white border-green-700'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Independent
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraft(prev => ({ ...prev, is_independent: false }))}
                    className={`flex-1 py-2 px-4 rounded border font-medium text-sm transition-colors ${
                      !draft.is_independent
                        ? 'bg-green-700 text-white border-green-700'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Brokerage
                  </button>
                </div>
              </div>

              {!draft.is_independent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brokerage Name</label>
                  <input
                    type="text"
                    value={draft.brokerage_name}
                    onChange={e => setDraft(prev => ({ ...prev, brokerage_name: e.target.value }))}
                    placeholder="Name of your brokerage"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LANGUAGES.map(lang => (
                    <label key={lang} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.languages.includes(lang)}
                        onChange={() => toggleArrayField('languages', lang)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Headshot Photo *</label>
                {headshotPreview ? (
                  <div className="flex items-center gap-4">
                    <img src={headshotPreview} alt="Headshot preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-sm text-green-700 hover:text-green-800 font-medium">
                      {uploading ? 'Uploading...' : 'Change photo'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <span className="text-gray-500">Uploading...</span>
                    ) : (
                      <>
                        <span className="block text-gray-500 text-sm">Click to upload a headshot photo</span>
                        <span className="block text-gray-400 text-xs mt-1">JPG, PNG — max 5MB</span>
                      </>
                    )}
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleHeadshotChange} className="hidden" />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="button"
                onClick={handleSaveSection1}
                disabled={saving}
                className="w-full bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {saving ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Section 2: What You Specialize In ---
  if (step === 2) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <ProgressBar />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-green-700 mb-1">What You Specialize In</h2>
            <p className="text-sm text-gray-500 mb-6">
              This helps us match you with the right buyers and listings.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Types</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PROPERTY_TYPES.map(pt => (
                    <label key={pt} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.property_types.includes(pt)}
                        onChange={() => toggleArrayField('property_types', pt)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{pt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <div className="flex gap-2">
                  {['Buyers', 'Sellers', 'Both'].map(tt => (
                    <button
                      key={tt}
                      type="button"
                      onClick={() => setDraft(prev => ({ ...prev, transaction_types: [tt] }))}
                      className={`flex-1 py-2 px-4 rounded border font-medium text-sm transition-colors ${
                        draft.transaction_types.includes(tt)
                          ? 'bg-green-700 text-white border-green-700'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {tt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regions Most Active In</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REGIONS.map(r => (
                    <label key={r.code} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.primary_regions.includes(r.code)}
                        onChange={() => toggleArrayField('primary_regions', r.code)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Neighborhoods</label>
                <input
                  type="text"
                  value={draft.primary_neighborhoods.join(', ')}
                  onChange={e => setDraft(prev => ({
                    ...prev,
                    primary_neighborhoods: e.target.value ? e.target.value.split(',').map(s => s.trim()) : [],
                  }))}
                  placeholder="e.g. Bel Air, Kitty, Campbellville"
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (USD)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      min="0"
                      max="2000000"
                      step="10000"
                      value={draft.price_range_min_usd ?? 0}
                      onChange={e => setDraft(prev => ({
                        ...prev,
                        price_range_min_usd: e.target.value ? parseInt(e.target.value, 10) : 0,
                      }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      min="0"
                      max="2000000"
                      step="10000"
                      value={draft.price_range_max_usd ?? 2000000}
                      onChange={e => setDraft(prev => ({
                        ...prev,
                        price_range_max_usd: e.target.value ? parseInt(e.target.value, 10) : 2000000,
                      }))}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>${(draft.price_range_min_usd ?? 0).toLocaleString()}</span>
                  <span>${(draft.price_range_max_usd ?? 2000000).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niche Expertise (optional)</label>
                <input
                  type="text"
                  value={draft.niche_expertise}
                  onChange={e => setDraft(prev => ({ ...prev, niche_expertise: e.target.value }))}
                  placeholder="e.g. Waterfront properties, agricultural land"
                  className={inputClass}
                />
              </div>

              <NavButtons onSave={handleSaveSection2} backStep={1} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Section 3: Who You Serve Best ---
  if (step === 3) {
    const showDiasporaCities = draft.buyer_types.includes('Guyanese diaspora buyers living abroad')

    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <ProgressBar />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-green-700 mb-1">Who You Serve Best</h2>
            <p className="text-sm text-gray-500 mb-6">
              Help us understand your ideal buyer so we can route the right leads to you.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Types</label>
                <div className="space-y-3">
                  {BUYER_TYPES.map(bt => (
                    <label key={bt} className="flex items-start space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.buyer_types.includes(bt)}
                        onChange={() => toggleArrayField('buyer_types', bt)}
                        className="h-4 w-4 mt-0.5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{bt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {showDiasporaCities && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diaspora Cities</label>
                  <p className="text-xs text-gray-400 mb-2">Which diaspora markets do you serve?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DIASPORA_CITIES.map(city => (
                      <label key={city} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.diaspora_cities.includes(city)}
                          onChange={() => toggleArrayField('diaspora_cities', city)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Community or Cultural Ties (optional)</label>
                <textarea
                  value={draft.community_ties}
                  onChange={e => setDraft(prev => ({ ...prev, community_ties: e.target.value }))}
                  placeholder="e.g. Active member of the Indo-Guyanese community in Queens, NY"
                  rows={3}
                  className={inputClass}
                />
              </div>

              <NavButtons onSave={handleSaveSection3} backStep={2} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Section 4: Your Track Record ---
  if (step === 4) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <ProgressBar />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-green-700 mb-1">Your Track Record</h2>
            <p className="text-sm text-gray-500 mb-6">
              Share your experience. This builds trust with buyers on the platform.
            </p>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Transactions</label>
                  <input
                    type="number"
                    min="0"
                    value={draft.total_transactions ?? ''}
                    onChange={e => setDraft(prev => ({
                      ...prev,
                      total_transactions: e.target.value ? parseInt(e.target.value, 10) : null,
                    }))}
                    placeholder="e.g. 50"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last 12 Months</label>
                  <input
                    type="number"
                    min="0"
                    value={draft.transactions_12mo ?? ''}
                    onChange={e => setDraft(prev => ({
                      ...prev,
                      transactions_12mo: e.target.value ? parseInt(e.target.value, 10) : null,
                    }))}
                    placeholder="e.g. 8"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average Days from Listing to Close (optional)</label>
                <input
                  type="number"
                  min="0"
                  value={draft.avg_days_to_close ?? ''}
                  onChange={e => setDraft(prev => ({
                    ...prev,
                    avg_days_to_close: e.target.value ? parseInt(e.target.value, 10) : null,
                  }))}
                  placeholder="e.g. 45"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Neighborhoods with Notable Sales</label>
                <input
                  type="text"
                  value={draft.notable_neighborhoods.join(', ')}
                  onChange={e => setDraft(prev => ({
                    ...prev,
                    notable_neighborhoods: e.target.value ? e.target.value.split(',').map(s => s.trim()) : [],
                  }))}
                  placeholder="e.g. Bel Air Park, Kitty, Diamond"
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications or Designations</label>
                <input
                  type="text"
                  value={draft.certifications.join(', ')}
                  onChange={e => setDraft(prev => ({
                    ...prev,
                    certifications: e.target.value ? e.target.value.split(',').map(s => s.trim()) : [],
                  }))}
                  placeholder="e.g. Licensed Realtor, CIPS"
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Awards or Recognition (optional)</label>
                <textarea
                  value={draft.awards}
                  onChange={e => setDraft(prev => ({ ...prev, awards: e.target.value }))}
                  placeholder="Any awards, recognitions, or notable achievements"
                  rows={2}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anything You Are Proud Of (optional)</label>
                <textarea
                  value={draft.notable_transactions}
                  onChange={e => setDraft(prev => ({ ...prev, notable_transactions: e.target.value }))}
                  placeholder="Notable deals, community impact, client success stories"
                  rows={2}
                  className={inputClass}
                />
              </div>

              <NavButtons onSave={handleSaveSection4} backStep={3} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Section 5: Contact Preferences ---
  if (step === 5) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <ProgressBar />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-green-700 mb-1">Contact Preferences</h2>
            <p className="text-sm text-gray-500 mb-6">
              How should buyers and our team reach you?
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={e => setDraft(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+592-000-0000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={draft.email}
                  readOnly
                  className={`${inputClass} bg-gray-50 text-gray-500`}
                />
                <p className="text-xs text-gray-400 mt-1">This is the email you signed up with</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (optional)</label>
                <input
                  type="tel"
                  value={draft.whatsapp}
                  onChange={e => setDraft(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="+592-000-0000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                <div className="flex gap-2">
                  {['Phone', 'Email', 'WhatsApp'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setDraft(prev => ({ ...prev, preferred_contact: method.toLowerCase() }))}
                      className={`flex-1 py-2 px-4 rounded border font-medium text-sm transition-colors ${
                        draft.preferred_contact === method.toLowerCase()
                          ? 'bg-green-700 text-white border-green-700'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <NavButtons onSave={handleFinalSubmit} backStep={4} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
