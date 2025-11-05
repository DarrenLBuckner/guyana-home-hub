import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Property {
  id: string
  title: string
  price: number
  location: string
  property_type: string
  listing_type: string
}

interface LikesData {
  likes_count: number
  user_has_liked: boolean
  property_id: string
}

interface Favorite {
  id: string
  property_id: string
  property_title: string
  property_price: number
  property_location: string
  property_type: string
  listing_type: string
  current_property?: any
  is_current: boolean
  created_at: string
}

export function usePropertyEngagement() {
  // Favorites state (existing system)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string, boolean>>({})
  
  // Likes state (new system)
  const [likesData, setLikesData] = useState<Record<string, LikesData>>({})
  const [likesLoading, setLikesLoading] = useState<Record<string, boolean>>({})
  
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // User authentication state
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Fetch likes data for a property (anonymous - no auth required)
  const fetchLikes = useCallback(async (propertyId: string) => {
    setLikesLoading(prev => ({ ...prev, [propertyId]: true }))
    
    try {
      const response = await fetch(`/api/public/properties/${propertyId}/likes`)
      if (response.ok) {
        const data = await response.json()
        setLikesData(prev => ({
          ...prev,
          [propertyId]: data
        }))
        return data
      }
    } catch (error) {
      console.error('Error fetching likes:', error)
    } finally {
      setLikesLoading(prev => ({ ...prev, [propertyId]: false }))
    }
    
    return { likes_count: 0, user_has_liked: false, property_id: propertyId }
  }, [])

  // Add a like (anonymous - no auth required)
  const addLike = useCallback(async (propertyId: string) => {
    setLikesLoading(prev => ({ ...prev, [propertyId]: true }))
    
    try {
      const response = await fetch(`/api/public/properties/${propertyId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (response.ok) {
        setLikesData(prev => ({
          ...prev,
          [propertyId]: data
        }))
        return { success: true, data }
      } else {
        return { success: false, error: data.error || 'Failed to add like' }
      }
    } catch (error) {
      console.error('Error adding like:', error)
      return { success: false, error: 'Network error' }
    } finally {
      setLikesLoading(prev => ({ ...prev, [propertyId]: false }))
    }
  }, [])

  // Fetch user's favorites (authenticated - existing system)
  const fetchFavorites = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
        
        // Update favorite status map
        const statusMap: Record<string, boolean> = {}
        data.favorites.forEach((fav: Favorite) => {
          statusMap[fav.property_id] = true
        })
        setFavoriteStatus(statusMap)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Add property to favorites (authenticated - existing system)
  const addToFavorites = useCallback(async (property: Property) => {
    if (!user) {
      // Show sign-in prompt instead of immediate redirect
      return { success: false, requiresAuth: true }
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: property.id,
          property_title: property.title,
          property_price: property.price,
          property_location: property.location,
          property_type: property.property_type,
          listing_type: property.listing_type
        }),
      })

      if (response.ok) {
        setFavoriteStatus(prev => ({
          ...prev,
          [property.id]: true
        }))
        fetchFavorites() // Refresh favorites list
        return { success: true }
      } else if (response.status === 409) {
        // Already favorited
        setFavoriteStatus(prev => ({
          ...prev,
          [property.id]: true
        }))
        return { success: true }
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
    }
    return { success: false }
  }, [user, fetchFavorites])

  // Remove property from favorites (authenticated - existing system)
  const removeFromFavorites = useCallback(async (propertyId: string) => {
    if (!user) return { success: false, requiresAuth: true }

    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId
        }),
      })

      if (response.ok) {
        setFavoriteStatus(prev => ({
          ...prev,
          [propertyId]: false
        }))
        fetchFavorites() // Refresh favorites list
        return { success: true }
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
    return { success: false }
  }, [user, fetchFavorites])

  // Toggle favorite status (authenticated - existing system)
  const toggleFavorite = useCallback(async (property: Property) => {
    const isCurrentlyFavorited = favoriteStatus[property.id]
    
    if (isCurrentlyFavorited) {
      return await removeFromFavorites(property.id)
    } else {
      return await addToFavorites(property)
    }
  }, [favoriteStatus, addToFavorites, removeFromFavorites])

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      setFavorites([])
      setFavoriteStatus({})
    }
  }, [user, fetchFavorites])

  return {
    // Likes system (anonymous)
    likesData,
    likesLoading,
    fetchLikes,
    addLike,
    
    // Favorites system (authenticated)
    favorites,
    favoriteStatus,
    loading,
    user,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    fetchFavorites,
    favoritesCount: favorites.length,

    // Helper functions
    getLikesCount: (propertyId: string) => likesData[propertyId]?.likes_count || 0,
    getUserHasLiked: (propertyId: string) => likesData[propertyId]?.user_has_liked || false,
    isFavorited: (propertyId: string) => favoriteStatus[propertyId] || false,
    isLikesLoading: (propertyId: string) => likesLoading[propertyId] || false
  }
}