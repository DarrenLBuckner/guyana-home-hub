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

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [showUserManagement, setShowUserManagement] = useState(false)
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
            <h3 className="text-lg font-semibold text-yellow-800">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-800">Approved</h3>
            <p className="text-3xl font-bold text-green-900">{approvedCount}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-red-800">Rejected</h3>
            <p className="text-3xl font-bold text-red-900">{rejectedCount}</p>
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

        {/* Properties List */}
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
