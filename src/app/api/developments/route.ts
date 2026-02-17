import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const featured = searchParams.get('featured')

    let query = supabase
      .from('developments')
      .select(
        'id, name, slug, tagline, developer_name, notable_partners, location_area, city, development_type, total_units, price_from, price_to, currency, status, hero_image, hero_image_mobile, featured'
      )
      .eq('published', true)

    if (status) {
      query = query.eq('status', status)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    query = query
      .order('featured_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching developments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch developments' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      developments: data,
      total: data?.length ?? 0,
    })
  } catch (error) {
    console.error('Developments API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
