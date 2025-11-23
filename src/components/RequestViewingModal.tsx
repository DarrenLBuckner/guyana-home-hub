'use client'

// NOTE: For local testing, Portal Home Hub API needs CORS configured
// Production URL: https://portal-home-hub.com
// Dev testing: Use PowerShell/Postman to test API directly

import { useState } from 'react'
import { 
  X, 
  User,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle,
  Building,
  Shield,
  ExternalLink
} from 'lucide-react'

interface Property {
  id: string
  title: string
  city?: string
  region?: string
  location?: string
  agent_profile?: {
    id: string
    first_name: string
    last_name: string
    phone: string
    profile_image?: string
    company?: string
    user_type?: string
  }
}

interface RequestViewingModalProps {
  property: Property
  isOpen: boolean
  onClose: () => void
}

export default function RequestViewingModal({ property, isOpen, onClose }: RequestViewingModalProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    visitorMessage: 'I would like to schedule a viewing.'
  })

  const handleClose = () => {
    if (!loading) {
      setSubmitted(false)
      setError(null)
      setFormData({
        visitorName: '',
        visitorEmail: '',
        visitorPhone: '',
        visitorMessage: 'I would like to schedule a viewing.'
      })
      onClose()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Check if API URL is configured
    const apiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL
    if (!apiUrl) {
      setError('Viewing requests are temporarily unavailable. Please contact the property owner directly.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${apiUrl}/api/viewing-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          visitorName: formData.visitorName,
          visitorEmail: formData.visitorEmail,
          visitorPhone: formData.visitorPhone || null,
          visitorMessage: formData.visitorMessage
        })
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        // Close modal after 3 seconds
        setTimeout(() => {
          handleClose()
        }, 3000)
      } else {
        setError(result.error || result.message || 'Failed to submit viewing request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting viewing request:', error)
      setError('Failed to submit viewing request. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Get property location for display
  const propertyLocation = property.city && property.region 
    ? `${property.city}, ${property.region}` 
    : property.city || property.region || property.location || 'Location not specified'

  // Get contact person info
  const contactPerson = property.agent_profile
  const contactName = contactPerson 
    ? `${contactPerson.first_name} ${contactPerson.last_name}`
    : 'Property Owner'
  const isVerified = contactPerson?.user_type === 'admin' || contactPerson?.user_type === 'agent'

  if (!isOpen) return null

  // Guard against missing property data
  if (!property || !property.id) {
    console.error('RequestViewingModal: Missing property data')
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Request Property Viewing</h3>
            <p className="text-sm text-gray-600 mt-1">{propertyLocation}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Viewing Request Sent!</h3>
              <p className="text-gray-600 mb-4">
                Your viewing request has been sent to {contactName}. They will contact you soon to schedule the viewing.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 text-sm">
                  You'll receive a confirmation email shortly at <strong>{formData.visitorEmail}</strong>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Info Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900">{property.title}</h4>
                <p className="text-sm text-gray-600">{propertyLocation}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Contact Person Info */}
              {contactPerson && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Listed by {contactPerson.company ? `${contactPerson.company}` : 'Agent'}
                    {isVerified && (
                      <Shield className="h-4 w-4 ml-2 text-green-600" />
                    )}
                  </h5>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{contactName}</span>
                      {isVerified && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    {contactPerson.company && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        {contactPerson.company}
                      </div>
                    )}
                    {contactPerson.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${contactPerson.phone}`} className="hover:underline">
                          {contactPerson.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="visitorName"
                      value={formData.visitorName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="visitorEmail"
                      value={formData.visitorEmail}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="visitorPhone"
                    value={formData.visitorPhone}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="visitorMessage"
                    value={formData.visitorMessage}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Tell them about your interest and preferred viewing times..."
                  />
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <p className="mb-2">
                  By submitting this request, you agree to our{' '}
                  <a 
                    href="/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 underline inline-flex items-center"
                  >
                    Terms of Service
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>{' '}
                  and{' '}
                  <a 
                    href="/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 underline inline-flex items-center"
                  >
                    Privacy Policy
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>.
                </p>
                <p>
                  Your contact information will be shared with the property contact person to arrange the viewing.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.visitorName || !formData.visitorEmail}
                  className="flex-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" />
                      <span>Request Viewing</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}