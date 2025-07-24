import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // Try to select all columns from the first property to see the schema
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error fetching properties:', error)
      return NextResponse.json({ 
        error: error.message,
        message: 'Error fetching properties',
        details: error.details || 'No additional details',
        hint: error.hint || 'Check your database schema and RLS policies',
        code: error.code || 'Unknown error code'
      }, { status: 500 })
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0])
      return NextResponse.json({ 
        message: 'Properties table columns',
        columns,
        sampleRow: data[0]
      })
    } else {
      return NextResponse.json({ 
        message: 'No properties found in table',
        columns: []
      })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No stack trace available'
    }, { status: 500 })
  }
}
