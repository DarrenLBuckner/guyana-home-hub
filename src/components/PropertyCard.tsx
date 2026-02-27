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
  TreePine,
  Video
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

              {/* Image Count & Video Badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                {property.video_url && (
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Video className="h-3 w-3 mr-1" />
                    Video
                  </div>
                )}
                {property.images && property.images.length > 1 && (
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                    {property.images.length} photos
                  </div>
                )}
              </div>

              {/* View Count Badge - Prominent */}
              {property.views !== undefined && property.views > 0 && (
                <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center shadow-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  {property.views.toLocaleString()}
                </div>
              )}

              {/* Watch Button */}
              <div className="absolute top-3 right-3">
                <WatchButton propertyId={property.id} variant="icon" />
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

          {/* Image Count & Video Badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {property.video_url && (
              <div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                <Video className="h-3 w-3 mr-1" />
                Video
              </div>
            )}
            {property.images && property.images.length > 1 && (
              <div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                {property.images.length} photos
              </div>
            )}
          </div>

          {/* View Count Badge - Prominent */}
          {property.views !== undefined && property.views > 0 && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center shadow-sm">
              <Eye className="h-3 w-3 mr-1" />
              {property.views.toLocaleString()}
            </div>
          )}

          {/* Watch Button */}
          <div className="absolute top-3 right-3">
            <WatchButton propertyId={property.id} variant="icon" />
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
