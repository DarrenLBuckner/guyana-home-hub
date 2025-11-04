'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Home } from 'lucide-react'
import VideoEmbed from '@/components/VideoEmbed'


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
  land_size_value?: number
  land_size_unit?: string
  year_built?: number
  amenities?: string[]
  features?: string[]
  listed_by_type?: string
  owner_email?: string
  owner_whatsapp?: string
  images?: string[]
  hero_index?: number
  video_url?: string

  listing_type?: 'sale' | 'rent'
  property_type?: string
  agent_profile?: {
    id: string
    first_name: string
    last_name: string
    phone: string
    profile_image?: string
    company?: string
    user_type?: string
  }
}

// Truncated Description Component  
function TruncatedDescription({ description, maxLength = 300 }: { description: string, maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If description is short, show it all
  if (description.length <= maxLength) {
    return <p className="text-gray-700 leading-relaxed">{description}</p>;
  }
  
  // Find the last complete word within maxLength
  let truncateIndex = maxLength;
  while (truncateIndex > 0 && description[truncateIndex] !== ' ') {
    truncateIndex--;
  }
  // Fallback to character limit if no space found
  if (truncateIndex === 0) truncateIndex = maxLength;
  
  const truncatedText = description.substring(0, truncateIndex) + '...';
  
  return (
    <div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {isExpanded ? description : truncatedText}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Show More
          </>
        )}
      </button>
    </div>
  );
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
            {/* Large Price and Key Details */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="text-5xl font-bold text-green-600">
                ${property.price?.toLocaleString()}
                {property.listing_type === 'rent' && (
                  <span className="text-2xl text-gray-600">/month</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-6">
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Beds</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Baths</div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details Rectangle */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              {property.year_built && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">{property.year_built}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              )}
              {property.house_size_value && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">
                    {property.house_size_value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Home Sq Ft {property.house_size_unit && property.house_size_unit !== 'sq ft' ? `(${property.house_size_unit})` : ''}
                  </div>
                </div>
              )}
              {property.land_size_value && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">
                    {property.land_size_value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Lot Size {property.land_size_unit || 'sq ft'}
                  </div>
                </div>
              )}
              {property.property_type && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">{property.property_type}</div>
                  <div className="text-sm text-gray-600">Home Type</div>
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
                <TruncatedDescription description={property.description} maxLength={300} />
              </div>
            )}
            
            {property.video_url && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Property Video</h2>
                <VideoEmbed videoUrl={property.video_url} className="max-w-2xl" />
              </div>
            )}
            
            {(property.amenities || property.features) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Amenities & Features</h2>
                <div className="flex flex-wrap gap-2">
                  {(property.amenities || property.features || []).map((amenity, index) => (
                    <span 
                      key={index} 
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Agent Profile Section - Only for Agent listings */}
            {property.agent_profile ? (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Listed by</h3>
                <div className="flex items-center space-x-4">
                  {/* Agent Photo */}
                  <div className="flex-shrink-0">
                    {property.agent_profile.profile_image ? (
                      <img 
                        src={property.agent_profile.profile_image} 
                        alt={`${property.agent_profile.first_name} ${property.agent_profile.last_name}`}
                        className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white text-2xl font-bold border-3 border-white shadow-lg ${property.agent_profile.profile_image ? 'hidden' : 'flex'}`}>
                      {property.agent_profile.first_name?.[0]}{property.agent_profile.last_name?.[0]}
                    </div>
                  </div>
                  
                  {/* Agent Info */}
                  <div className="flex-grow">
                    <div className="text-xl font-bold text-gray-800">
                      {property.agent_profile.first_name} {property.agent_profile.last_name}
                    </div>
                    {property.agent_profile.company && (
                      <div className="text-gray-600 mb-2">{property.agent_profile.company}</div>
                    )}
                    
                    {/* Contact Button */}
                    <button 
                      onClick={() => {
                        const phoneNumber = property.agent_profile?.phone;
                        
                        if (!phoneNumber) {
                          alert('Contact information not available');
                          return;
                        }
                        
                        // Clean phone number (remove +, spaces, dashes, parentheses)
                        const cleanNumber = phoneNumber.replace(/[\s\-\+\(\)]/g, '');
                        
                        // Create WhatsApp message
                        const propertyTitle = property?.title || 'this property';
                        const propertyPrice = property?.price ? `$${property.price.toLocaleString()}` : '';
                        const propertyLocation = property?.city && property?.region ? `${property.city}, ${property.region}` : (property?.location || '');
                        const listingType = property.listing_type || 'sale';
                        const contactName = property.agent_profile ? `${property.agent_profile.first_name} ${property.agent_profile.last_name}` : 'agent';
                        const isAdmin = property.agent_profile?.user_type === 'admin';
                        
                        const message = encodeURIComponent(
                          `Hi ${contactName}! I'm interested in your property${listingType === 'rent' ? ' for rental' : ' for sale'}:\n\n` +
                          `${propertyTitle}\n` +
                          `${propertyPrice ? `Price: ${propertyPrice}${listingType === 'rent' ? '/month' : ''}\n` : ''}` +
                          `${propertyLocation ? `Location: ${propertyLocation}\n` : ''}\n` +
                          `Could you provide more details and schedule a viewing?`
                        );
                        
                        // WhatsApp URL
                        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
                        
                        // Open in new window
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Contact {property.agent_profile.first_name}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Non-Agent Contact Section (FSBO, Owner, Landlord) */
              <div className="space-y-3">
                {property.listed_by_type === 'owner' || property.listed_by_type === 'fsbo' ? (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Contact Property Owner</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href={`mailto:${property.owner_email}`}
                        className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        📧 Email Owner
                      </a>
                      {property.owner_whatsapp && (
                        <a 
                          href={`https://wa.me/${property.owner_whatsapp.replace(/[^0-9]/g, '')}`}
                          className="flex-1 bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          💬 WhatsApp Owner
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        // Get phone number from property
                        const phoneNumber = property?.owner_whatsapp;
                        
                        if (!phoneNumber) {
                          alert('Contact information not available');
                          return;
                        }
                        
                        // Clean phone number (remove +, spaces, dashes, parentheses)
                        const cleanNumber = phoneNumber.replace(/[\s\-\+\(\)]/g, '');
                        
                        // Create WhatsApp message with dynamic contact person
                        const propertyTitle = property?.title || 'this property';
                        const propertyPrice = property?.price ? `$${property.price.toLocaleString()}` : '';
                        const propertyLocation = property?.location || '';
                        const listingType = property.listing_type || 'sale';
                        
                        const message = encodeURIComponent(
                          `Hi! I'm interested in your property${listingType === 'rent' ? ' for rental' : ' for sale'}:\n\n` +
                          `${propertyTitle}\n` +
                          `${propertyPrice ? `Price: ${propertyPrice}${listingType === 'rent' ? '/month' : ''}\n` : ''}` +
                          `${propertyLocation ? `Location: ${propertyLocation}\n` : ''}\n` +
                          `Could you provide more details and schedule a viewing?`
                        );
                        
                        // WhatsApp URL
                        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
                        
                        // Open in new window
                        window.open(whatsappUrl, '_blank');
                        
                        console.log('WhatsApp contact initiated:', cleanNumber);
                      }}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Contact via WhatsApp
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                      Save Property
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}