import { NextRequest, NextResponse } from 'next/server'

const RESEND_AUDIENCE_ID = 'b1fda179-a100-461d-9c9c-eb0c19da466b'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source, site, pageUrl, utmSource, utmMedium, utmCampaign } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Add to Resend audience (non-blocking, don't fail if this errors)
    try {
      const resendResponse = await fetch(
        `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            unsubscribed: false,
          }),
        }
      )

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text()
        console.error('Resend audience add failed:', errorData)
      } else {
        console.log('Successfully added to Resend audience:', email)
      }
    } catch (resendError) {
      // Log but don't fail the signup
      console.error('Resend audience error:', resendError)
    }

    // Forward to portalhomehub.com (existing flow)
    const portalResponse = await fetch('https://www.portalhomehub.com/api/email-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        source,
        site,
        pageUrl,
        utmSource,
        utmMedium,
        utmCampaign,
      }),
    })

    if (!portalResponse.ok) {
      const errorData = await portalResponse.text()
      console.error('Portal signup failed:', errorData)
      return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Signup successful' })

  } catch (error) {
    console.error('Email signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
