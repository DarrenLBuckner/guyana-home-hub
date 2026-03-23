import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const CONTACT_ACTIONS = ['whatsapp', 'request_viewing', 'email', 'phone'] as const
const VALID_ACTIONS = [...CONTACT_ACTIONS, 'share'] as const
const VALID_SOURCES = ['property_listing', 'agent_profile', 'search_results'] as const

type ActionType = typeof VALID_ACTIONS[number]
type SourcePage = typeof VALID_SOURCES[number]

// Service role bypasses RLS for server-side inserts.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action_type, source_page, property_id, agent_id } = body

    // Validate required fields
    if (!action_type || !source_page) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!VALID_ACTIONS.includes(action_type as ActionType)) {
      return NextResponse.json({ error: 'Invalid action_type' }, { status: 400 })
    }

    if (!VALID_SOURCES.includes(source_page as SourcePage)) {
      return NextResponse.json({ error: 'Invalid source_page' }, { status: 400 })
    }

    // Share clicks are valid but not stored in property_contact_events
    if (action_type === 'share') {
      return NextResponse.json({ success: true })
    }

    const country_code = request.headers.get('x-vercel-ip-country') ?? null
    const referrer = request.headers.get('referer') ?? null
    const userAgent = request.headers.get('user-agent') ?? null

    const { error } = await supabase
      .from('property_contact_events')
      .insert({
        action_type,
        property_id: property_id ?? null,
        agent_id: agent_id ?? null,
        territory: country_code,
        referrer,
        session_id: null,
        device: userAgent,
      })

    if (error) {
      console.error('Contact event tracking error:', error)
      return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Track click error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
