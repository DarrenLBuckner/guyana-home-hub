'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Property {
  id: string
  title: string
  address: string
  price: number
  description: string
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
}

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/properties/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Property not found')
          return res.json()
        })
        .then(data => {
          setProperty(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading property:', err)
          setError(err.message)
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading property details...</div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-600">The property you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{property.title}</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-green-600">
                ${property.price?.toLocaleString()}
              </div>
              {property.bedrooms && (
                <div className="text-lg text-gray-600">
                  {property.bedrooms} bed
                </div>
              )}
              {property.bathrooms && (
                <div className="text-lg text-gray-600">
                  {property.bathrooms} bath
                </div>
              )}
              {property.square_feet && (
                <div className="text-lg text-gray-600">
                  {property.square_feet} sq ft
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <p className="text-gray-600">{property.address}</p>
            </div>
            
            {property.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            )}
            
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Agent
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Save Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}