import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Cache for 5 minutes

/**
 * Public API endpoint to fetch exchange rates
 * Used by the currency calculator and price displays
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('exchange_rates')
      .select('target_currency, rate, inverse_rate, updated_at, source')
      .order('target_currency')

    if (error) {
      console.error('Failed to fetch exchange rates:', error)
      return NextResponse.json(
        { error: 'Failed to fetch exchange rates' },
        { status: 500 }
      )
    }

    // Transform to a more usable format
    const rates: Record<string, number> = {}
    const inverseRates: Record<string, number> = {}

    data?.forEach((row) => {
      rates[row.target_currency] = row.rate
      inverseRates[row.target_currency] = row.inverse_rate
    })

    return NextResponse.json({
      success: true,
      base: 'USD',
      rates,
      inverseRates,
      currencies: data,
      updated_at: data?.[0]?.updated_at || new Date().toISOString(),
    })
  } catch (error) {
    console.error('Exchange rates API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
