import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('developments')
      .select(
        'id, name, slug, tagline, description, developer_name, developer_logo, developer_website, notable_partners, location_area, city, region, development_type, total_units, units_available, price_from, price_to, currency, status, construction_start, expected_completion, amenities, key_features, hero_image, hero_image_mobile, gallery_images, floor_plan_images, video_url, virtual_tour_url, contact_phone, contact_email, contact_whatsapp, sales_office_address, featured'
      )
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Development not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      development: data,
    })
  } catch (error) {
    console.error('Development detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
