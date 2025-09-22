'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MessageSquare, 
  User,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Reply,
  Archive,
  MoreVertical,
  Inbox,
  Send,
  Home,
  X
} from 'lucide-react'

interface Inquiry {
  id: string
  property_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  message: string
  inquiry_type: string
  preferred_contact: string
  status: string
  priority: string
  agent_notes?: string
  agent_response?: string
  responded_at?: string
  created_at: string
  updated_at: string
  properties: {
    title: string
    location: string
    price: number
    price_type?: string
    image_urls: string[]
    hero_index: number
  }
}

export default function AgentInquiries() {
  const router = useRouter()
  const supabase = createClient()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [responseText, setResponseText] = useState('')
  const [responding, setResponding] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/agent-login')
        return
      }
      setUser(user)
    }
    checkAuth()
  }, [supabase, router])

  useEffect(() => {
    if (user) {
      fetchInquiries()
    }
  }, [user, filterStatus])

  const fetchInquiries = async () => {
    try {
      const { data, error } = await fetch(`/api/inquiries?status=${filterStatus}&limit=50`).then(res => res.json())
      
      if (error) {
        console.error('Error fetching inquiries:', error)
      } else {
        setInquiries(data.inquiries || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (inquiryId: string, status: string, priority?: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, priority })
      })

      const result = await response.json()

      if (result.success) {
        fetchInquiries() // Refresh the list
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry(result.inquiry)
        }
      } else {
        alert('Failed to update inquiry status')
      }
    } catch (error) {
      console.error('Error updating inquiry:', error)
      alert('Failed to update inquiry status')
    }
  }

  const respondToInquiry = async (inquiryId: string) => {
    if (!responseText.trim()) {
      alert('Please enter a response message')
      return
    }

    setResponding(true)
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          agent_response: responseText,
          status: 'contacted'
        })
      })

      const result = await response.json()

      if (result.success) {
        setResponseText('')
        fetchInquiries()
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry(result.inquiry)
        }
        alert('Response sent successfully!')
      } else {
        alert('Failed to send response')
      }
    } catch (error) {
      console.error('Error sending response:', error)
      alert('Failed to send response')
    } finally {
      setResponding(false)
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.properties.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'new': return <Inbox className="h-4 w-4 text-blue-500" />
      case 'contacted': return <Send className="h-4 w-4 text-green-500" />
      case 'qualified': return <Star className="h-4 w-4 text-yellow-500" />
      case 'converted': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'not_interested': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'text-blue-600 bg-blue-100'
      case 'contacted': return 'text-green-600 bg-green-100'
      case 'qualified': return 'text-yellow-600 bg-yellow-100'
      case 'converted': return 'text-green-700 bg-green-200'
      case 'not_interested': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getInquiryTypeIcon = (type: string) => {
    switch(type) {
      case 'viewing': return <Calendar className="h-4 w-4" />
      case 'offer': return <Star className="h-4 w-4" />
      case 'information': return <MessageSquare className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
              <p className="text-sm text-gray-600">{filteredInquiries.length} inquiries</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/agent/home"
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="not_interested">Not Interested</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inquiries List */}
          <div className="lg:col-span-2">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No inquiries found</h3>
                <p className="text-gray-600">
                  {inquiries.length === 0 
                    ? 'When customers contact you about your properties, they will appear here.'
                    : 'Try adjusting your search or filters.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
                  <div 
                    key={inquiry.id} 
                    className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-md ${
                      selectedInquiry?.id === inquiry.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(inquiry.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      {/* Property Image */}
                      <div className="flex-shrink-0">
                        {inquiry.properties.image_urls && inquiry.properties.image_urls.length > 0 ? (
                          <img 
                            src={inquiry.properties.image_urls[inquiry.properties.hero_index] || inquiry.properties.image_urls[0]} 
                            alt={inquiry.properties.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Home className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Inquiry Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {getInquiryTypeIcon(inquiry.inquiry_type)}
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {inquiry.inquiry_type.replace('_', ' ')} Inquiry
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-1">{inquiry.properties.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{inquiry.properties.location}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {inquiry.customer_name}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {inquiry.customer_email}
                          </div>
                          {inquiry.customer_phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {inquiry.customer_phone}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inquiry Details Panel */}
          <div className="lg:col-span-1">
            {selectedInquiry ? (
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Inquiry Details</h3>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedInquiry.customer_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${selectedInquiry.customer_email}`} className="text-blue-600 hover:underline">
                        {selectedInquiry.customer_email}
                      </a>
                    </div>
                    {selectedInquiry.customer_phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`tel:${selectedInquiry.customer_phone}`} className="text-blue-600 hover:underline">
                          {selectedInquiry.customer_phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="capitalize">{selectedInquiry.preferred_contact}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Message</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedInquiry.message}</p>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'contacted')}
                      className="bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 text-sm"
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'qualified')}
                      className="bg-yellow-100 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-200 text-sm"
                    >
                      Mark Qualified
                    </button>
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'converted')}
                      className="bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 text-sm"
                    >
                      Mark Converted
                    </button>
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'not_interested')}
                      className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 text-sm"
                    >
                      Not Interested
                    </button>
                  </div>
                </div>

                {/* Response Section */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Send Response</h4>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response to the customer..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => respondToInquiry(selectedInquiry.id)}
                    disabled={responding || !responseText.trim()}
                    className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {responding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Reply className="h-4 w-4" />
                        <span>Send Response</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Previous Response */}
                {selectedInquiry.agent_response && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Your Previous Response</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-900">{selectedInquiry.agent_response}</p>
                      {selectedInquiry.responded_at && (
                        <p className="text-xs text-blue-600 mt-2">
                          Sent on {new Date(selectedInquiry.responded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Inquiry</h3>
                <p className="text-gray-600">Choose an inquiry from the list to view details and respond.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
