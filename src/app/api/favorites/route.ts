import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's favorites with property details
    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
    }

    // For each favorite, try to get current property data from portal
    const enrichedFavorites = await Promise.all(
      favorites.map(async (favorite) => {
        try {
          // Get country for site context
          const cookieStore = await cookies()
          const countryCode = cookieStore.get('country-code')?.value || 'GY'
          const siteMapping = { 'GY': 'guyana', 'JM': 'jamaica' }
          const siteName = siteMapping[countryCode as keyof typeof siteMapping] || 'guyana'
          
          // Try to get current property data with site context
          const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com'
          const response = await fetch(`${portalApiUrl}/api/public/properties/${favorite.property_id}`, {
            headers: {
              'x-site-id': siteName
            }
          })
          
          if (response.ok) {
            const currentProperty = await response.json()
            return {
              ...favorite,
              current_property: currentProperty,
              is_current: true
            }
          } else {
            // Property no longer available, use snapshot data
            return {
              ...favorite,
              current_property: null,
              is_current: false
            }
          }
        } catch (error) {
          console.error(`Error fetching property ${favorite.property_id}:`, error)
          return {
            ...favorite,
            current_property: null,
            is_current: false
          }
        }
      })
    )

    return NextResponse.json({ 
      favorites: enrichedFavorites,
      total: favorites.length 
    })

  } catch (error) {
    console.error('Favorites API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/favorites - Add property to favorites
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { property_id } = body

    if (!property_id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    // Add to favorites (only columns that exist on user_favorites table)
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_email: user.email,
        property_id,
        site_id: 'guyana'
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Property already in favorites' }, { status: 409 })
      }
      console.error('Error adding favorite:', error)
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Added to favorites',
      favorite: data 
    }, { status: 201 })

  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/favorites - Remove property from favorites
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { property_id } = body

    if (!property_id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_email', user.email)
      .eq('property_id', property_id)

    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Removed from favorites' })

  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}