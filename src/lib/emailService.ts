// Enterprise Email Service with Templates and Analytics
import nodemailer from 'nodemailer'

// Email Templates
export const EmailTemplates = {
  agentNewInquiry: (data: any) => ({
    subject: `🏠 New Property Inquiry - ${data.propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .property-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #16a34a; }
            .customer-info { background: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .cta-button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
            .urgent { background: #fef2f2; border-left-color: #ef4444; }
            .stats { display: flex; justify-content: space-around; text-align: center; margin: 20px 0; }
            .stat { padding: 10px; }
            .stat-number { font-size: 24px; font-weight: bold; color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Property Inquiry!</h1>
              <p>You have a potential customer interested in your property</p>
            </div>
            
            <div class="content">
              <div class="property-card ${data.isUrgent ? 'urgent' : ''}">
                <h3>📍 ${data.propertyTitle}</h3>
                <p><strong>Location:</strong> ${data.propertyLocation}</p>
                <p><strong>Price:</strong> GYD ${data.propertyPrice.toLocaleString()}${data.priceType === 'rent' ? '/month' : ''}</p>
                <p><strong>Inquiry Type:</strong> ${data.inquiryType.toUpperCase()}</p>
                ${data.isUrgent ? '<p style="color: #ef4444; font-weight: bold;">⚡ HIGH PRIORITY INQUIRY</p>' : ''}
              </div>

              <div class="customer-info">
                <h4>👤 Customer Details</h4>
                <p><strong>Name:</strong> ${data.customerName}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
                ${data.customerPhone ? `<p><strong>Phone:</strong> <a href="tel:${data.customerPhone}">${data.customerPhone}</a></p>` : ''}
                <p><strong>Preferred Contact:</strong> ${data.preferredContact}</p>
                <p><strong>Best Time to Call:</strong> ${data.bestTimeToCall || 'Not specified'}</p>
              </div>

              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4>💬 Customer Message</h4>
                <p style="font-style: italic; border-left: 3px solid #16a34a; padding-left: 15px;">"${data.message}"</p>
              </div>

              <div class="stats">
                <div class="stat">
                  <div class="stat-number">${data.responseTime || '< 1hr'}</div>
                  <div>Avg Response Time</div>
                </div>
                <div class="stat">
                  <div class="stat-number">${data.conversionRate || '23%'}</div>
                  <div>Conversion Rate</div>
                </div>
                <div class="stat">
                  <div class="stat-number">${data.totalInquiries || 'N/A'}</div>
                  <div>Total Inquiries</div>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.dashboardUrl}" class="cta-button">📊 View in Dashboard</a>
                <a href="mailto:${data.customerEmail}?subject=Re: Your inquiry about ${data.propertyTitle}" class="cta-button">✉️ Email Customer</a>
                ${data.customerPhone ? `<a href="tel:${data.customerPhone}" class="cta-button">📞 Call Customer</a>` : ''}
              </div>

              <div style="background: #fffbeb; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <h4>💡 Pro Tips for Higher Conversion</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Respond within 1 hour for 7x higher conversion rate</li>
                  <li>Personalize your response mentioning specific property features</li>
                  <li>Offer immediate viewing slots or virtual tour</li>
                  <li>Follow up within 24 hours if no initial response</li>
                </ul>
              </div>
            </div>

            <div class="footer">
              <p>This inquiry was received on ${new Date().toLocaleString()}</p>
              <p>Powered by Guyana Home Hub | <a href="${data.unsubscribeUrl}">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  customerConfirmation: (data: any) => ({
    subject: `✅ Your inquiry about ${data.propertyTitle} has been received`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .cta-button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Inquiry Received!</h1>
              <p>Thank you for your interest in ${data.propertyTitle}</p>
            </div>
            
            <div class="content">
              <p>Hi ${data.customerName},</p>
              
              <p>We've received your inquiry about <strong>${data.propertyTitle}</strong> and have forwarded it to the property agent. Here's what happens next:</p>
              
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4>⏰ What to Expect</h4>
                <ul>
                  <li><strong>Within 1 hour:</strong> Agent will review your inquiry</li>
                  <li><strong>Within 4 hours:</strong> You'll receive a personal response</li>
                  <li><strong>Within 24 hours:</strong> Viewing appointment can be scheduled</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.propertyUrl}" class="cta-button">🏠 View Property Details</a>
                <a href="${data.searchUrl}" class="cta-button">🔍 Browse Similar Properties</a>
              </div>

              <p>If you need immediate assistance, feel free to contact us at <a href="tel:+592-XXX-XXXX">+592-XXX-XXXX</a></p>
            </div>

            <div class="footer">
              <p>Guyana Home Hub - Your trusted property partner</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  agentFollowUp: (data: any) => ({
    subject: `⏰ Follow-up reminder: ${data.customerName} inquiry`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Follow-up Reminder</h1>
              <p>Don't lose this potential customer!</p>
            </div>
            
            <div class="content">
              <p>Hi ${data.agentName},</p>
              
              <p>You received an inquiry from <strong>${data.customerName}</strong> about <strong>${data.propertyTitle}</strong> ${data.hoursAgo} hours ago.</p>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h4>📈 Did you know?</h4>
                <p>Following up within 24 hours increases conversion rates by <strong>60%</strong></p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.inquiryUrl}" class="cta-button">📝 Respond to Inquiry</a>
                <a href="mailto:${data.customerEmail}" class="cta-button">✉️ Email Customer</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  })
}

// Enterprise Email Service
export class EmailNotificationService {
  private transporter: any

  constructor() {
    // Configure with your preferred email service
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  async sendAgentNotification(data: any) {
    const template = EmailTemplates.agentNewInquiry({
      ...data,
      dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/agent/inquiries`,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${data.agentEmail}`,
      isUrgent: data.inquiryType === 'offer' || data.message.toLowerCase().includes('urgent'),
      bestTimeToCall: data.bestTimeToCall || 'Not specified'
    })

    await this.transporter.sendMail({
      from: `"Guyana Home Hub" <${process.env.FROM_EMAIL}>`,
      to: data.agentEmail,
      subject: template.subject,
      html: template.html
    })

    // Send customer confirmation
    await this.sendCustomerConfirmation(data)

    // Schedule follow-up reminder
    await this.scheduleFollowUp(data)
  }

  async sendCustomerConfirmation(data: any) {
    const template = EmailTemplates.customerConfirmation({
      ...data,
      propertyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/properties/${data.propertyId}`,
      searchUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/properties/buy`
    })

    await this.transporter.sendMail({
      from: `"Guyana Home Hub" <${process.env.FROM_EMAIL}>`,
      to: data.customerEmail,
      subject: template.subject,
      html: template.html
    })
  }

  async scheduleFollowUp(data: any) {
    // This would integrate with a job queue like Bull/Agenda for production
    setTimeout(async () => {
      // Check if agent has responded
      const hasResponded = await this.checkAgentResponse(data.inquiryId)
      
      if (!hasResponded) {
        const template = EmailTemplates.agentFollowUp({
          ...data,
          hoursAgo: 24,
          inquiryUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/agent/inquiries`
        })

        await this.transporter.sendMail({
          from: `"Guyana Home Hub" <${process.env.FROM_EMAIL}>`,
          to: data.agentEmail,
          subject: template.subject,
          html: template.html
        })
      }
    }, 24 * 60 * 60 * 1000) // 24 hours
  }

  private async checkAgentResponse(inquiryId: string): Promise<boolean> {
    // Implementation to check if agent has responded
    return false
  }
}
