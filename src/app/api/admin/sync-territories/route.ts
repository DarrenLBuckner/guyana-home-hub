import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  const supabase = await createClient()

  try {
    // 1. Authentication check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify super admin via profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('admin_level')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 403 }
      )
    }

    if (profile.admin_level !== 'super') {
      return NextResponse.json(
        { success: false, error: 'Requires super admin privileges' },
        { status: 403 }
      )
    }

    // 3. Fetch territories from Supabase
    const { data: territories, error: fetchError } = await supabase
      .from('territories')
      .select('country_code, status, display_name, domain, default_language, flag_emoji, primary_color')

    if (fetchError) {
      throw new Error(`Failed to fetch territories: ${fetchError.message}`)
    }

    if (!territories || territories.length === 0) {
      throw new Error('No territories found in database')
    }

    // 4. Transform for Edge Config (keyed by country_code)
    const edgeConfigItems = territories.map((t) => ({
      operation: 'upsert' as const,
      key: t.country_code,
      value: {
        status: t.status,
        display_name: t.display_name,
        domain: t.domain,
        default_language: t.default_language,
        flag_emoji: t.flag_emoji,
        primary_color: t.primary_color,
      },
    }))

    // 5. Parse EDGE_CONFIG connection string to extract ID and token
    const edgeConfigUrl = process.env.EDGE_CONFIG
    if (!edgeConfigUrl) {
      throw new Error('EDGE_CONFIG environment variable is not set')
    }

    const url = new URL(edgeConfigUrl)
    const edgeConfigId = url.pathname.split('/').pop()

    if (!edgeConfigId) {
      throw new Error('Invalid EDGE_CONFIG connection string: missing ID')
    }

    // 6. Update Edge Config via Vercel REST API
    const vercelToken = process.env.VERCEL_TOKEN
    if (!vercelToken) {
      throw new Error('VERCEL_TOKEN environment variable is not set')
    }

    const vercelTeamId = process.env.VERCEL_TEAM_ID
    const teamQuery = vercelTeamId ? `?teamId=${vercelTeamId}` : ''

    const updateResponse = await fetch(
      `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamQuery}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: edgeConfigItems }),
      }
    )

    if (!updateResponse.ok) {
      const errorBody = await updateResponse.text()
      throw new Error(`Edge Config update failed (${updateResponse.status}): ${errorBody}`)
    }

    const syncedAt = new Date().toISOString()

    // 7. Log successful sync
    await supabase.from('edge_config_sync_log').insert({
      sync_status: 'success',
      territories_synced: territories.length,
      synced_by: user.id,
    })

    return NextResponse.json({
      success: true,
      territories_synced: territories.length,
      synced_at: syncedAt,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Territory sync failed:', message)

    // Log failed sync (best-effort, don't throw if logging fails)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('edge_config_sync_log').insert({
        sync_status: 'failed',
        territories_synced: 0,
        error_message: message,
        synced_by: user?.id ?? null,
      })
    } catch { /* ignore logging errors */ }

    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
