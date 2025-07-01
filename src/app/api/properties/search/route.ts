// src/app/api/properties/search/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: Request) {
  // grab the ?q= search term from the URL
  const url = new URL(req.url)
  const q = url.searchParams.get('q')?.trim() ?? ''

  // query Supabase for approved listings that match title or description
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, price, status, property_images (url)')
    .eq('status', 'approved')
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)

  if (error) {
    console.error('Supabase search error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
