'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location?: string | null
  city?: string
  region?: string
  bedrooms?: number
  bathrooms?: number
  house_size_value?: number
  house_size_unit?: string
  images?: string[]
  hero_index?: number
}

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images!.length)
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{property.title}</h1>
        
        {/* Image Gallery */}
        {property.images && property.images.length > 0 ? (
          <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center absolute inset-0">
                <Home className="h-16 w-16 text-gray-400" />
              </div>
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>
            
            {property.images.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-green-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center">
                        <Home className="h-6 w-6 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700">
            No images found or images array is empty
          </div>
        )}
        
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
              {property.house_size_value && (
                <div className="text-lg text-gray-600">
                  {property.house_size_value} {property.house_size_unit || 'sq ft'}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-gray-600">
                {property.city && property.region ? `${property.city}, ${property.region}` : 
                 property.city || property.region || property.location || 'Location not specified'}
              </p>
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