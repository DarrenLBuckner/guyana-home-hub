'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [isGuides, setIsGuides] = useState(false)

  // Check if user has already seen popup or signed up
  useEffect(() => {
    // Detect if we're on guides pages
    setIsGuides(window.location.pathname.includes('/guides'))
    
    const hasSeenPopup = localStorage.getItem('guyana-exit-popup-seen')
    const lastSeenDate = localStorage.getItem('guyana-exit-popup-date')
    const hasSignedUp = localStorage.getItem('guyana-email-signup')
    
    // Don't show if already signed up
    if (hasSignedUp) {
      setHasTriggered(true)
      return
    }
    
    // Don't show if seen recently (within 30 days)
    if (hasSeenPopup && lastSeenDate) {
      const lastSeen = new Date(lastSeenDate)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      if (lastSeen > thirtyDaysAgo) {
        setHasTriggered(true)
        return
      }
    }

    // Set up exit intent detection
    let timeOnSite = 0
    const minTimeOnSite = 30000 // 30 seconds minimum

    const timer = setInterval(() => {
      timeOnSite += 1000
    }, 1000)

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of viewport and user has been on site long enough
      if (e.clientY <= 0 && timeOnSite >= minTimeOnSite && !hasTriggered) {
        setIsVisible(true)
        setHasTriggered(true)
        localStorage.setItem('guyana-exit-popup-seen', 'true')
        localStorage.setItem('guyana-exit-popup-date', new Date().toISOString())
      }
    }

    // Also trigger on scroll down significantly (alternative detection)
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      maxScroll = Math.max(maxScroll, scrollPercent)
      
      // If user scrolled 60%+ and has been on site 45+ seconds, consider them engaged
      if (maxScroll >= 60 && timeOnSite >= 45000 && !hasTriggered) {
        // Small delay then trigger on next mouse movement toward top
        setTimeout(() => {
          document.addEventListener('mousemove', handlePotentialExit)
        }, 2000)
      }
    }

    const handlePotentialExit = (e: MouseEvent) => {
      if (e.clientY <= 100 && !hasTriggered) { // Mouse near top of page
        setIsVisible(true)
        setHasTriggered(true)
        localStorage.setItem('guyana-exit-popup-seen', 'true')
        localStorage.setItem('guyana-exit-popup-date', new Date().toISOString())
        document.removeEventListener('mousemove', handlePotentialExit)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousemove', handlePotentialExit)
    }
  }, [hasTriggered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'exit-intent-popup',
          site: 'guyana',
          pageUrl: window.location.href,
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        localStorage.setItem('guyana-email-signup', 'true')
        
        // Close popup after 3 seconds
        setTimeout(() => {
          setIsVisible(false)
        }, 3000)
      } else {
        throw new Error('Failed to sign up')
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('Sorry, something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center pt-8 pb-4 px-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Wait! Don't Miss Out
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {isGuides 
                  ? "Get our complete Property Buying Guide delivered to your inbox. Essential reading for anyone considering Guyana real estate."
                  : "Join thousands of diaspora members who get insider tips for buying property in Guyana safely from abroad."
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-8">
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </span>
                  ) : (
                    "Get Free Property Guide"
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  ✅ No spam • ✅ Unsubscribe anytime • ✅ Trusted by 1000+ investors
                </p>
              </div>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              You're All Set! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Check your email for your Property Buying Guide and exclusive tips.
            </p>
            <p className="text-sm text-gray-500">
              This window will close automatically...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}