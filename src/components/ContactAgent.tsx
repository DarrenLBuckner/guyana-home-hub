'use client'

import { useState } from 'react'
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Send, 
  X, 
  User,
  Calendar,
  Info,
  Heart,
  CheckCircle
} from 'lucide-react'

interface Property {
  id: string
  title: string
  location: string
  price: number
  price_type?: string
  contact_name?: string
  contact_phone?: string
  contact_email?: string
}

interface ContactAgentProps {
  property: Property
  isModal?: boolean
  onCloseAction?: () => void
}

export default function ContactAgent({ property, isModal = false, onCloseAction }: ContactAgentProps) {
  const [isOpen, setIsOpen] = useState(!isModal)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    message: '',
    inquiry_type: 'general',
    preferred_contact: 'email'
  })

  const handleClose = () => {
    setIsOpen(false)
    if (onCloseAction) onCloseAction()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: property.id,
          ...formData
        })
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        // Reset form after successful submission
        setTimeout(() => {
          setSubmitted(false)
          setFormData({
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            message: '',
            inquiry_type: 'general',
            preferred_contact: 'email'
          })
          if (isModal) handleClose()
        }, 3000)
      } else {
        alert('Failed to send inquiry. Please try again.')
      }
    } catch (error) {
      console.error('Error sending inquiry:', error)
      alert('Failed to send inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const quickMessages = [
    {
      type: 'viewing',
      message: "Hi! I'm interested in viewing this property. When would be a good time to schedule a showing?"
    },
    {
      type: 'information',
      message: "Could you please provide more details about this property? I'd like to know more about the neighborhood and amenities."
    },
    {
      type: 'offer',
      message: "I'm very interested in this property and would like to discuss making an offer. Please contact me at your earliest convenience."
    }
  ]

  const ContactForm = () => (
    <div className="space-y-4">
      {submitted ? (
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Inquiry Sent Successfully!</h3>
          <p className="text-gray-600">
            The agent will receive your message and contact you soon using your preferred method.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Info Header */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{property.title}</h4>
            <p className="text-sm text-gray-600">{property.location}</p>
            <p className="text-lg font-bold text-green-600">
              GYD {property.price.toLocaleString()}{property.price_type === 'rent' ? '/month' : ''}
            </p>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Your phone number"
            />
          </div>

          {/* Inquiry Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inquiry Type
              </label>
              <select
                name="inquiry_type"
                value={formData.inquiry_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="general">General Inquiry</option>
                <option value="viewing">Schedule Viewing</option>
                <option value="information">Request Information</option>
                <option value="offer">Make an Offer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Contact Method
              </label>
              <select
                name="preferred_contact"
                value={formData.preferred_contact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Quick Message Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Message Templates
            </label>
            <div className="space-y-2">
              {quickMessages.map((template) => (
                <button
                  key={template.type}
                  type="button"
                  onClick={() => setFormData({ ...formData, message: template.message, inquiry_type: template.type })}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border text-sm"
                >
                  {template.message}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tell the agent about your interest in this property..."
            />
          </div>

          {/* Agent Contact Info */}
          {(property.contact_name || property.contact_phone || property.contact_email) && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Agent Contact Information</h5>
              <div className="space-y-1 text-sm text-blue-800">
                {property.contact_name && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {property.contact_name}
                  </div>
                )}
                {property.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href={`tel:${property.contact_phone}`} className="hover:underline">
                      {property.contact_phone}
                    </a>
                  </div>
                )}
                {property.contact_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${property.contact_email}`} className="hover:underline">
                      {property.contact_email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Inquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )

  if (isModal) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Contact Agent</h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <ContactForm />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Contact Agent</h3>
      </div>
      <ContactForm />
    </div>
  )
}
