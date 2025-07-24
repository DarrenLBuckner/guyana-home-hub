'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Calendar,
  Share2,
  Heart,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Home,
  Car,
  Wifi,
  Thermometer,
  Shield,
  Zap,
  TreePine,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import ContactAgent from '@/components/ContactAgent'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  region?: string
  property_type?: string
  price_type?: string
  bedrooms: number
  bathrooms: number
  lot_size?: string
  home_size?: string
  status: string
  image_urls: string[]
  hero_index: number
  created_at: string
  user_id: string
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  amenities?: string[]
  features?: string[]
  inquiries?: number
}

export default function PropertyDetail() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .eq('status', 'approved') // Only show approved properties
        .single()

      if (error) {
        console.error('Error fetching property:', error)
        router.push('/properties/buy')
      } else {
        setProperty(data)
        setCurrentImageIndex(data.hero_index || 0)
      }
    } catch (error) {
      console.error('Error:', error)
      router.push('/properties/buy')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, type?: string) => {
    const formatted = price.toLocaleString()
    return type === 'rent' ? `GYD ${formatted}/month` : `GYD ${formatted}`
  }

  const nextImage = () => {
    if (property && property.image_urls.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === property.image_urls.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (property && property.image_urls.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.image_urls.length - 1 : prev - 1
      )
    }
  }

  const shareProperty = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Property link copied to clipboard!')
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('parking') || amenityLower.includes('garage')) return <Car className="h-4 w-4" />
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="h-4 w-4" />
    if (amenityLower.includes('ac') || amenityLower.includes('air')) return <Thermometer className="h-4 w-4" />
    if (amenityLower.includes('security')) return <Shield className="h-4 w-4" />
    if (amenityLower.includes('power') || amenityLower.includes('generator')) return <Zap className="h-4 w-4" />
    if (amenityLower.includes('garden') || amenityLower.includes('yard')) return <TreePine className="h-4 w-4" />
    return <Home className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or is no longer available.</p>
          <Link 
            href="/properties/buy"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-4">
              <button 
                onClick={shareProperty}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
              <button 
                onClick={() => setIsFavorited(!isFavorited)}
                className={`flex items-center space-x-2 ${isFavorited ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="relative">
                {property.image_urls && property.image_urls.length > 0 ? (
                  <>
                    <img 
                      src={property.image_urls[currentImageIndex]} 
                      alt={property.title}
                      className="w-full h-96 object-cover"
                    />
                    {property.image_urls.length > 1 && (
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
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="flex space-x-2">
                            {property.image_urls.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full ${
                                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <Home className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {property.image_urls && property.image_urls.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.image_urls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 ${
                          index === currentImageIndex ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        <img 
                          src={url} 
                          alt={`${property.title} ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{property.location}</span>
                    {property.region && (
                      <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                        {property.region}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {formatPrice(property.price, property.price_type)}
                  </div>
                  {property.price_type && (
                    <div className="text-sm text-gray-600 mt-1">
                      {property.price_type === 'rent' ? 'Monthly Rent' : 'Sale Price'}
                    </div>
                  )}
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms > 0 && (
                  <div className="flex items-center space-x-2">
                    <Bed className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center space-x-2">
                    <Bath className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.home_size && (
                  <div className="flex items-center space-x-2">
                    <Square className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{property.home_size}</span>
                  </div>
                )}
                {property.lot_size && (
                  <div className="flex items-center space-x-2">
                    <Square className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{property.lot_size} lot</span>
                  </div>
                )}
              </div>

              {/* Property Type */}
              {property.property_type && (
                <div className="mb-6">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {property.property_type}
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {getAmenityIcon(amenity)}
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Stats */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{property.inquiries || 0}</div>
                    <div className="text-sm text-gray-600">Inquiries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.floor(Math.random() * 50) + 10}
                    </div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {new Date(property.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">Listed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">Active</div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Agent Card */}
            <div className="sticky top-24">
              <ContactAgent 
                property={{
                  id: property.id,
                  title: property.title,
                  location: property.location,
                  price: property.price,
                  price_type: property.price_type,
                  contact_name: property.contact_name,
                  contact_phone: property.contact_phone,
                  contact_email: property.contact_email
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
