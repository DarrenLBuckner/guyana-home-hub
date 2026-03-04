/**
 * Deployment Sync Script: Supabase territories → Vercel Edge Config
 *
 * Runs before every production build to ensure Edge Config
 * has all territory data. Fails the build if sync fails.
 *
 * Usage:
 *   npm run sync-territories
 *   (also runs automatically via vercel-build)
 */

import dotenv from 'dotenv'
import path from 'path'

// Load .env.local for local runs (Vercel injects env vars in CI)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

interface Territory {
  country_code: string
  status: string
  display_name: string
  domain: string
  default_language: string
  flag_emoji: string | null
  primary_color: string | null
}

async function syncEdgeConfig() {
  console.log('🔄 Starting Edge Config territory sync...\n')

  // 1. Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const edgeConfigUrl = process.env.EDGE_CONFIG
  const vercelTeamId = process.env.VERCEL_TEAM_ID

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  if (!edgeConfigUrl) {
    console.error('❌ Missing EDGE_CONFIG environment variable')
    process.exit(1)
  }

  const vercelToken = process.env.VERCEL_TOKEN
  if (!vercelToken) {
    console.error('❌ VERCEL_TOKEN environment variable not set')
    console.error('   Create a token at: https://vercel.com/account/tokens')
    process.exit(1)
  }

  // 2. Parse Edge Config connection string
  const url = new URL(edgeConfigUrl)
  const edgeConfigId = url.pathname.split('/').pop()
  const readToken = url.searchParams.get('token')

  if (!edgeConfigId || !readToken) {
    console.error('❌ Invalid EDGE_CONFIG format: missing ID or read token')
    process.exit(1)
  }

  // 3. Fetch territories from Supabase
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: territories, error: fetchError } = await supabase
    .from('territories')
    .select('country_code, status, display_name, domain, default_language, flag_emoji, primary_color')

  if (fetchError) {
    console.error('❌ Failed to fetch territories from Supabase:', fetchError.message)
    process.exit(1)
  }

  if (!territories || territories.length === 0) {
    console.error('❌ No territories found in Supabase. Cannot deploy with empty Edge Config.')
    process.exit(1)
  }

  console.log(`📦 Found ${territories.length} territories in Supabase:`)
  territories.forEach((t: Territory) => {
    console.log(`   ${t.flag_emoji || '  '} ${t.country_code} - ${t.display_name} [${t.status}]`)
  })
  console.log()

  // 4. Transform into Edge Config upsert items
  const items = territories.map((t: Territory) => ({
    operation: 'upsert',
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

  // 5. Push to Edge Config via Vercel API
  const teamQuery = vercelTeamId ? `?teamId=${vercelTeamId}` : ''
  const apiUrl = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamQuery}`

  console.log('⬆️  Pushing to Edge Config...')

  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`❌ Edge Config update failed (${response.status}): ${body}`)
    process.exit(1)
  }

  // 6. Verify by reading back one key
  const verifyUrl = `https://edge-config.vercel.com/${edgeConfigId}/item/${territories[0].country_code}?token=${readToken}`
  const verifyResponse = await fetch(verifyUrl)

  if (verifyResponse.ok) {
    console.log(`✅ Verified: ${territories[0].country_code} readable from Edge Config`)
  } else {
    console.warn(`⚠️  Verification read failed (non-fatal): ${verifyResponse.status}`)
  }

  console.log(`\n✅ Successfully synced ${territories.length} territories to Edge Config`)
  console.log(`   Synced at: ${new Date().toISOString()}`)
}

syncEdgeConfig().catch((error) => {
  console.error('❌ Unexpected error during sync:', error)
  process.exit(1)
})
