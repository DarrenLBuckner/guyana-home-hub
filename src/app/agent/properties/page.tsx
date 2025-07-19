'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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
}

export default function PropertyManagement() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

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
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error)
      } else {
        setProperties(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
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
        fetchProperties() // Refresh the list
      }
    } catch (error) {
      alert('Error updating property')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading properties...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">Property Management</h1>
          <button
            onClick={() => router.push('/agent/home')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        {properties.length === 0 ? (
          <p className="text-gray-600">No properties found.</p>
        ) : (
          <div className="grid gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Images */}
                  <div className="lg:w-1/3">
                    {property.image_urls && property.image_urls.length > 0 ? (
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
                      <h2 className="text-xl font-semibold text-gray-800">{property.title}</h2>
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
                        <p className="font-semibold">${property.price.toLocaleString()}</p>
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

                    {/* View Only - No Actions */}
                    <div className="text-sm text-gray-500">
                      Status: <span className="font-medium">{property.status.charAt(0).toUpperCase() + property.status.slice(1)}</span>
                      {property.status === 'pending' && ' (Awaiting admin approval)'}
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
