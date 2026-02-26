'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Home, Eye, ZoomIn } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import VideoEmbed from '@/components/VideoEmbed'
import RequestViewingModal from '@/components/RequestViewingModal'
import { PrivateListingDisclaimer } from '@/components/PrivateListingDisclaimer'
import { PropertyStatusRibbon } from '@/components/PropertyStatusRibbon'
import { FSBOBadge } from '@/components/FSBOBadge'
import PropertySchemaClient from '@/components/PropertySchemaClient'
import { ShareDropdown } from '@/components/ShareDropdown'
import { WatchButton } from '@/components/WatchButton'
import { CurrencyCalculatorWidget } from '@/components/CurrencyCalculatorWidget'
import MortgageCalculator from '@/components/MortgageCalculator'
import PrivateListingContact from '@/components/PrivateListingContact'
import { createClient } from '@/lib/supabase/client'
import { buildPropertyMessage, buildBackupOfferMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location?: string | null
  city?: string
  region?: string
  neighborhood?: string
  address?: string
  show_address?: boolean
  bedrooms?: number
  bathrooms?: number
  house_size_value?: number
  house_size_unit?: string
  land_size_value?: number
  land_size_unit?: string
  lot_length?: number
  lot_width?: number
  lot_dimension_unit?: string
  year_built?: number
  amenities?: string[]
  features?: string[]
  listed_by_type?: string
  owner_email?: string
  owner_whatsapp?: string
  images?: string[]
  hero_index?: number
  video_url?: string
  views?: number

  listing_type?: 'sale' | 'rent' | 'lease' | 'short_term_rent'
  available_from?: string | null
  property_type?: string
  status?: string
  agent_profile?: {
    id: string
    first_name: string
    last_name: string
    phone: string
    profile_image?: string
    company?: string
    user_type?: string
    is_founding_member?: boolean
    is_founding_advisor?: boolean
    is_verified_agent?: boolean
  }
  // Private listing fields
  is_private_listing?: boolean
  promoted_agent?: {
    id: string
    first_name: string
    last_name: string
    company?: string
    phone?: string
    profile_image?: string
    is_verified_agent?: boolean
  } | null
  owner_contact?: {
    name: string
    phone?: string
  } | null
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

interface PropertyDetailClientProps {
  propertyId: string
}

export default function PropertyDetailClient({ propertyId }: PropertyDetailClientProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showViewingModal, setShowViewingModal] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (propertyId) {
      fetch(`/api/properties/${propertyId}`)
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
  }, [propertyId])

  // Increment view count on page load (fire-and-forget)
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const supabase = createClient()
        await supabase.rpc('increment_property_views', { property_id: propertyId })
      } catch (error) {
        // Silent fail - don't block page rendering for view increment
        console.error('Failed to increment views:', error)
      }
    }

    if (propertyId) {
      incrementViews()
    }
  }, [propertyId])

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

  // Private listing detection
  const isPrivateListing = property?.is_private_listing || false
  const promotedAgent = property?.promoted_agent || null
  const ownerContact = property?.owner_contact || null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Title and Action Bar */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <h1 className="text-4xl font-bold">{property.title}</h1>
          <div className="flex items-center gap-3">
            <WatchButton propertyId={property.id} />
            <ShareDropdown property={property} />
          </div>
        </div>

        {/* View Count - Prominent Badge */}
        {property.views !== undefined && property.views > 0 && (
          <div className="inline-flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <Eye className="h-4 w-4" />
            <span>{property.views?.toLocaleString()} views</span>
          </div>
        )}

        {/* Image Gallery */}
        {property.images && property.images.length > 0 ? (
          <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full max-h-[600px] min-h-[300px] bg-gray-100 flex items-center justify-center">
              <button
                onClick={() => setLightboxOpen(true)}
                className="w-full h-full flex items-center justify-center cursor-zoom-in group"
                aria-label="Click to enlarge image"
              >
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[600px] w-auto h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center absolute inset-0">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
                {/* Enlarge hint */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-70 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-5 w-5" />
                </div>
              </button>

              {/* Property Status Ribbon */}
              <PropertyStatusRibbon
                status={property.status || 'available'}
                listingType={property.listing_type}
              />

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

        {/* Fullscreen Lightbox */}
        {property.images && property.images.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={currentImageIndex}
            slides={property.images.map((src) => ({ src }))}
            plugins={[Zoom]}
            on={{
              view: ({ index }) => setCurrentImageIndex(index),
            }}
            carousel={{
              finite: false,
            }}
            zoom={{
              maxZoomPixelRatio: 3,
              scrollToZoom: true,
            }}
          />
        )}

        {/* Private Listing Disclaimer */}
        <PrivateListingDisclaimer
          listedByType={property.listed_by_type}
          listingType={property.listing_type}
        />

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Large Price and Key Details */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-5xl font-bold text-green-600">
                  ${property.price?.toLocaleString()}
                  {property.listing_type === 'rent' && (
                    <span className="text-2xl text-gray-600">/month</span>
                  )}
                </div>
                {/* Availability — hero section, near price (Zillow/Property24 standard) */}
                {(property.listing_type === 'rent' || property.listing_type === 'lease' || property.listing_type === 'short_term_rent') && (() => {
                  const af = property.available_from;
                  if (!af || new Date(af) <= new Date()) {
                    return <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 mt-2 mb-1">Available Now</span>;
                  }
                  const label = new Date(af).toLocaleString('default', { month: 'long', year: 'numeric' });
                  return <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 mt-2 mb-1">Available from {label}</span>;
                })()}
                {/* FSBO Badge */}
                <FSBOBadge listedByType={property.listed_by_type} className="mt-2" />
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
              {(property.lot_length && property.lot_width) || property.land_size_value ? (
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">
                    {/* Show dimensions if available (familiar to Guyanese locals) */}
                    {property.lot_length && property.lot_width && (
                      <div>
                        {property.lot_length}x{property.lot_width}{property.lot_dimension_unit || 'ft'}
                      </div>
                    )}
                    {/* Show total area (familiar to international users) */}
                    {property.land_size_value && (
                      <div className={property.lot_length && property.lot_width ? "text-sm" : ""}>
                        {property.land_size_value.toLocaleString()} {property.land_size_unit || 'sq ft'}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Lot Size {property.lot_length && property.lot_width && property.land_size_value ? '(Dimensions / Area)' : ''}
                  </div>
                </div>
              ) : null}
              {property.property_type && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">{property.property_type}</div>
                  <div className="text-sm text-gray-600">Home Type</div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              {property.neighborhood ? (
                <div>
                  <p className="text-gray-700 font-medium">
                    {property.show_address && property.address
                      ? `${property.address}, ${property.neighborhood}`
                      : property.neighborhood}
                  </p>
                  {property.city && (
                    <p className="text-gray-500 text-sm">{property.city}</p>
                  )}
                  {!property.show_address && (
                    <p className="text-gray-500 text-sm mt-1 italic">
                      Contact agent for exact address
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">
                  {property.city || 'Location details available upon request'}
                </p>
              )}
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

            {/* Contact Section - Priority: Private Listing > Agent > Owner/FSBO > Generic */}
            {isPrivateListing ? (
              /* Private Listing (FSBO/Landlord) - Side-by-side Owner + Promoted Agent */
              <PrivateListingContact
                owner={ownerContact || { name: 'Property Owner', phone: property.owner_whatsapp }}
                agent={promotedAgent}
                onRequestViewing={() => setShowViewingModal(true)}
                propertyTitle={property.title}
                propertyPrice={property.price ? `$${property.price.toLocaleString()}` : ''}
                propertyLocation={property.neighborhood || property.city || ''}
                propertyId={property.id}
              />
            ) : property.agent_profile ? (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Listed by</h3>
                  {property.agent_profile.is_verified_agent && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold uppercase tracking-wide rounded-full px-4 py-1.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      VERIFIED AGENT
                    </span>
                  )}
                </div>
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
                    {/* Founding Badges */}
                    {(property.agent_profile.is_founding_member || property.agent_profile.is_founding_advisor) && (
                      <div className="flex flex-col gap-0.5 mb-1">
                        {property.agent_profile.is_founding_member && (
                          <span className="inline-flex items-center gap-1 text-sm text-amber-600 font-medium">
                            🏅 Founding Agent
                          </span>
                        )}
                        {property.agent_profile.is_founding_advisor && (
                          <span className="inline-flex items-center gap-1 text-sm text-purple-600 font-medium">
                            ⭐ Founding Advisor
                          </span>
                        )}
                      </div>
                    )}
                    {property.agent_profile.company && (
                      <div className="text-gray-600 mb-2">{property.agent_profile.company}</div>
                    )}

                    {/* Contact Buttons - Status-aware */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {property.status === 'sold' ? (
                        <button
                          disabled
                          className="flex items-center gap-2 bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                        >
                          Property Sold
                        </button>
                      ) : property.status === 'under_contract' || property.status === 'pending' ? (
                        <button
                          onClick={() => {
                            const phoneNumber = property.agent_profile?.phone;

                            if (!phoneNumber) {
                              alert('Contact information not available');
                              return;
                            }

                            // Create WhatsApp message for backup offers
                            const propertyTitle = property?.title || 'this property';
                            const propertyPrice = property?.price ? `$${property.price.toLocaleString()}` : '';
                            const propertyLocation = property?.neighborhood || property?.city || '';
                            const listingType = property.listing_type || 'sale';
                            const contactName = property.agent_profile ? `${property.agent_profile.first_name} ${property.agent_profile.last_name}` : 'agent';

                            const message = buildBackupOfferMessage({
                              recipientName: contactName,
                              propertyTitle,
                              price: propertyPrice ? `${propertyPrice}${listingType === 'rent' ? '/month' : ''}` : '',
                              location: propertyLocation,
                              propertyId: property.id,
                            });

                            const whatsappUrl = buildWhatsAppUrl(phoneNumber, message);

                            // Open in new window
                            window.open(whatsappUrl, '_blank');
                          }}
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Backup Offers Welcome
                        </button>
                      ) : (
                        // Active property - normal contact
                        <>
                          <button
                            onClick={() => {
                              const phoneNumber = property.agent_profile?.phone;

                              if (!phoneNumber) {
                                alert('Contact information not available');
                                return;
                              }

                              // Create WhatsApp message
                              const propertyTitle = property?.title || 'this property';
                              const propertyPrice = property?.price ? `$${property.price.toLocaleString()}` : '';
                              const propertyLocation = property?.neighborhood || property?.city || '';
                              const listingType = property.listing_type || 'sale';
                              const contactName = property.agent_profile ? `${property.agent_profile.first_name} ${property.agent_profile.last_name}` : 'agent';

                              const message = buildPropertyMessage({
                                recipientName: contactName,
                                propertyTitle,
                                price: propertyPrice ? `${propertyPrice}${listingType === 'rent' ? '/month' : ''}` : '',
                                location: propertyLocation,
                                propertyId: property.id,
                              });

                              const whatsappUrl = buildWhatsAppUrl(phoneNumber, message);

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
                          <button
                            onClick={() => setShowViewingModal(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Request Viewing
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : property.listed_by_type === 'owner' || property.listed_by_type === 'fsbo' ? (
              /* Non-Agent FSBO/Owner Contact Section (fallback for non-private listings) */
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Contact Property Owner</h3>
                {property.status === 'sold' ? (
                  <div className="text-center">
                    <button
                      disabled
                      className="bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed"
                    >
                      Property Sold
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <a
                      href={`mailto:${property.owner_email}`}
                      className="bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Email Owner
                    </a>
                    {property.owner_whatsapp && (
                      <a
                        href={buildWhatsAppUrl(property.owner_whatsapp, buildPropertyMessage({
                          recipientName: property.owner_contact?.name || 'there',
                          propertyTitle: property.title || 'this property',
                          price: property.price ? `$${property.price.toLocaleString()}` : '',
                          location: property.neighborhood || property.city || '',
                          propertyId: property.id,
                        }))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        WhatsApp Owner
                      </a>
                    )}
                    <button
                      onClick={() => setShowViewingModal(true)}
                      className="bg-purple-600 text-white text-center py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {property.status === 'under_contract' || property.status === 'pending' ? 'Backup Offers' : 'Request Viewing'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Generic Contact Section */
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const phoneNumber = property?.owner_whatsapp;
                    if (!phoneNumber) {
                      alert('Contact information not available');
                      return;
                    }
                    const propertyTitle = property?.title || 'this property';
                    const propertyPrice = property?.price ? `$${property.price.toLocaleString()}` : '';
                    const propertyLocation = property?.neighborhood || property?.city || '';
                    const listingType = property.listing_type || 'sale';
                    const message = buildPropertyMessage({
                      propertyTitle,
                      price: propertyPrice ? `${propertyPrice}${listingType === 'rent' ? '/month' : ''}` : '',
                      location: propertyLocation,
                      propertyId: property.id,
                    });
                    const whatsappUrl = buildWhatsAppUrl(phoneNumber, message);
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contact via WhatsApp
                </button>
                <button
                  onClick={() => setShowViewingModal(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Request Viewing
                </button>
                <WatchButton propertyId={property.id} />
              </div>
            )}
          </div>
        </div>

        {/* Currency & Mortgage Calculators */}
        {property.price && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CurrencyCalculatorWidget
              initialAmount={property.price}
              initialFromCurrency="GYD"
              initialToCurrency="USD"
              compact={false}
              className="shadow-lg"
            />
            <MortgageCalculator
              initialAmount={property.price}
              className="shadow-lg"
            />
          </div>
        )}
      </div>

      {/* Request Viewing Modal */}
      {property && (
        <RequestViewingModal
          property={property}
          isOpen={showViewingModal}
          onClose={() => setShowViewingModal(false)}
        />
      )}

      {/* Property Schema for Rich Search Results */}
      {property && (
        <PropertySchemaClient
          property={{
            id: property.id,
            title: property.title,
            description: property.description,
            price: property.price,
            currency: 'GYD',
            propertyType: property.listing_type || 'sale',
            category: property.property_type,
            location: property.city,
            address: property.location || property.city,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.house_size_value,
            images: property.images,
            agent: property.agent_profile ? {
              name: `${property.agent_profile.first_name} ${property.agent_profile.last_name}`,
              phone: property.agent_profile.phone,
              company: property.agent_profile.company
            } : undefined,
            features: property.features || property.amenities,
            yearBuilt: property.year_built,
            listingDate: new Date().toISOString(),
            listedByType: property.listed_by_type as 'agent' | 'owner' | 'developer'
          }}
        />
      )}
    </div>
  )
}
