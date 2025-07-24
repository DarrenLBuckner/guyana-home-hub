// Automated Follow-up System
import { createClient } from '@/lib/supabase/client'
import { Resend } from 'resend'

interface FollowUpRule {
  id: string
  name: string
  trigger: 'stage_change' | 'time_based' | 'inactivity' | 'property_match'
  conditions: {
    stage?: string
    daysSince?: number
    inactivityDays?: number
    propertyType?: string
  }
  actions: {
    sendEmail?: boolean
    createTask?: boolean
    changeStage?: string
    assignAgent?: string
    emailTemplate?: string
    priority?: string
  }
  active: boolean
}

interface FollowUpTask {
  id: string
  customer_id: string
  type: 'email' | 'call' | 'meeting' | 'property_tour'
  subject: string
  description: string
  scheduled_date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'completed' | 'cancelled'
  agent_id: string
  created_at: string
}

export class FollowUpAutomation {
  private supabase = createClient()
  private resend = new Resend(process.env.RESEND_API_KEY)

  // Default follow-up rules
  private defaultRules: FollowUpRule[] = [
    {
      id: 'new-lead-welcome',
      name: 'New Lead Welcome Sequence',
      trigger: 'stage_change',
      conditions: { stage: 'lead' },
      actions: {
        sendEmail: true,
        emailTemplate: 'welcome-new-lead',
        createTask: true
      },
      active: true
    },
    {
      id: 'contact-follow-up',
      name: 'Contact Follow-up (24hrs)',
      trigger: 'time_based',
      conditions: { daysSince: 1 },
      actions: {
        sendEmail: true,
        emailTemplate: 'contact-follow-up',
        createTask: true
      },
      active: true
    },
    {
      id: 'qualification-reminder',
      name: 'Qualification Reminder (3 days)',
      trigger: 'inactivity',
      conditions: { inactivityDays: 3 },
      actions: {
        sendEmail: true,
        emailTemplate: 'qualification-reminder',
        createTask: true
      },
      active: true
    },
    {
      id: 'negotiation-push',
      name: 'Negotiation Push (7 days)',
      trigger: 'inactivity',
      conditions: { inactivityDays: 7, stage: 'negotiating' },
      actions: {
        sendEmail: true,
        emailTemplate: 'negotiation-push',
        createTask: true,
        priority: 'high'
      },
      active: true
    },
    {
      id: 'lost-lead-reactivation',
      name: 'Lost Lead Reactivation (30 days)',
      trigger: 'time_based',
      conditions: { daysSince: 30, stage: 'lost' },
      actions: {
        sendEmail: true,
        emailTemplate: 'reactivation-offer',
        changeStage: 'lead'
      },
      active: true
    }
  ]

  // Email templates for follow-ups
  private emailTemplates = {
    'welcome-new-lead': {
      subject: 'Welcome to Guyana Home Hub - Let\'s Find Your Perfect Property!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Guyana Home Hub!</h1>
            <p style="color: #f0fdf4; margin: 10px 0 0;">Your journey to finding the perfect property starts here</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #1f2937;">Hi {{customer_name}},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for your interest in our properties! I'm excited to help you find the perfect home or investment opportunity in Guyana.
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">What's Next?</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>📋 Complete your buyer profile for personalized recommendations</li>
                <li>🔍 Browse our latest property listings</li>
                <li>📅 Schedule a consultation to discuss your needs</li>
                <li>🏡 Arrange property viewings for your favorites</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{website_url}}/browse" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse Properties</a>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              I'll be reaching out within 24 hours to understand your specific requirements. In the meantime, feel free to explore our website or call me directly at {{agent_phone}}.
            </p>
            
            <p style="color: #4b5563;">
              Best regards,<br>
              {{agent_name}}<br>
              {{agent_email}}<br>
              {{agent_phone}}
            </p>
          </div>
        </div>
      `
    },
    'contact-follow-up': {
      subject: 'Following up on your property inquiry - {{property_title}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #1f2937;">Hi {{customer_name}},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              I wanted to follow up on your recent inquiry about <strong>{{property_title}}</strong>. 
              Do you have any questions about this property or would you like to schedule a viewing?
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Property Summary</h3>
              <p style="color: #4b5563; margin: 0;">
                📍 {{property_location}}<br>
                💰 GYD {{property_price}}<br>
                🏠 {{property_type}} • {{property_bedrooms}} bed, {{property_bathrooms}} bath
              </p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              I'm also happy to show you similar properties that might interest you. Here are a few options:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{calendar_link}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Schedule Viewing</a>
              <a href="{{similar_properties_link}}" style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">See Similar</a>
            </div>
            
            <p style="color: #4b5563;">
              Feel free to call me at {{agent_phone}} or reply to this email with any questions.
            </p>
            
            <p style="color: #4b5563;">
              Best regards,<br>
              {{agent_name}}
            </p>
          </div>
        </div>
      `
    },
    'qualification-reminder': {
      subject: 'Let\'s discuss your property requirements in detail',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #1f2937;">Hi {{customer_name}},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              I hope you're doing well! I wanted to reach out to better understand your property needs so I can provide you with the most relevant options.
            </p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0;">Let's Find Your Perfect Match</h3>
              <p style="color: #92400e; margin: 0;">
                A quick 10-minute call can help me understand your preferences and show you properties that truly match what you're looking for.
              </p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">What I'd like to discuss:</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>🎯 Your ideal location and neighborhood preferences</li>
                <li>💰 Budget range and financing options</li>
                <li>🏠 Property type, size, and must-have features</li>
                <li>📅 Your timeline for purchasing/renting</li>
                <li>🔑 Any specific concerns or questions</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{calendar_link}}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Schedule Call</a>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              This will help me curate a personalized list of properties just for you, saving you time and ensuring you see only the best matches.
            </p>
            
            <p style="color: #4b5563;">
              Looking forward to hearing from you!<br><br>
              {{agent_name}}<br>
              {{agent_phone}}
            </p>
          </div>
        </div>
      `
    },
    'negotiation-push': {
      subject: 'Don\'t lose your dream property - {{property_title}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #1f2937;">Hi {{customer_name}},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              I wanted to check in on the status of <strong>{{property_title}}</strong>. Great properties don't stay on the market long, and I'd hate for you to miss this opportunity.
            </p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <h3 style="color: #dc2626; margin-top: 0;">⏰ Time-Sensitive Opportunity</h3>
              <p style="color: #dc2626; margin: 0;">
                This property has been generating significant interest. Let's move quickly to secure it for you.
              </p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Next Steps:</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>📋 Review and finalize your offer terms</li>
                <li>💰 Confirm financing pre-approval</li>
                <li>📄 Prepare necessary documentation</li>
                <li>🤝 Submit competitive offer</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:{{agent_phone}}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Call Now</a>
              <a href="{{property_link}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Property</a>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              I'm available to discuss any concerns and help you move forward confidently. Let's connect today to secure your dream property.
            </p>
            
            <p style="color: #4b5563;">
              Urgently yours,<br>
              {{agent_name}}<br>
              {{agent_phone}}
            </p>
          </div>
        </div>
      `
    },
    'reactivation-offer': {
      subject: 'New properties that match your criteria + Special incentive',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">We Miss You!</h1>
            <p style="color: #e9d5ff; margin: 10px 0 0;">New properties + special offer inside</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #1f2937;">Hi {{customer_name}},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              It's been a while since we last spoke, but I have some exciting news! Several new properties have come on the market that match your previous search criteria.
            </p>
            
            <div style="background: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
              <h3 style="color: #6b21a8; margin-top: 0;">🎁 Welcome Back Offer</h3>
              <p style="color: #6b21a8; margin: 0;">
                <strong>Exclusive for returning clients:</strong> No agent commission on your first property purchase + priority access to new listings for 30 days.
              </p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">What's New:</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>🏡 {{new_properties_count}} new properties in your preferred areas</li>
                <li>💰 Price reductions on several premium listings</li>
                <li>🔑 Exclusive off-market opportunities</li>
                <li>📱 Enhanced mobile search with virtual tours</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{new_properties_link}}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">View New Properties</a>
              <a href="{{calendar_link}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Book Consultation</a>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              I understand that timing is everything in real estate. If now isn't the right time, no worries! I'll keep you updated on the best opportunities without any pressure.
            </p>
            
            <p style="color: #4b5563;">
              Hope to hear from you soon,<br><br>
              {{agent_name}}<br>
              {{agent_phone}}<br>
              {{agent_email}}
            </p>
          </div>
        </div>
      `
    }
  }

  // Process follow-up automation
  async processFollowUps() {
    try {
      console.log('Processing follow-up automation...')

      // Get all customers
      const { data: customers } = await this.supabase
        .from('inquiries')
        .select(`
          *,
          properties (title, location, price, property_type, bedrooms, bathrooms)
        `)

      if (!customers) return

      // Process each rule
      for (const rule of this.defaultRules) {
        if (!rule.active) continue

        for (const customer of customers) {
          const shouldTrigger = await this.evaluateRule(rule, customer)
          
          if (shouldTrigger) {
            await this.executeFollowUp(rule, customer)
          }
        }
      }

    } catch (error) {
      console.error('Error processing follow-ups:', error)
    }
  }

  // Evaluate if a rule should trigger for a customer
  private async evaluateRule(rule: FollowUpRule, customer: any): Promise<boolean> {
    const now = new Date()
    const createdAt = new Date(customer.created_at)
    const lastContact = new Date(customer.last_contact || customer.created_at)

    switch (rule.trigger) {
      case 'stage_change':
        return customer.status === rule.conditions.stage

      case 'time_based':
        const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceCreated === rule.conditions.daysSince

      case 'inactivity':
        const daysSinceContact = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24))
        const meetsInactivity = daysSinceContact >= (rule.conditions.inactivityDays || 0)
        const meetsStage = !rule.conditions.stage || customer.status === rule.conditions.stage
        return meetsInactivity && meetsStage

      case 'property_match':
        return customer.property_type === rule.conditions.propertyType

      default:
        return false
    }
  }

  // Execute follow-up actions
  private async executeFollowUp(rule: FollowUpRule, customer: any) {
    try {
      console.log(`Executing follow-up: ${rule.name} for customer: ${customer.name}`)

      // Send email if configured
      if (rule.actions.sendEmail && rule.actions.emailTemplate) {
        await this.sendFollowUpEmail(rule.actions.emailTemplate, customer)
      }

      // Create task if configured
      if (rule.actions.createTask) {
        await this.createFollowUpTask(rule, customer)
      }

      // Change stage if configured
      if (rule.actions.changeStage) {
        await this.updateCustomerStage(customer.id, rule.actions.changeStage)
      }

      // Log the follow-up action
      await this.logFollowUpAction(rule, customer)

    } catch (error) {
      console.error('Error executing follow-up:', error)
    }
  }

  // Send follow-up email
  private async sendFollowUpEmail(templateName: string, customer: any) {
    const template = this.emailTemplates[templateName as keyof typeof this.emailTemplates]
    if (!template) return

    // Replace template variables
    let html = template.html
    let subject = template.subject

    const variables = {
      customer_name: customer.name,
      agent_name: 'Your Real Estate Agent',
      agent_email: 'agent@guyanahomehub.com',
      agent_phone: '+592-123-4567',
      property_title: customer.properties?.title || 'Your Property Inquiry',
      property_location: customer.properties?.location || '',
      property_price: customer.properties?.price?.toLocaleString() || '',
      property_type: customer.properties?.property_type || '',
      property_bedrooms: customer.properties?.bedrooms || '',
      property_bathrooms: customer.properties?.bathrooms || '',
      website_url: 'https://guyanahomehub.com',
      calendar_link: 'https://calendly.com/agent-calendar',
      property_link: `https://guyanahomehub.com/properties/${customer.property_id}`,
      similar_properties_link: 'https://guyanahomehub.com/browse',
      new_properties_link: 'https://guyanahomehub.com/browse?new=true',
      new_properties_count: '5'
    }

    // Replace all variables in template
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      html = html.replace(regex, value)
      subject = subject.replace(regex, value)
    }

    // Send email using Resend
    try {
      await this.resend.emails.send({
        from: 'Guyana Home Hub <noreply@guyanahomehub.com>',
        to: [customer.email],
        subject: subject,
        html: html
      })
      console.log(`Follow-up email sent to: ${customer.email}`)
    } catch (error) {
      console.error('Error sending follow-up email:', error)
    }
  }

  // Create follow-up task
  private async createFollowUpTask(rule: FollowUpRule, customer: any) {
    const task: Partial<FollowUpTask> = {
      customer_id: customer.id,
      type: rule.name.includes('call') ? 'call' : 'email',
      subject: `Follow-up: ${rule.name}`,
      description: `Automated follow-up task: ${rule.name} for ${customer.name}`,
      scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      priority: (rule.actions as any).priority || 'medium',
      status: 'pending',
      agent_id: customer.agent_id || 'default-agent'
    }

    await this.supabase.from('follow_up_tasks').insert(task)
  }

  // Update customer stage
  private async updateCustomerStage(customerId: string, newStage: string) {
    await this.supabase
      .from('inquiries')
      .update({ status: newStage })
      .eq('id', customerId)
  }

  // Log follow-up action
  private async logFollowUpAction(rule: FollowUpRule, customer: any) {
    const log = {
      rule_id: rule.id,
      customer_id: customer.id,
      action: rule.name,
      executed_at: new Date().toISOString()
    }

    await this.supabase.from('follow_up_logs').insert(log)
  }

  // Get pending tasks for an agent
  async getAgentTasks(agentId: string): Promise<FollowUpTask[]> {
    const { data: tasks } = await this.supabase
      .from('follow_up_tasks')
      .select('*')
      .eq('agent_id', agentId)
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('scheduled_date', { ascending: true })

    return tasks || []
  }

  // Mark task as completed
  async completeTask(taskId: string) {
    await this.supabase
      .from('follow_up_tasks')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId)
  }

  // Schedule automation to run periodically
  setupAutomation() {
    // Run every hour
    setInterval(() => {
      this.processFollowUps()
    }, 60 * 60 * 1000)

    // Run immediately
    this.processFollowUps()
  }
}

// Export singleton instance
export const followUpAutomation = new FollowUpAutomation()

