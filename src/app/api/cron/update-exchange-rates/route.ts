import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use nodejs runtime for better compatibility with Supabase
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Currencies we track (add more as we expand to new countries)
const CURRENCIES_TO_TRACK = [
  'gyd', // Guyana
  'jmd', // Jamaica
  'cop', // Colombia
  'kes', // Kenya
  'ttd', // Trinidad & Tobago
  'bbd', // Barbados
  'xcd', // East Caribbean (multiple islands)
  'eur', // Euro
  'gbp', // British Pound
  'cad', // Canadian Dollar
]

/**
 * Cron job to update exchange rates daily
 * Runs at 6 AM UTC via Vercel cron
 *
 * Uses free API: https://github.com/fawazahmed0/exchange-api
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // Allow calls from Vercel cron (has authorization header) or manual trigger in dev
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Check if this is a Vercel cron request (they send a specific header)
    const vercelCron = request.headers.get('x-vercel-cron')
    if (!vercelCron) {
      console.log('Unauthorized cron attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  console.log('Starting exchange rate update...')

  try {
    // Fetch rates from free API (no API key required)
    const response = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      { next: { revalidate: 0 } } // Don't cache this request
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`)
    }

    const data = await response.json()
    const rates = data.usd

    if (!rates) {
      throw new Error('No rates returned from API')
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update each currency
    const results: { currency: string; rate: number; status: string }[] = []

    for (const currency of CURRENCIES_TO_TRACK) {
      const rate = rates[currency]

      if (rate && typeof rate === 'number') {
        const { error } = await supabase
          .from('exchange_rates')
          .upsert(
            {
              base_currency: 'USD',
              target_currency: currency.toUpperCase(),
              rate: rate,
              inverse_rate: 1 / rate,
              source: 'fawazahmed0-api',
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'base_currency,target_currency',
            }
          )

        if (error) {
          results.push({ currency: currency.toUpperCase(), rate, status: `error: ${error.message}` })
        } else {
          results.push({ currency: currency.toUpperCase(), rate, status: 'updated' })
        }
      } else {
        results.push({ currency: currency.toUpperCase(), rate: 0, status: 'not found in API' })
      }
    }

    console.log('Exchange rate update complete:', results)

    return NextResponse.json({
      success: true,
      message: `Updated ${results.filter(r => r.status === 'updated').length} exchange rates`,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    console.error('Exchange rate update failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
