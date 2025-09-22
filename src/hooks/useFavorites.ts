import { useState, useEffect } from 'react'
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

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string, boolean>>({})
  const supabase = createClient()
  const router = useRouter()

  // Check if user is authenticated
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

  // Fetch user's favorites
  const fetchFavorites = async () => {
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
  }

  // Check if a specific property is favorited
  const checkFavoriteStatus = async (propertyId: string) => {
    if (!user) return false

    try {
      const response = await fetch(`/api/favorites/check?property_id=${propertyId}`)
      if (response.ok) {
        const data = await response.json()
        setFavoriteStatus(prev => ({
          ...prev,
          [propertyId]: data.is_favorited
        }))
        return data.is_favorited
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
    return false
  }

  // Add property to favorites
  const addToFavorites = async (property: Property) => {
    if (!user) {
      // Redirect to sign in
      router.push('/signin')
      return false
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
        // Refresh favorites list
        fetchFavorites()
        return true
      } else if (response.status === 409) {
        // Already favorited
        setFavoriteStatus(prev => ({
          ...prev,
          [property.id]: true
        }))
        return true
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
    }
    return false
  }

  // Remove property from favorites
  const removeFromFavorites = async (propertyId: string) => {
    if (!user) return false

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
        // Refresh favorites list
        fetchFavorites()
        return true
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
    return false
  }

  // Toggle favorite status
  const toggleFavorite = async (property: Property) => {
    const isCurrentlyFavorited = favoriteStatus[property.id]
    
    if (isCurrentlyFavorited) {
      return await removeFromFavorites(property.id)
    } else {
      return await addToFavorites(property)
    }
  }

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      setFavorites([])
      setFavoriteStatus({})
    }
  }, [user])

  return {
    favorites,
    loading,
    favoriteStatus,
    user,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    checkFavoriteStatus,
    fetchFavorites,
    favoritesCount: favorites.length
  }
}