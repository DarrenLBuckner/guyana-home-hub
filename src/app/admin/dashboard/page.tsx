'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  status: string
  image_urls: string[]
  hero_index: number
  created_at: string
  user_id: string
  agent_email?: string
}

interface AgentApplication {
  id: string
  agent_id: string
  agent_email: string
  agent_name: string
  agent_tier: string
  status: 'pending' | 'approved' | 'denied' | 'needs_more_info'
  application_data: any
  created_at: string
  updated_at?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [properties, setProperties] = useState<Property[]>([])
  const [agentApplications, setAgentApplications] = useState<AgentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showAgentManagement, setShowAgentManagement] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const checkAdminAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin-login')
        return
      }

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, roles')
        .eq('id', user.id)
        .single()

      // Check if user has admin role (handle both text and array formats)
      const isAdmin = profile.user_type === 'admin' || 
                     profile.roles === 'admin' || 
                     (Array.isArray(profile.roles) && profile.roles.includes('admin'))
      
      const isSuperAdmin = profile.user_type === 'super_admin' || 
                          profile.roles === 'super_admin' || 
                          (Array.isArray(profile.roles) && profile.roles.includes('super_admin'))
      
      if (profileError || !profile || (!isAdmin && !isSuperAdmin)) {
        router.push('/admin-login')
        return
      }

      setUser(user)
      setUserRole(isSuperAdmin ? 'super_admin' : (profile.user_type || 'admin'))
    }
    checkAdminAuth()
  }, [supabase, router])

  useEffect(() => {
    if (user) {
      fetchProperties()
      fetchAgentApplications()
    }
  }, [user])

  const fetchProperties = async () => {
    setError('') // Clear previous errors
    try {
      // First, let's check if the properties table exists by trying a simple query
      const { data: testData, error: testError } = await supabase
        .from('properties')
        .select('id')
        .limit(1)

      if (testError) {
        console.error('Properties table access error:', testError.message)
        if (testError.message.includes('relation') && testError.message.includes('does not exist')) {
          console.log('Properties table does not exist. This is normal if no properties have been uploaded yet.')
          setError('Properties table not found. This is normal if no properties have been uploaded yet.')
        } else {
          setError(`Database error: ${testError.message}`)
        }
        setProperties([])
        return
      }

      // If basic query works, try the full query
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_user_id_fkey(email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching properties with profile data:', error.message)
        // Try without the foreign key join if it fails
        const { data: simpleData, error: simpleError } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (simpleError) {
          console.error('Error fetching properties (simple query):', simpleError.message)
          setError(`Failed to fetch properties: ${simpleError.message}`)
          setProperties([])
        } else {
          setProperties(simpleData || [])
        }
      } else {
        const propertiesWithAgent = data?.map(property => {
          // Ensure image_urls is always an array
          let imageUrls = property.image_urls;
          if (typeof imageUrls === 'string') {
            try {
              imageUrls = JSON.parse(imageUrls);
            } catch {
              imageUrls = [imageUrls]; // If it's a single URL string
            }
          }
          if (!Array.isArray(imageUrls)) {
            imageUrls = [];
          }
          
          return {
            ...property,
            image_urls: imageUrls,
            agent_email: property.profiles?.email || 'Unknown'
          };
        }) || []
        setProperties(propertiesWithAgent)
      }
    } catch (error) {
      console.error('Unexpected error fetching properties:', error)
      setError('Unexpected error occurred while fetching properties')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAgentApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_vetting')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching agent applications:', error)
        setAgentApplications([])
      } else {
        setAgentApplications(data || [])
      }
    } catch (error) {
      console.error('Unexpected error fetching agent applications:', error)
      setAgentApplications([])
    }
  }

  const updateAgentStatus = async (agentId: string, newStatus: 'approved' | 'denied' | 'needs_more_info', message?: string) => {
    try {
      // Update agent_vetting table
      const { error: vettingError } = await supabase
        .from('agent_vetting')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString(),
          admin_notes: message || null
        })
        .eq('agent_id', agentId)

      if (vettingError) {
        console.error('Error updating agent vetting status:', vettingError)
        return
      }

      // Update profiles table vetting_status
      const profileStatus = newStatus === 'approved' ? 'approved' : 'pending'
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ vetting_status: profileStatus })
        .eq('id', agentId)

      if (profileError) {
        console.error('Error updating profile vetting status:', profileError)
        return
      }

      // Send notification email
      const agent = agentApplications.find(app => app.agent_id === agentId)
      if (agent) {
        await fetch('/api/send-agent-status-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: agent.agent_email,
            name: agent.agent_name,
            status: newStatus,
            message: message || ''
          })
        })
      }

      // Refresh agent applications
      fetchAgentApplications()
    } catch (error) {
      console.error('Error updating agent status:', error)
    }
  }

  const updatePropertyStatus = async (propertyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId)

      if (error) {
        alert('Error updating property status')
        console.error(error)
      } else {
        alert(`Property ${newStatus} successfully!`)
        fetchProperties()
      }
    } catch (error) {
      alert('Error updating property')
      console.error(error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin-login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading admin dashboard...</p>
      </div>
    )
  }

  const pendingCount = properties.filter(p => p.status === 'pending').length
  const approvedCount = properties.filter(p => p.status === 'approved').length
  const rejectedCount = properties.filter(p => p.status === 'rejected').length
  
  const pendingAgents = agentApplications.filter(a => a.status === 'pending').length
  const approvedAgents = agentApplications.filter(a => a.status === 'approved').length
  const deniedAgents = agentApplications.filter(a => a.status === 'denied').length

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-red-700">Admin Dashboard</h1>
            <p className="text-gray-600">Guyana Home Hub - Property Management</p>
            {userRole === 'super_admin' && (
              <p className="text-xs text-red-500 font-semibold">SUPER ADMIN ACCESS</p>
            )}
          </div>
          <div className="flex gap-3">
            {userRole === 'super_admin' && (
              <button
                onClick={() => setShowUserManagement(!showUserManagement)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {showUserManagement ? 'Hide' : 'Show'} User Management
              </button>
            )}
            <button
              onClick={() => setShowAgentManagement(!showAgentManagement)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {showAgentManagement ? 'Hide' : 'Show'} Agent Management
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-100 p-6 rounded-lg border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-yellow-800">Properties Pending</h3>
            <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-800">Properties Approved</h3>
            <p className="text-3xl font-bold text-green-900">{approvedCount}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-red-800">Properties Rejected</h3>
            <p className="text-3xl font-bold text-red-900">{rejectedCount}</p>
          </div>
        </div>

        {/* Agent Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-800">Agents Pending</h3>
            <p className="text-3xl font-bold text-blue-900">{pendingAgents}</p>
          </div>
          <div className="bg-emerald-100 p-6 rounded-lg border-l-4 border-emerald-500">
            <h3 className="text-lg font-semibold text-emerald-800">Agents Approved</h3>
            <p className="text-3xl font-bold text-emerald-900">{approvedAgents}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-gray-500">
            <h3 className="text-lg font-semibold text-gray-800">Agents Denied</h3>
            <p className="text-3xl font-bold text-gray-900">{deniedAgents}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold">Database Notice</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Agent Management Section */}
        {showAgentManagement && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Applications</h2>
            {agentApplications.length === 0 ? (
              <p className="text-gray-600">No agent applications found.</p>
            ) : (
              <div className="grid gap-6">
                {agentApplications.map((agent) => (
                  <div key={agent.id} className="bg-white p-6 rounded-lg shadow border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{agent.agent_name}</h3>
                        <p className="text-gray-600">{agent.agent_email}</p>
                        <p className="text-sm text-gray-500">
                          Applied: {new Date(agent.created_at).toLocaleDateString()}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                          agent.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : agent.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : agent.status === 'denied'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">{agent.agent_tier} Plan</p>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-medium text-gray-700">Experience</h4>
                        <p className="text-sm text-gray-600">
                          {agent.application_data.yearsExperience} years • {agent.application_data.propertiesSold} properties sold
                        </p>
                        <p className="text-sm text-gray-600">
                          Avg. value: {agent.application_data.averagePropertyValue}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Business Info</h4>
                        <p className="text-sm text-gray-600">
                          {agent.application_data.businessName || 'Independent Agent'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {agent.application_data.businessEmail || 'No business email'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Specializations</h4>
                        <p className="text-sm text-gray-600">
                          {agent.application_data.specializations?.join(', ') || 'None listed'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">License</h4>
                        <p className="text-sm text-gray-600">
                          {agent.application_data.agentLicense || 'No license provided'}
                        </p>
                      </div>
                    </div>

                    {/* References */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">References</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-sm">
                          <p className="font-medium">{agent.application_data.reference1?.name}</p>
                          <p className="text-gray-600">{agent.application_data.reference1?.email}</p>
                          <p className="text-gray-600">{agent.application_data.reference1?.phone}</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{agent.application_data.reference2?.name}</p>
                          <p className="text-gray-600">{agent.application_data.reference2?.email}</p>
                          <p className="text-gray-600">{agent.application_data.reference2?.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {agent.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateAgentStatus(agent.agent_id, 'approved')}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          ✅ Approve Agent
                        </button>
                        <button
                          onClick={() => updateAgentStatus(agent.agent_id, 'denied')}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          ❌ Deny Agent
                        </button>
                        <button
                          onClick={() => {
                            const message = prompt('What additional information do you need?')
                            if (message) updateAgentStatus(agent.agent_id, 'needs_more_info', message)
                          }}
                          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                        >
                          📝 Request More Info
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Properties List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Listings</h2>
        {properties.length === 0 ? (
          <p className="text-gray-600">No properties found.</p>
        ) : (
          <div className="grid gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Images */}
                  <div className="lg:w-1/3">
                    {property.image_urls && Array.isArray(property.image_urls) && property.image_urls.length > 0 ? (
                      <div className="space-y-2">
                        <img
                          src={property.image_urls[property.hero_index] || property.image_urls[0]}
                          alt={property.title}
                          className="w-full h-48 object-cover rounded"
                        />
                        <div className="flex gap-2 overflow-x-auto">
                          {property.image_urls.slice(0, 4).map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`${property.title} ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                          {property.image_urls.length > 4 && (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-sm">
                              +{property.image_urls.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500">No Images</span>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="lg:w-2/3">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{property.title}</h2>
                        <p className="text-sm text-gray-500">Agent: {property.agent_email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        property.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : property.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {property.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Price</span>
                        <p className="font-semibold">G${property.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">~${Math.round(property.price / 210).toLocaleString()} USD</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Location</span>
                        <p className="font-semibold">{property.location}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Bedrooms</span>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Bathrooms</span>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{property.description}</p>

                    <div className="text-sm text-gray-500 mb-4">
                      Created: {new Date(property.created_at).toLocaleDateString()}
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex gap-3">
                      {property.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updatePropertyStatus(property.id, 'approved')}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => updatePropertyStatus(property.id, 'rejected')}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      {property.status === 'approved' && (
                        <>
                          <button
                            onClick={() => updatePropertyStatus(property.id, 'pending')}
                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                          >
                            📋 Move to Pending
                          </button>
                          <button
                            onClick={() => updatePropertyStatus(property.id, 'rejected')}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      {property.status === 'rejected' && (
                        <>
                          <button
                            onClick={() => updatePropertyStatus(property.id, 'pending')}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            🔄 Reopen for Review
                          </button>
                          <button
                            onClick={() => updatePropertyStatus(property.id, 'approved')}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            ✅ Approve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
