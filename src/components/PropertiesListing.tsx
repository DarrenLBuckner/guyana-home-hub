'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Property {
  id: string
  title: string
  address: string
  price: number
  description: string
  bedrooms?: number
  bathrooms?: number
  status: string
}

export default function PropertiesListing() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading properties...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
          <p className="text-gray-600 mb-2">{property.address}</p>
          <p className="text-2xl font-bold text-green-600 mb-4">${property.price?.toLocaleString()}</p>
          <p className="text-gray-700 mb-4">{property.description}</p>
          <Link href={`/properties/${property.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Details
          </Link>
        </div>
      ))}
    </div>
  )
}