// Zillow-style Property Card - Modern Real Estate Display
// src/components/PropertyCard.tsx

'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Eye,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
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

interface PropertyCardProps {
  property: Property
  variant?: 'grid' | 'list' | 'featured'
  showStats?: boolean
  showContactButtons?: boolean
  favoriteAction?: (propertyId: string) => void
  shareAction?: (property: Property) => void
  contactAction?: (property: Property) => void
  className?: string
}

export function PropertyCard({ 
  property, 
  variant = 'grid',
  showStats = true,
  showContactButtons = false,
  favoriteAction,
  shareAction,
  contactAction,
  className 
}: PropertyCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)

  const formatPrice = (price: number) => {
    return CurrencyFormatter.property(price)
  }

  const formatPriceWithUSD = (price: number) => {
    const gydPrice = `G$${price.toLocaleString()}`
    const usdPrice = `~US$${convertGydToUsd(price).toLocaleString()}`
    return { gydPrice, usdPrice }
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


  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    favoriteAction?.(property.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    shareAction?.(property)
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
                src={property.images?.[0]?.url || '/images/placeholder-property.jpg'}
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
                  <Eye className="h-3 w-3 mr-1" />
                  {property.images.length}
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={handleFavorite}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isFavorited 
                      ? "bg-red-500 text-white" 
                      : "bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Share2 className="h-4 w-4" />
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

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              {/* Property Features */}
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                {property.features.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.features.bedrooms} bed{property.features.bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {property.features.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.features.bathrooms} bath{property.features.bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {property.features.square_footage && (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.features.square_footage.toLocaleString()} sq ft</span>
                  </div>
                )}
                {/* Lot Size Display - Show both dimensions and total area */}
                {(property.features.lot_length && property.features.lot_width) || (property.features.land_size_value) ? (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>
                      {/* Show dimensions if available (familiar to Guyanese locals) */}
                      {property.features.lot_length && property.features.lot_width && (
                        <span>
                          {property.features.lot_length}×{property.features.lot_width}{property.features.lot_dimension_unit || 'ft'}
                          {property.features.land_size_value && ' • '}
                        </span>
                      )}
                      {/* Show total area (familiar to international users) */}
                      {property.features.land_size_value && (
                        <span>
                          {property.features.land_size_value.toLocaleString()} {property.features.land_size_unit || 'sq ft'}
                        </span>
                      )}
                    </span>
                  </div>
                ) : null}
                {property.features.parking_spaces && (
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-1" />
                    <span>{property.features.parking_spaces} car{property.features.parking_spaces !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {property.description}
              </p>

              {/* Contact Buttons */}
              {renderContactButtons("flex space-x-3")}

              {/* Stats */}
              {showStats && property.metadata.views && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-500">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{property.metadata.views} views</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Listed {new Date(property.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
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
            src={property.images?.[0]?.url || '/images/placeholder-property.jpg'}
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
              <Eye className="h-3 w-3 mr-1" />
              {property.images.length}
            </div>
          )}

          {/* Actions */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={handleFavorite}
              className={cn(
                "p-2 rounded-full transition-colors",
                isFavorited 
                  ? "bg-red-500 text-white" 
                  : "bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Share2 className="h-4 w-4" />
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

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>

          {/* Property Features */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            {property.features.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.features.bathrooms}</span>
              </div>
            )}
            {property.features.square_footage && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.features.square_footage.toLocaleString()}</span>
              </div>
            )}
            {/* Lot Size Display - Show dimensions for locals, area for international */}
            {(property.features.lot_length && property.features.lot_width) || (property.features.land_size_value) ? (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span className="text-xs">
                  {/* Show dimensions if available (familiar to Guyanese locals) */}
                  {property.features.lot_length && property.features.lot_width && (
                    <span>
                      {property.features.lot_length}×{property.features.lot_width}{property.features.lot_dimension_unit || 'ft'}
                      {property.features.land_size_value && ' • '}
                    </span>
                  )}
                  {/* Show total area (familiar to international users) */}
                  {property.features.land_size_value && (
                    <span>
                      {property.features.land_size_value.toLocaleString()}{property.features.land_size_unit || 'sf'}
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

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
              {property.metadata.views && (
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{property.metadata.views} views</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Listed {new Date(property.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
