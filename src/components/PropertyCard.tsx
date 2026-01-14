// Zillow-style Property Card - Modern Real Estate Display
// src/components/PropertyCard.tsx

'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bed,
  Bath,
  Square,
  Car,
  Eye,
  Phone,
  Mail,
  Home as HomeIcon,
  Building2,
  Warehouse,
  TreePine
} from 'lucide-react'
import { Property } from '@/types/property'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CurrencyFormatter, convertGydToUsd } from '@/lib/currency'
import { PropertyStatusRibbon } from '@/components/PropertyStatusRibbon'
import { FSBOBadge } from '@/components/FSBOBadge'
import { WatchButton } from '@/components/WatchButton'

interface PropertyCardProps {
  property: Property
  variant?: 'grid' | 'list' | 'featured'
  showStats?: boolean
  showContactButtons?: boolean
  contactAction?: (property: Property) => void
  className?: string
}

export function PropertyCard({
  property,
  variant = 'grid',
  showStats = true,
  showContactButtons = false,
  contactAction,
  className
}: PropertyCardProps) {
  const [imageLoading, setImageLoading] = useState(true)

  const formatPrice = (price: number) => {
    return CurrencyFormatter.property(price)
  }

  const formatPriceWithUSD = (price: number) => {
    const gydPrice = `G$${price.toLocaleString()}`
    const usdPrice = `~US$${convertGydToUsd(price).toLocaleString()}`
    return { gydPrice, usdPrice }
  }

  // Helper to handle both image formats: string[] or { url: string }[]
  const getImageUrl = (images: any[] | undefined, index: number = 0): string => {
    const image = images?.[index]
    if (!image) return '/images/placeholder-property.jpg'
    return typeof image === 'string' ? image : image.url || '/images/placeholder-property.jpg'
  }

  const getPropertyTypeIcon = (type: Property['property_type']) => {
    switch (type) {
      case 'apartment': return Building2
      case 'condo': return Building2
      case 'house': return HomeIcon
      case 'commercial': return Warehouse
      case 'land': return TreePine
      default: return HomeIcon
    }
  }


  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `https://www.guyanahomehub.com/properties/${property.id}`
    const priceFormatted = property.price?.toLocaleString() || 'Contact for price'
    const isRental = property.listing_type === 'rent'
    const priceDisplay = isRental ? `G$${priceFormatted}/month` : `G$${priceFormatted}`
    const listingType = isRental ? 'For Rent' : 'For Sale'
    const location = property.neighborhood || property.city || ''

    const whatsappText = `Check out this property on Guyana Home Hub!\n\n${property.title}\n${listingType} • ${priceDisplay}${location ? ` • ${location}` : ''}\n\n${url}`

    window.open(
      `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    contactAction?.(property)
  }

  // Helper function to render contact buttons based on property status
  const renderContactButtons = (className?: string) => {
    if (!showContactButtons) return null

    // Sold properties - no contact
    if (property.status === 'sold') {
      return (
        <div className={className}>
          <Button
            disabled
            variant="outline"
            size="sm"
            className="flex-1 bg-gray-400 text-white cursor-not-allowed"
          >
            Property Sold
          </Button>
        </div>
      )
    }

    // Under contract - backup offers
    if (property.status === 'under_contract' || property.status === 'pending') {
      return (
        <div className={className}>
          <Button
            onClick={handleContact}
            variant="default"
            size="sm"
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            <Phone className="h-4 w-4 mr-1" />
            Backup Offers Welcome
          </Button>
        </div>
      )
    }

    // Active/Available/Approved - normal contact (adjust text based on listed_by_type)
    if (property.status === 'active' || property.status === 'available' || property.status === 'approved') {
      const isOwnerListed = property.listed_by_type === 'owner'
      const contactText = isOwnerListed ? 'Contact Owner' : 'Contact Agent'
      
      return (
        <div className={className}>
          <Button
            onClick={handleContact}
            variant="default"
            size="sm"
            className="flex-1"
          >
            <Phone className="h-4 w-4 mr-1" />
            {contactText}
          </Button>
          <Button
            onClick={handleContact}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
        </div>
      )
    }

    // Default case - no contact buttons for other statuses
    return null
  }

  const PropertyTypeIcon = getPropertyTypeIcon(property.property_type)

  // Defensive: ensure features object exists to prevent null access errors
  const features = property.features || {}

  if (variant === 'list') {
    return (
      <Link href={`/properties/${property.id}`}>
        <div className={cn(
          "group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-green-300",
          className
        )}>
          <div className="flex">
            {/* Image Section */}
            <div className="relative w-64 h-48 flex-shrink-0">
              <Image
                src={getImageUrl(property.images, 0)}
                alt={property.title}
                fill
                className={cn(
                  "object-cover transition-all duration-300 group-hover:scale-105",
                  imageLoading ? "blur-sm" : "blur-0"
                )}
                onLoad={() => setImageLoading(false)}
              />
              
              {/* Property Status Ribbon - Replaces old status badge */}
              <PropertyStatusRibbon 
                status={property.status} 
                listingType={property.listing_type}
              />

              {/* Image Count */}
              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                  {property.images.length} photos
                </div>
              )}

              {/* View Count Badge - Prominent */}
              {property.views !== undefined && property.views > 0 && (
                <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center shadow-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  {property.views.toLocaleString()}
                </div>
              )}

              {/* Actions - Mobile optimized: Watch + WhatsApp */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <WatchButton propertyId={property.id} variant="icon" />
                <button
                  onClick={handleWhatsAppShare}
                  className="relative p-2 rounded-full bg-white/90 text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Share on WhatsApp"
                  title="Share on WhatsApp"
                >
                  {/* Share icon */}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {/* Small WhatsApp badge */}
                  <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formatPriceWithUSD(property.price).gydPrice}
                    {property.listing_type === 'rent' && (
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPriceWithUSD(property.price).usdPrice}
                    {property.listing_type === 'rent' && '/month'}
                  </p>
                  
                  {/* FSBO Badge - Separate from status ribbon */}
                  <FSBOBadge listedByType={property.listed_by_type} className="mt-2" />
                </div>
                <PropertyTypeIcon className="h-6 w-6 text-gray-400" />
              </div>

              {/* Property Features */}
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                {features.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{features.bedrooms} bed{features.bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {features.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{features.bathrooms} bath{features.bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {features.square_footage && (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{features.square_footage.toLocaleString()} sq ft</span>
                  </div>
                )}
                {/* Lot Size Display - Show both dimensions and total area */}
                {(features.lot_length && features.lot_width) || (features.land_size_value) ? (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>
                      {/* Show dimensions if available (familiar to Guyanese locals) */}
                      {features.lot_length && features.lot_width && (
                        <span>
                          {features.lot_length}×{features.lot_width}{features.lot_dimension_unit || 'ft'}
                          {features.land_size_value && ' • '}
                        </span>
                      )}
                      {/* Show total area (familiar to international users) */}
                      {features.land_size_value && (
                        <span>
                          {features.land_size_value.toLocaleString()} {features.land_size_unit || 'sq ft'}
                        </span>
                      )}
                    </span>
                  </div>
                ) : null}
                {features.parking_spaces && (
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-1" />
                    <span>{features.parking_spaces} car{features.parking_spaces !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {property.description}
              </p>

              {/* Contact Buttons */}
              {renderContactButtons("flex space-x-3")}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid and Featured variants
  return (
    <Link href={`/properties/${property.id}`}>
      <div className={cn(
        "group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-green-300",
        variant === 'featured' && "lg:flex lg:flex-row",
        className
      )}>
        {/* Image Section */}
        <div className={cn(
          "relative overflow-hidden",
          variant === 'featured' ? "lg:w-1/2 h-64 lg:h-80" : "h-48"
        )}>
          <Image
            src={getImageUrl(property.images, 0)}
            alt={property.title}
            fill
            className={cn(
              "object-cover transition-all duration-300 group-hover:scale-105",
              imageLoading ? "blur-sm" : "blur-0"
            )}
            onLoad={() => setImageLoading(false)}
          />
          
          {/* Property Status Ribbon - Replaces old status badge */}
          <PropertyStatusRibbon 
            status={property.status} 
            listingType={property.listing_type}
          />

          {/* Featured Badge - Positioned below status ribbon */}
          {variant === 'featured' && (
            <div className="absolute top-12 left-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-r-lg text-xs font-medium z-10">
              Featured
            </div>
          )}

          {/* Image Count */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
              {property.images.length} photos
            </div>
          )}

          {/* View Count Badge - Prominent */}
          {property.views !== undefined && property.views > 0 && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center shadow-sm">
              <Eye className="h-3 w-3 mr-1" />
              {property.views.toLocaleString()}
            </div>
          )}

          {/* Actions - Mobile optimized: Watch + WhatsApp Share */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <WatchButton propertyId={property.id} variant="icon" />
            <button
              onClick={handleWhatsAppShare}
              className="relative p-2 rounded-full bg-white/90 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Share on WhatsApp"
              title="Share on WhatsApp"
            >
              {/* Share icon */}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {/* Small WhatsApp badge */}
              <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5">
                <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </span>
            </button>
          </div>

          {/* Price Overlay for Featured */}
          {variant === 'featured' && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-2xl font-bold text-green-600">
                {formatPriceWithUSD(property.price).gydPrice}
                {property.listing_type === 'rent' && (
                  <span className="text-sm font-normal text-gray-500">/month</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {formatPriceWithUSD(property.price).usdPrice}
                {property.listing_type === 'rent' && '/month'}
              </p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={cn(
          "p-4",
          variant === 'featured' && "lg:w-1/2 lg:p-6"
        )}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              {variant !== 'featured' && (
                <div>
                  <p className="text-xl font-bold text-green-600 mb-1">
                    {formatPriceWithUSD(property.price).gydPrice}
                    {property.listing_type === 'rent' && (
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatPriceWithUSD(property.price).usdPrice}
                    {property.listing_type === 'rent' && '/month'}
                  </p>
                </div>
              )}
              <h3 className={cn(
                "font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2",
                variant === 'featured' ? "text-xl mb-2" : "text-base"
              )}>
                {property.title}
              </h3>
              
              {/* FSBO Badge for grid and featured variants */}
              <FSBOBadge listedByType={property.listed_by_type} className="mt-1" />
            </div>
            <PropertyTypeIcon className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
          </div>

          {/* Property Features */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            {features.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{features.bedrooms}</span>
              </div>
            )}
            {features.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{features.bathrooms}</span>
              </div>
            )}
            {features.square_footage && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{features.square_footage.toLocaleString()}</span>
              </div>
            )}
            {/* Lot Size Display - Show dimensions for locals, area for international */}
            {(features.lot_length && features.lot_width) || (features.land_size_value) ? (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span className="text-xs">
                  {/* Show dimensions if available (familiar to Guyanese locals) */}
                  {features.lot_length && features.lot_width && (
                    <span>
                      {features.lot_length}×{features.lot_width}{features.lot_dimension_unit || 'ft'}
                      {features.land_size_value && ' • '}
                    </span>
                  )}
                  {/* Show total area (familiar to international users) */}
                  {features.land_size_value && (
                    <span>
                      {features.land_size_value.toLocaleString()}{features.land_size_unit || 'sf'}
                    </span>
                  )}
                </span>
              </div>
            ) : null}
          </div>

          {/* Description for Featured */}
          {variant === 'featured' && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {property.description}
            </p>
          )}

          {/* Contact Buttons */}
          {renderContactButtons("flex space-x-2 mb-4")}
        </div>
      </div>
    </Link>
  )
}
