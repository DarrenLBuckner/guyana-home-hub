'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// WhatsApp Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn('h-5 w-5 fill-current', className)}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

// Facebook Icon
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn('h-5 w-5 fill-current', className)}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

interface ShareProperty {
  id: string
  title: string
  price?: number
  currency?: string
  listing_type?: 'sale' | 'rent' | 'lease' | 'short_term_rent'
  property_type?: string
  city?: string
  region?: string
  location?: string
}

interface ShareButtonsProps {
  property: ShareProperty
  variant?: 'inline' | 'menu' | 'mobile'
  className?: string
}

function getShareData(property: ShareProperty) {
  const url = `https://www.guyanahomehub.com/properties/${property.id}`

  // Format price
  const currency = property.currency || 'GYD'
  const priceFormatted = property.price?.toLocaleString() || 'Contact for price'
  const isRental = property.listing_type === 'rent' || property.listing_type === 'short_term_rent'
  const priceDisplay = isRental
    ? `${priceFormatted} ${currency}/month`
    : `${priceFormatted} ${currency}`

  // Location
  const location = [property.city, property.region].filter(Boolean).join(', ')

  // Build WhatsApp message
  const listingType = isRental ? 'For Rent' : 'For Sale'
  const whatsappText = `Check out this property on Guyana Home Hub!\n\n${property.title}\n${listingType} • ${priceDisplay}${location ? ` • ${location}` : ''}\n\n${url}`

  return {
    url,
    whatsappText,
    encodedWhatsappText: encodeURIComponent(whatsappText),
    encodedUrl: encodeURIComponent(url)
  }
}

export function ShareButtons({ property, variant = 'inline', className = '' }: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const shareData = getShareData(property)

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${shareData.encodedWhatsappText}`,
      '_blank',
      'noopener,noreferrer'
    )
    setIsOpen(false)
  }

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareData.encodedUrl}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
    setIsOpen(false)
  }

  // Mobile variant - WhatsApp prominent, Facebook secondary
  if (variant === 'mobile') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {/* Prominent WhatsApp button */}
        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-sm"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span>Share</span>
        </button>

        {/* Secondary Facebook button - icon only */}
        <button
          onClick={handleFacebookShare}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <FacebookIcon className="h-5 w-5" />
        </button>
      </div>
    )
  }

  // Inline variant - shows both buttons directly
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={handleFacebookShare}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          aria-label="Share on Facebook"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </button>
      </div>
    )
  }

  // Menu variant - single share button that expands to show options
  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Share property"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
          >
            <WhatsAppIcon className="text-green-500" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleFacebookShare}
            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
          >
            <FacebookIcon className="text-blue-600" />
            <span>Facebook</span>
          </button>
        </div>
      )}
    </div>
  )
}
