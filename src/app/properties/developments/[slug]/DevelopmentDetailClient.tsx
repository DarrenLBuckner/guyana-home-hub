'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { buildDevelopmentMessage, buildWhatsAppUrl as buildWAUrl } from '@/lib/whatsapp'
import {
  MapPin,
  Building2,
  Users,
  Calendar,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  Star,
  Check,
  Play,
} from 'lucide-react'

interface Development {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  developer_name: string | null
  developer_logo: string | null
  developer_website: string | null
  notable_partners: string | null
  location_area: string | null
  city: string | null
  region: string | null
  development_type: string | null
  total_units: number | null
  units_available: number | null
  price_from: number | null
  price_to: number | null
  currency: string | null
  status: string | null
  construction_start: string | null
  expected_completion: string | null
  amenities: string[] | null
  key_features: string[] | null
  hero_image: string | null
  hero_image_mobile: string | null
  gallery_images: string[] | null
  floor_plan_images: string[] | null
  video_url: string | null
  virtual_tour_url: string | null
  contact_phone: string | null
  contact_email: string | null
  contact_whatsapp: string | null
  sales_office_address: string | null
  featured: boolean
}

const STATUS_MAP: Record<string, string> = {
  pre_construction: 'Pre-Construction',
  under_construction: 'Under Construction',
  selling: 'Now Selling',
  sold_out: 'Sold Out',
  completed: 'Completed',
}

const STATUS_STYLES: Record<string, string> = {
  pre_construction: 'bg-blue-100 text-blue-800',
  under_construction: 'bg-yellow-100 text-yellow-800',
  selling: 'bg-green-100 text-green-800',
  sold_out: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
}

const TYPE_LABELS: Record<string, string> = {
  condominium: 'Condominium',
  townhouse: 'Townhouse',
  single_family: 'Single Family',
  mixed_use: 'Mixed Use',
  gated_community: 'Gated Community',
  commercial: 'Commercial',
}

function formatPrice(price: number, currency: string): string {
  if (currency === 'GYD') return `GYD ${(price / 1_000_000).toFixed(1)}M`
  return `$${price.toLocaleString()}`
}

function whatsappUrl(number: string, devName: string, devSlug: string): string {
  const message = buildDevelopmentMessage({ developmentName: devName, slug: devSlug })
  return buildWAUrl(number, message)
}

export default function DevelopmentDetailClient({ slug }: { slug: string }) {
  const [dev, setDev] = useState<Development | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/developments/${slug}`)
        const json = await res.json()
        if (json.success) {
          setDev(json.development)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading development...</p>
        </div>
      </div>
    )
  }

  if (error || !dev) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Development Not Found</h2>
          <p className="text-gray-600 mb-6">
            The development you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/properties/developments"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Browse All Developments
          </Link>
        </div>
      </div>
    )
  }

  const location = [dev.location_area, dev.city, dev.region].filter(Boolean).join(', ')
  const currency = dev.currency || 'USD'
  const statusLabel = STATUS_MAP[dev.status || ''] || dev.status || 'Coming Soon'
  const statusStyle = STATUS_STYLES[dev.status || ''] || 'bg-gray-100 text-gray-800'
  const typeLabel = TYPE_LABELS[dev.development_type || ''] || dev.development_type || ''

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-900 overflow-hidden">
        {dev.hero_image || dev.hero_image_mobile ? (
          <>
            {/* Blurred background fill — prevents letterbox gaps for non-landscape images */}
            <img
              src={dev.hero_image || dev.hero_image_mobile || ''}
              alt=""
              className="hidden md:block absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-50"
              aria-hidden="true"
            />
            <picture className="relative block w-full h-full">
              {dev.hero_image_mobile && (
                <source media="(max-width: 767px)" srcSet={dev.hero_image_mobile} />
              )}
              <img
                src={dev.hero_image || dev.hero_image_mobile || ''}
                alt={dev.name}
                className="w-full h-full object-cover md:object-contain"
              />
            </picture>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <Building2 className="w-24 h-24 text-gray-300" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Link
            href="/properties/developments"
            className="inline-flex items-center gap-1 bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition shadow"
          >
            <ChevronLeft className="w-4 h-4" />
            All Developments
          </Link>
        </div>

        {/* Status + Featured badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {dev.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1 shadow">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              Featured
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium shadow ${statusStyle}`}>
            {statusLabel}
          </span>
        </div>

        {/* Title overlay on hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {dev.name}
            </h1>
            {dev.tagline && (
              <p className="text-lg md:text-xl text-white/90 drop-shadow">{dev.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content — left 2/3 */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick stats bar */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {location}
                </div>
              )}
              {typeLabel && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-green-600" />
                  {typeLabel}
                </div>
              )}
              {dev.total_units != null && dev.total_units > 0 && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-green-600" />
                  {dev.total_units.toLocaleString()} units
                </div>
              )}
              {dev.expected_completion && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Expected {new Date(dev.expected_completion).getFullYear()}
                </div>
              )}
            </div>

            {/* Developer + Partners */}
            <div className="flex flex-wrap items-center gap-3">
              {dev.developer_name && (
                <span className="text-sm text-gray-700">
                  by <span className="font-semibold">{dev.developer_name}</span>
                </span>
              )}
              {dev.notable_partners && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  {dev.notable_partners}
                </span>
              )}
            </div>

            {/* Description */}
            {dev.description && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Development</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {dev.description}
                </p>
              </div>
            )}

            {/* Key Features */}
            {dev.key_features && dev.key_features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dev.key_features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Amenities */}
            {dev.amenities && dev.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {dev.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {dev.gallery_images && dev.gallery_images.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dev.gallery_images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${dev.name} gallery ${i + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {dev.video_url && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Tour</h2>
                <a
                  href={dev.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-lg transition font-medium"
                >
                  <Play className="w-5 h-5" />
                  Watch Video
                </a>
              </div>
            )}
          </div>

          {/* Sidebar — right 1/3 */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-20">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Price Range</p>
                <p className="text-2xl font-bold text-green-600">
                  {dev.price_from && dev.price_to
                    ? `${formatPrice(dev.price_from, currency)} - ${formatPrice(dev.price_to, currency)}`
                    : dev.price_from
                      ? `From ${formatPrice(dev.price_from, currency)}`
                      : 'Contact for pricing'}
                </p>
                <p className="text-xs text-gray-400 mt-1">{currency}</p>
              </div>

              {dev.units_available != null && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      {dev.units_available.toLocaleString()}
                    </span>{' '}
                    units available
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-600 space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle}`}>
                    {statusLabel}
                  </span>
                </div>
                {typeLabel && (
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="font-medium text-gray-900">{typeLabel}</span>
                  </div>
                )}
                {dev.expected_completion && (
                  <div className="flex justify-between">
                    <span>Completion</span>
                    <span className="font-medium text-gray-900">
                      {new Date(dev.expected_completion).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                {dev.contact_whatsapp && (
                  <a
                    href={whatsappUrl(dev.contact_whatsapp, dev.name, dev.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.101" />
                    </svg>
                    WhatsApp Inquiry
                  </a>
                )}

                {dev.contact_phone && (
                  <a
                    href={`tel:${dev.contact_phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-3 px-4 rounded-lg font-medium transition"
                  >
                    <Phone className="w-4 h-4" />
                    {dev.contact_phone}
                  </a>
                )}

                {dev.contact_email && (
                  <a
                    href={`mailto:${dev.contact_email}?subject=Inquiry about ${dev.name}`}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-3 px-4 rounded-lg font-medium transition"
                  >
                    <Mail className="w-4 h-4" />
                    Email Sales
                  </a>
                )}

                {dev.developer_website && (
                  <a
                    href={dev.developer_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition"
                  >
                    <Globe className="w-4 h-4" />
                    Developer Website
                  </a>
                )}
              </div>

              {dev.sales_office_address && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-1">Sales Office</p>
                  <p className="text-sm text-gray-700">{dev.sales_office_address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
