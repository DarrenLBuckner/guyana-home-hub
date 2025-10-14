import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/favorites/check?property_id=xxx - Check if property is favorited by user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ is_favorited: false })
    }

    const { searchParams } = new URL(request.url)
    const property_id = searchParams.get('property_id')

    if (!property_id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    // Check if property is in user's favorites
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', property_id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking favorite:', error)
      return NextResponse.json({ error: 'Failed to check favorite status' }, { status: 500 })
    }

    return NextResponse.json({ 
      is_favorited: !!data,
      favorite_id: data?.id || null
    })

  } catch (error) {
    console.error('Check favorite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}