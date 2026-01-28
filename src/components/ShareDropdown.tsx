'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Link, Mail, Check, X } from 'lucide-react'
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

// Twitter/X Icon
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn('h-5 w-5 fill-current', className)}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
  neighborhood?: string
}

interface ShareDropdownProps {
  property: ShareProperty
  className?: string
}

// Toast notification component
function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
        <Check className="h-5 w-5" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}

function getShareData(property: ShareProperty) {
  const url = typeof window !== 'undefined'
    ? window.location.href
    : `https://www.guyanahomehub.com/properties/${property.id}`

  // Format price
  const currency = property.currency || 'GYD'
  const priceFormatted = property.price?.toLocaleString() || 'Contact for price'
  const isRental = property.listing_type === 'rent' || property.listing_type === 'short_term_rent'
  const priceDisplay = isRental
    ? `${priceFormatted} ${currency}/month`
    : `${priceFormatted} ${currency}`

  // Location
  const location = [property.neighborhood, property.city, property.region].filter(Boolean).join(', ')

  // Build share text
  const listingType = isRental ? 'For Rent' : 'For Sale'

  return {
    url,
    title: property.title,
    priceDisplay,
    listingType,
    location,
  }
}

export function ShareDropdown({ property, className = '' }: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const shareData = getShareData(property)

  // Detect mobile device
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

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

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      setShowToast(true)
      setIsOpen(false)
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareData.url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowToast(true)
      setIsOpen(false)
    }
  }

  // Share on WhatsApp
  const handleWhatsAppShare = () => {
    const text = `Check out this property on Guyana Home Hub!\n\n${shareData.title}\n${shareData.listingType} - ${shareData.priceDisplay}${shareData.location ? `\n${shareData.location}` : ''}\n\n${shareData.url}`
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    )
    setIsOpen(false)
  }

  // Share on Facebook
  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
    setIsOpen(false)
  }

  // Share on Twitter/X
  const handleTwitterShare = () => {
    const text = `Check out this property: ${shareData.title} - ${shareData.priceDisplay}`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
    setIsOpen(false)
  }

  // Share via Email
  const handleEmailShare = () => {
    const subject = `Property: ${shareData.title}`
    const body = `I found this property on Guyana Home Hub that you might be interested in:\n\n${shareData.title}\n${shareData.listingType} - ${shareData.priceDisplay}${shareData.location ? `\nLocation: ${shareData.location}` : ''}\n\nView it here: ${shareData.url}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setIsOpen(false)
  }

  // Native share (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: `Check out this property: ${shareData.title} - ${shareData.priceDisplay}`,
          url: shareData.url
        })
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', err)
      }
    }
    setIsOpen(false)
  }

  return (
    <>
      <div className={cn('relative', className)} ref={menuRef}>
        {/* Share Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          aria-label="Share property"
          aria-expanded={isOpen}
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
            {/* Copy Link - Primary option */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Link className="h-5 w-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Copy Link</span>
            </button>

            <div className="border-t border-gray-100 my-1" />

            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="p-1.5 bg-green-100 rounded-lg">
                <WhatsAppIcon className="text-green-600" />
              </div>
              <span className="text-gray-700">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <FacebookIcon className="text-blue-600" />
              </div>
              <span className="text-gray-700">Facebook</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={handleTwitterShare}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="p-1.5 bg-gray-900 rounded-lg">
                <TwitterIcon className="text-white" />
              </div>
              <span className="text-gray-700">Twitter / X</span>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-gray-700">Email</span>
            </button>

            {/* Native Share - Mobile only */}
            {isMobile && typeof navigator !== 'undefined' && navigator.share && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <Share2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-gray-700">More options...</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message="Link copied!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
