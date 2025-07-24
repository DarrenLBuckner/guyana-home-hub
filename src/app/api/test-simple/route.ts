import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // Simple test - just check if we can connect and read from properties
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, price, location')
      .limit(3)

    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json({ 
        success: false,
        error: 'Database connection failed',
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      properties_count: data ? data.length : 0,
      sample_properties: data || []
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
