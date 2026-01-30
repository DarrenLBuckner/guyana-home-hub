import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('country') || 'GY';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('mortgage_rates')
      .select('*')
      .eq('country_code', countryCode)
      .eq('is_active', true)
      .order('rate_percent', { ascending: true });

    if (error) {
      console.error('Error fetching mortgage rates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch mortgage rates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      rates: data,
      updated_at: data?.[0]?.updated_at || null,
      country_code: countryCode,
    });
  } catch (error) {
    console.error('Mortgage rates API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
