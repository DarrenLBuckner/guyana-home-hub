// src/app/api/developments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const region = searchParams.get('region') || null
    const developmentType = searchParams.get('development_type') || null
    const minPrice = searchParams.get('min_price') ? parseInt(searchParams.get('min_price')!) : null
    const maxPrice = searchParams.get('max_price') ? parseInt(searchParams.get('max_price')!) : null
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : null
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : null
    const completionStatus = searchParams.get('completion_status') || null

    // Call the Supabase function to search developments
    const { data, error } = await supabase
      .rpc('search_developments', {
        p_region: region,
        p_development_type: developmentType,
        p_min_price: minPrice,
        p_max_price: maxPrice,
        p_bedrooms: bedrooms,
        p_bathrooms: bathrooms,
        p_completion_status: completionStatus
      })

    if (error) {
      console.error('Supabase developments search error:', error)
      return NextResponse.json(
        { error: 'Failed to search developments', details: error.message },
        { status: 500 }
      )
    }

    // Format the response
    const developments = data.map((dev: any) => ({
      id: dev.id,
      title: dev.title,
      description: dev.description,
      location: `${dev.address}, ${dev.city}`,
      region: dev.region,
      developmentName: dev.development_name,
      developmentType: dev.development_type,
      developerName: dev.developer_name,
      completionStatus: dev.completion_status,
      totalUnits: dev.total_units,
      availableUnits: dev.available_units,
      expectedCompletion: dev.expected_completion_date,
      amenities: dev.development_amenities,
      priceRange: {
        min: dev.price_range_min,
        max: dev.price_range_max
      },
      images: dev.images,
      bedrooms: dev.bedrooms,
      bathrooms: dev.bathrooms,
      features: dev.features,
      createdAt: dev.created_at
    }))

    return NextResponse.json({
      success: true,
      count: developments.length,
      developments
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint for creating new developments (for agents/developers)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      location,
      region,
      developmentName,
      developmentType,
      developerName,
      developerContact,
      completionStatus,
      totalUnits,
      availableUnits,
      expectedCompletion,
      amenities,
      priceRangeMin,
      priceRangeMax,
      bedrooms,
      bathrooms,
      features,
      images
    } = body

    // Insert the development into the properties table with is_development = true
    const { data, error } = await supabase
      .from('properties')
      .insert({
        title,
        description,
        location,
        region,
        is_development: true,
        development_name: developmentName,
        development_type: developmentType,
        developer_name: developerName,
        developer_contact: developerContact,
        completion_status: completionStatus,
        total_units: totalUnits,
        available_units: availableUnits,
        expected_completion_date: expectedCompletion,
        development_amenities: amenities,
        price_range_min: priceRangeMin,
        price_range_max: priceRangeMax,
        price: priceRangeMax, // Use max price as the main price field
        bedrooms,
        bathrooms,
        features,
        images_url: images,
        status: 'pending' // Requires approval
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to create development', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Development created successfully',
      development: data
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
