import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key')

// POST /api/notifications/subscribe - Subscribe to property alerts
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      email_price_alerts = true,
      email_new_listings = true,
      email_property_updates = true,
      email_weekly_digest = true,
      preferred_regions = [],
      preferred_property_types = [],
      max_price,
      min_price,
      contact_whatsapp 
    } = body

    // Update or create notification preferences
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        contact_email: user.email,
        email_price_alerts,
        email_new_listings,
        email_property_updates,
        email_weekly_digest,
        preferred_regions,
        preferred_property_types,
        max_price,
        min_price,
        contact_whatsapp
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating notification preferences:', error)
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
    }

    // Send welcome email if this is their first subscription
    if (email_new_listings || email_price_alerts) {
      try {
        await resend.emails.send({
          from: 'Guyana Home Hub <no-reply@guyanahomehub.com>',
          to: user.email!,
          subject: 'Welcome to Guyana Home Hub Alerts!',
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #059669;">Welcome to Guyana Home Hub Property Alerts!</h2>
              
              <p>Hi ${user.email?.split('@')[0]},</p>
              
              <p>You've successfully subscribed to property alerts. Here's what you can expect:</p>
              
              <ul>
                ${email_new_listings ? '<li>✅ New property listings matching your criteria</li>' : ''}
                ${email_price_alerts ? '<li>✅ Price changes on your favorite properties</li>' : ''}
                ${email_property_updates ? '<li>✅ Updates on properties you\'re following</li>' : ''}
                ${email_weekly_digest ? '<li>✅ Weekly market digest</li>' : ''}
              </ul>
              
              <p>You can manage your preferences anytime by visiting your <a href="${process.env.NEXT_PUBLIC_PORTAL_API_URL}/favorites" style="color: #059669;">favorites page</a>.</p>
              
              <p>Happy house hunting!</p>
              
              <p>Best regards,<br>The Guyana Home Hub Team</p>
              
              <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                You're receiving this email because you subscribed to property alerts on Guyana Home Hub.
                <a href="${process.env.NEXT_PUBLIC_PORTAL_API_URL}/unsubscribe" style="color: #059669;">Unsubscribe</a>
              </p>
            </div>
          `
        })
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ 
      message: 'Notification preferences updated successfully',
      preferences: data 
    })

  } catch (error) {
    console.error('Subscribe notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/notifications/subscribe - Get user's notification preferences
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's notification preferences
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching notification preferences:', error)
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
    }

    // Return default preferences if none exist
    const preferences = data || {
      email_price_alerts: true,
      email_new_listings: true,
      email_property_updates: true,
      email_weekly_digest: true,
      preferred_regions: [],
      preferred_property_types: [],
      max_price: null,
      min_price: null,
      contact_email: user.email,
      contact_whatsapp: null
    }

    return NextResponse.json({ preferences })

  } catch (error) {
    console.error('Get notification preferences error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}