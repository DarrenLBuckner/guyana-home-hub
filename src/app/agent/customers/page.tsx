'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Tag,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  AlertCircle,
  Home
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  source: string
  stage: string
  value: number
  lastContact: string
  nextFollowUp?: string
  tags: string[]
  notes: string
  inquiries: number
  conversions: number
  responseRate: number
  created_at: string
}

export default function AgentCRM() {
  const router = useRouter()
  const supabase = createClient()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showAddCustomer, setShowAddCustomer] = useState(false)

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
      fetchCustomers()
    }
  }, [user])

  const fetchCustomers = async () => {
    try {
      // Mock data for demonstration (replace with real CRM API)
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+592-123-4567',
          source: 'Website',
          stage: 'qualified',
          value: 25000000,
          lastContact: '2025-07-20',
          nextFollowUp: '2025-07-23',
          tags: ['Hot Lead', 'Georgetown', 'First Time Buyer'],
          notes: 'Looking for family home in Georgetown. Budget up to 25M. Has pre-approval.',
          inquiries: 3,
          conversions: 0,
          responseRate: 100,
          created_at: '2025-07-15'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@business.com',
          phone: '+592-234-5678',
          source: 'Referral',
          stage: 'negotiating',
          value: 45000000,
          lastContact: '2025-07-21',
          nextFollowUp: '2025-07-22',
          tags: ['Commercial', 'Investor', 'High Value'],
          notes: 'Commercial property investor. Interested in office buildings.',
          inquiries: 5,
          conversions: 1,
          responseRate: 80,
          created_at: '2025-07-10'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.r@gmail.com',
          phone: '+592-345-6789',
          source: 'Social Media',
          stage: 'contacted',
          value: 15000000,
          lastContact: '2025-07-19',
          nextFollowUp: '2025-07-25',
          tags: ['Rental', 'Young Professional'],
          notes: 'Looking for modern apartment for rent. Works in Georgetown.',
          inquiries: 2,
          conversions: 0,
          responseRate: 50,
          created_at: '2025-07-18'
        }
      ]

      setCustomers(mockCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'lead': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'negotiating': return 'bg-orange-100 text-orange-800'
      case 'closed': return 'bg-purple-100 text-purple-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceIcon = (source: string) => {
    switch(source) {
      case 'Website': return '🌐'
      case 'Referral': return '👥'
      case 'Social Media': return '📱'
      case 'Phone': return '📞'
      case 'Email': return '📧'
      default: return '📋'
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStage = filterStage === 'all' || customer.stage === filterStage
    return matchesSearch && matchesStage
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading CRM...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Customer CRM</h1>
              <p className="text-sm text-gray-600">{filteredCustomers.length} customers</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddCustomer(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Customer</span>
              </button>
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select 
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Stages</option>
              <option value="lead">Lead</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="negotiating">Negotiating</option>
              <option value="closed">Closed</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* CRM Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  GYD {customers.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(customers.reduce((sum, c) => sum + c.responseRate, 0) / customers.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.reduce((sum, c) => sum + c.conversions, 0)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Customer Pipeline</h3>
          </div>
          
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">Start building your customer base by adding new contacts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Follow-up
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-medium">
                                {customer.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(customer.stage)}`}>
                          {customer.stage.toUpperCase()}
                        </span>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className="mr-1">{getSourceIcon(customer.source)}</span>
                          {customer.source}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          GYD {customer.value.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.inquiries} inquiries • {customer.conversions} conversions
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Last: {new Date(customer.lastContact).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Response: {customer.responseRate}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.nextFollowUp ? (
                          <div className={`text-sm ${
                            new Date(customer.nextFollowUp) < new Date() 
                              ? 'text-red-600 font-medium' 
                              : 'text-gray-900'
                          }`}>
                            {new Date(customer.nextFollowUp).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setSelectedCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <a 
                            href={`mailto:${customer.email}`}
                            className="text-green-600 hover:text-green-900"
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                          {customer.phone && (
                            <a 
                              href={`tel:${customer.phone}`}
                              className="text-green-600 hover:text-green-900"
                              title="Call"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          )}
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold text-xl">
                        {selectedCustomer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                      <p className="text-gray-600">{selectedCustomer.email}</p>
                      {selectedCustomer.phone && (
                        <p className="text-gray-600">{selectedCustomer.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stage</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStageColor(selectedCustomer.stage)}`}>
                        {selectedCustomer.stage.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Value</label>
                      <p className="text-lg font-semibold text-gray-900">
                        GYD {selectedCustomer.value.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <p className="bg-gray-50 p-4 rounded-lg text-gray-700">{selectedCustomer.notes}</p>
                  </div>

                  <div className="flex space-x-4">
                    <a 
                      href={`mailto:${selectedCustomer.email}`}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                    {selectedCustomer.phone && (
                      <a 
                        href={`tel:${selectedCustomer.phone}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    )}
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
