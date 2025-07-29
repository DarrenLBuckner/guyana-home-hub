import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, status, message } = await request.json()

    let subject: string
    let htmlContent: string

    switch (status) {
      case 'approved':
        subject = '🎉 Your Agent Application Has Been Approved!'
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Congratulations ${name}!</h1>
            
            <p>Great news! Your agent application has been approved by our team.</p>
            
            <div style="background-color: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #15803d; margin-top: 0;">🚀 You're Now Ready to Start!</h3>
              <ul style="color: #166534;">
                <li>Log in to your agent dashboard</li>
                <li>Complete your profile</li>
                <li>Start adding property listings</li>
                <li>Begin connecting with potential buyers</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/agent-login" 
                 style="background-color: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Access Your Dashboard
              </a>
            </div>

            <p>Welcome to the Guyana Home Hub family! We're excited to work with you.</p>
            
            <p>Best regards,<br>The Guyana Home Hub Team</p>
          </div>
        `
        break

      case 'denied':
        subject = 'Update on Your Agent Application'
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">Application Update</h1>
            
            <p>Hi ${name},</p>
            
            <p>Thank you for your interest in becoming an agent with Guyana Home Hub. After careful review, we're unable to approve your application at this time.</p>
            
            ${message ? `
            <div style="background-color: #fef2f2; border: 1px solid #f87171; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #dc2626; margin-top: 0;">Additional Information:</h4>
              <p style="color: #991b1b; margin-bottom: 0;">${message}</p>
            </div>
            ` : ''}
            
            <p>You're welcome to reapply in the future as your experience and portfolio grow.</p>
            
            <p>If you have questions, please contact us at <a href="mailto:info@guyanahomehub.com">info@guyanahomehub.com</a></p>
            
            <p>Best regards,<br>The Guyana Home Hub Team</p>
          </div>
        `
        break

      case 'needs_more_info':
        subject = 'Additional Information Required - Agent Application'
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f59e0b;">Additional Information Needed</h1>
            
            <p>Hi ${name},</p>
            
            <p>Thank you for your agent application with Guyana Home Hub. We're reviewing your submission and need some additional information to complete the process.</p>
            
            <div style="background-color: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin-top: 0;">What We Need:</h4>
              <p style="color: #92400e; margin-bottom: 0;">${message}</p>
            </div>
            
            <p>Please reply to this email with the requested information, and we'll continue processing your application.</p>
            
            <p>Thank you for your patience!</p>
            
            <p>Best regards,<br>The Guyana Home Hub Team</p>
          </div>
        `
        break

      default:
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Guyana Home Hub <noreply@guyanahomehub.com>',
      to: [email],
      subject,
      html: htmlContent
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
