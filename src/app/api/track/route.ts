import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  // 🚨 SAFETY CHECK: Only allow analytics if SERVICE_ROLE_KEY is properly configured
  // This prevents accidental table creation or data insertion in the wrong database
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Analytics tracking disabled: SUPABASE_SERVICE_ROLE_KEY not configured');
    return NextResponse.json({ success: true, skipped: true }); // Fail silently for UX
  }

  try {
    const body = await request.json();
    const { event, payload = {}, timestamp = new Date().toISOString() } = body;

    if (!event) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    // Get user info from headers/session (optional)
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Prepare event data
    const eventData = {
      event_name: event,
      event_data: payload,
      timestamp,
      user_agent: userAgent,
      referer,
      ip_address: ip,
      session_id: payload.session_id || null,
      ab_variant: payload.variant || null,
    };

    // Insert into analytics_events table
    const { error } = await supabase
      .from('analytics_events')
      .insert([eventData]);

    if (error) {
      console.error('Analytics tracking error:', error);
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}