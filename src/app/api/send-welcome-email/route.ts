import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, userId } = await request.json()

    const { data, error } = await resend.emails.send({
      from: 'Guyana Home Hub <noreply@guyanahomehub.com>',
      to: [email],
      subject: 'Welcome to Guyana Home Hub - Please Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Welcome to Guyana Home Hub!</h1>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for registering as an agent with Guyana Home Hub. We're excited to have you join our platform!</p>
          
          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">Next Steps:</h3>
            <ol style="color: #0c4a6e;">
              <li><strong>Verify your email</strong> - Please click the verification link sent by Supabase</li>
              <li><strong>Application Review</strong> - Our team will review your application within 2-3 business days</li>
              <li><strong>Approval Notification</strong> - You'll receive an email once approved</li>
              <li><strong>Start Listing</strong> - Begin adding properties and growing your business!</li>
            </ol>
          </div>

          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0;"><strong>Important:</strong> Your account is currently pending approval. You'll be able to access your agent dashboard once our team approves your application.</p>
          </div>

          <p>If you have any questions, feel free to contact us at <a href="mailto:info@guyanahomehub.com">info@guyanahomehub.com</a></p>
          
          <p>Best regards,<br>The Guyana Home Hub Team</p>
        </div>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
