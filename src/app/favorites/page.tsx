'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Heart,
  Home,
  MapPin,
  Calendar,
  AlertCircle,
  Bed,
  Bath,
  Square,
  X
} from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'

export default function FavoritesPage() {
  const router = useRouter()
  const { favorites, loading, user, removeFromFavorites, favoritesCount } = useFavorites()

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  const formatPrice = (price: number, listingType?: string) => {
    const formatted = price?.toLocaleString() || '0'
    return listingType === 'rent' ? `GYD ${formatted}/month` : `GYD ${formatted}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-green-700 mb-2">My Favorites</h1>
              <p className="text-gray-600">
                {favoritesCount} {favoritesCount === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
            <Link 
              href="/properties/buy"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse More Properties
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">No favorites yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start browsing properties and click the heart icon to save your favorites. 
              They'll appear here for easy access.
            </p>
            <div className="space-x-4">
              <Link 
                href="/properties/buy"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
              >
                Browse Properties for Sale
              </Link>
              <Link 
                href="/properties/rent"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block"
              >
                Browse Rentals
              </Link>
            </div>
          </div>
        ) : (
          // Favorites grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const property = favorite.current_property || favorite
              const isStale = !favorite.is_current

              return (
                <div 
                  key={favorite.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                    isStale ? 'border-2 border-orange-200' : ''
                  }`}
                >
                  {/* Property Image */}
                  <div className="relative h-48">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title || favorite.property_title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${
                      property.images && property.images.length > 0 ? 'hidden' : ''
                    }`}>
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                    
                    {/* Status badges */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {favorite.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </div>
                    
                    {isStale && (
                      <div className="absolute top-2 right-12">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          May be sold
                        </span>
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromFavorites(favorite.property_id)}
                      className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full shadow transition-colors"
                      title="Remove from favorites"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {property.title || favorite.property_title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {property.location || favorite.property_location || 'Location not specified'}
                      </span>
                    </div>

                    <div className="text-2xl font-bold text-green-600 mb-3">
                      {formatPrice(property.price || favorite.property_price, favorite.listing_type)}
                    </div>

                    {/* Property Features */}
                    {(property.bedrooms || property.bathrooms || property.home_size) && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                        {property.home_size && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            <span>{property.home_size} sq ft</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Saved date */}
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Saved {formatDate(favorite.created_at)}</span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      {favorite.is_current ? (
                        <Link 
                          href={`/properties/${favorite.property_id}`}
                          className="block w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition-colors"
                        >
                          View Details
                        </Link>
                      ) : (
                        <div className="text-center">
                          <p className="text-orange-600 text-sm mb-2">This property may no longer be available</p>
                          <Link 
                            href="/properties/buy"
                            className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
                          >
                            Browse Similar Properties
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}