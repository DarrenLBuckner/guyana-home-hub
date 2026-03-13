'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'qrcode'

interface Agent {
  id: string
  slug: string
  full_name: string
  profile_image: string | null
  phone: string | null
  email: string | null
  company: string | null
  is_founding_member: boolean
  is_verified_agent: boolean
  is_premium_agent: boolean
  active_listing_count: number
  years_experience: number | null
}

interface Listing {
  id: string
  title: string
  price: number
  currency: string
  bedrooms: number | null
  bathrooms: number | null
  area_sqft: number | null
  city: string | null
  region: string | null
  listing_type: string
  slug: string | null
  image: string | null
}

interface Vetting {
  bio: string | null
  specialties: string[]
  target_region: string | null
}

interface AgentProfileClientProps {
  agent: Agent
  listings: Listing[]
  vetting: Vetting | null
  slug: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatPrice(price: number, currency: string) {
  const symbol = currency === 'USD' ? '$' : currency === 'GYD' ? 'G$' : currency
  return `${symbol}${price.toLocaleString()}`
}

function cleanPhone(phone: string) {
  return phone.replace(/[^0-9+]/g, '')
}

export default function AgentProfileClient({ agent, listings: rawListings, vetting, slug }: AgentProfileClientProps) {
  const listings = Array.isArray(rawListings) ? rawListings : []
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [filter, setFilter] = useState<'all' | 'sale' | 'rent'>('all')
  const profileUrl = `https://www.guyanahomehub.com/agents/${slug}`

  const filteredListings = listings.filter((l) => {
    if (filter === 'sale') return l.listing_type === 'sale'
    if (filter === 'rent') return l.listing_type === 'rent'
    return true
  })

  const saleCount = listings.filter((l) => l.listing_type === 'sale').length
  const rentCount = listings.filter((l) => l.listing_type === 'rent').length

  useEffect(() => {
    QRCode.toDataURL(profileUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#059669', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [profileUrl])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${agent.full_name} | Guyana HomeHub`, url: profileUrl })
        return
      } catch {
        // fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappLink = agent.phone ? `https://wa.me/${cleanPhone(agent.phone)}` : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section — compact, agent info */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            {/* Profile Image */}
            <div className="shrink-0">
              {agent.profile_image ? (
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-3 ring-emerald-600 shadow-xl">
                  <Image
                    src={agent.profile_image}
                    alt={agent.full_name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-600 flex items-center justify-center ring-3 ring-emerald-500 shadow-xl">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {getInitials(agent.full_name)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{agent.full_name}</h1>
              {agent.company && (
                <p className="text-gray-300 mb-2">{agent.company}</p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {agent.is_founding_member && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    Founding Member
                  </span>
                )}
                {agent.is_verified_agent && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Verified Agent
                  </span>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    WhatsApp
                  </a>
                )}
                {agent.phone && (
                  <a
                    href={`tel:${cleanPhone(agent.phone)}`}
                    className="inline-flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Call
                  </a>
                )}
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="inline-flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email
                  </a>
                )}
              </div>
            </div>

            {/* Stats — right side on desktop */}
            <div className="flex sm:flex-col gap-6 sm:gap-3 text-center sm:text-right shrink-0">
              <div>
                <p className="text-2xl font-bold text-emerald-400">{agent.active_listing_count}</p>
                <p className="text-xs text-gray-400">Active Listings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {agent.years_experience ? `${agent.years_experience}+` : '\u2014'}
                </p>
                <p className="text-xs text-gray-400">Years Exp.</p>
              </div>
              {agent.is_founding_member && (
                <div>
                  <p className="text-2xl font-bold text-amber-400">Yes</p>
                  <p className="text-xs text-gray-400">Founding</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Bio + Specialties — compact row */}
        {(vetting?.bio || vetting?.specialties?.length || vetting?.target_region) && (
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            {vetting?.bio && (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-3">{vetting.bio}</p>
            )}
            {(vetting?.specialties?.length || vetting?.target_region) && (
              <div className="flex flex-wrap gap-2">
                {vetting?.specialties?.map((s) => (
                  <span key={s} className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {s}
                  </span>
                ))}
                {vetting?.target_region && (
                  <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {vetting.target_region}
                  </span>
                )}
              </div>
            )}
          </section>
        )}

        {/* ═══ LISTINGS GRID — PRIMARY CONTENT ═══ */}
        <section>
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                filter === 'all'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({listings.length})
            </button>
            {saleCount > 0 && (
              <button
                onClick={() => setFilter('sale')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  filter === 'sale'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                For Sale ({saleCount})
              </button>
            )}
            {rentCount > 0 && (
              <button
                onClick={() => setFilter('rent')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  filter === 'rent'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                For Rent ({rentCount})
              </button>
            )}
          </div>

          {/* Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/properties/${listing.slug || listing.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl border border-gray-200 hover:border-green-300 transition-all duration-300 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-gray-100">
                    {listing.image ? (
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 22V12h6v10" /></svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`text-white px-2.5 py-1 rounded text-xs font-semibold ${
                        listing.listing_type === 'rent' ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}>
                        {listing.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xl font-bold text-emerald-600 mb-1">
                      {formatPrice(listing.price, listing.currency)}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{listing.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {[listing.city, listing.region].filter(Boolean).join(', ')}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {listing.bedrooms != null && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
                          {listing.bedrooms} bd
                        </span>
                      )}
                      {listing.bathrooms != null && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                          {listing.bathrooms} ba
                        </span>
                      )}
                      {listing.area_sqft != null && (
                        <span>{listing.area_sqft.toLocaleString()} sqft</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <p className="text-gray-500">No active listings{filter !== 'all' ? ` for ${filter === 'sale' ? 'sale' : 'rent'}` : ''}</p>
            </div>
          )}
        </section>

        {/* QR Code + Share — bottom of page */}
        <section className="flex flex-col sm:flex-row items-center gap-5 bg-white rounded-lg border border-gray-200 p-5">
          {qrDataUrl && (
            <div className="shrink-0">
              <img src={qrDataUrl} alt="QR Code" className="w-28 h-28" />
            </div>
          )}
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Share this agent&apos;s profile</h3>
            <p className="text-xs text-gray-500 mb-2">Scan the QR code or copy the link to share {agent.full_name}&apos;s listings.</p>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
