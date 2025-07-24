// Smart Lead Scoring and Notification System
export interface LeadScore {
  total: number
  factors: {
    inquiryType: number
    responseTime: number
    engagement: number
    propertyMatch: number
    communication: number
    timeline: number
  }
  priority: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
}

export class LeadScoringEngine {
  static calculateLeadScore(inquiry: any, property: any, customerHistory?: any): LeadScore {
    let score = 0
    const factors = {
      inquiryType: 0,
      responseTime: 0,
      engagement: 0,
      propertyMatch: 0,
      communication: 0,
      timeline: 0
    }
    const recommendations: string[] = []

    // Inquiry Type Scoring (25 points max)
    switch (inquiry.inquiry_type) {
      case 'offer':
        factors.inquiryType = 25
        recommendations.push('🚨 Customer ready to make offer - respond immediately!')
        break
      case 'viewing':
        factors.inquiryType = 20
        recommendations.push('📅 Schedule viewing within 24 hours for best conversion')
        break
      case 'information':
        factors.inquiryType = 15
        recommendations.push('📋 Provide detailed property information and virtual tour')
        break
      case 'general':
        factors.inquiryType = 10
        recommendations.push('🤝 Build rapport and understand customer needs')
        break
    }

    // Message Quality Scoring (20 points max)
    const message = inquiry.message.toLowerCase()
    if (message.includes('urgent') || message.includes('asap') || message.includes('immediately')) {
      factors.timeline = 20
      recommendations.push('⏰ Customer indicated urgency - prioritize response')
    } else if (message.includes('soon') || message.includes('quickly')) {
      factors.timeline = 15
    } else if (message.includes('when available') || message.includes('no rush')) {
      factors.timeline = 5
    } else {
      factors.timeline = 10
    }

    // Communication Quality (15 points max)
    if (inquiry.customer_phone && inquiry.preferred_contact === 'both') {
      factors.communication = 15
      recommendations.push('📞 Customer provided phone - call for immediate response')
    } else if (inquiry.customer_phone && inquiry.preferred_contact === 'phone') {
      factors.communication = 12
      recommendations.push('📞 Customer prefers phone contact')
    } else if (inquiry.preferred_contact === 'email') {
      factors.communication = 8
    } else {
      factors.communication = 10
    }

    // Property Match Scoring (20 points max)
    if (property.price_type === 'rent' && message.includes('rent')) {
      factors.propertyMatch += 10
    } else if (property.price_type !== 'rent' && (message.includes('buy') || message.includes('purchase'))) {
      factors.propertyMatch += 10
    }

    if (message.includes('bedroom') || message.includes('bed')) {
      factors.propertyMatch += 5
    }
    if (message.includes('budget') || message.includes('price') || message.includes('afford')) {
      factors.propertyMatch += 5
      recommendations.push('💰 Discuss financing options and payment plans')
    }

    // Engagement Indicators (20 points max)
    const messageLength = inquiry.message.length
    if (messageLength > 200) {
      factors.engagement = 20
      recommendations.push('📝 Detailed inquiry shows high interest')
    } else if (messageLength > 100) {
      factors.engagement = 15
    } else if (messageLength > 50) {
      factors.engagement = 10
    } else {
      factors.engagement = 5
      recommendations.push('🤔 Brief inquiry - ask follow-up questions to gauge interest')
    }

    // Customer History Bonus (if available)
    if (customerHistory) {
      if (customerHistory.previousInquiries > 0) {
        factors.engagement += 5
        recommendations.push('🔄 Returning customer - reference previous interactions')
      }
      if (customerHistory.hasViewed) {
        factors.engagement += 5
      }
    }

    // Calculate total score
    score = Object.values(factors).reduce((sum, factor) => sum + factor, 0)

    // Determine priority
    let priority: 'low' | 'medium' | 'high' | 'critical'
    if (score >= 80) {
      priority = 'critical'
      recommendations.unshift('🔥 CRITICAL LEAD - Drop everything and respond now!')
    } else if (score >= 60) {
      priority = 'high'
      recommendations.unshift('🚀 HIGH VALUE LEAD - Respond within 1 hour')
    } else if (score >= 40) {
      priority = 'medium'
      recommendations.unshift('⚡ MEDIUM PRIORITY - Respond within 4 hours')
    } else {
      priority = 'low'
      recommendations.unshift('📋 Standard inquiry - Respond within 24 hours')
    }

    // Add general recommendations
    recommendations.push('🎯 Personalize response with property-specific details')
    recommendations.push('📸 Include additional photos or virtual tour link')
    recommendations.push('📅 Offer flexible viewing times including evenings/weekends')

    return {
      total: score,
      factors,
      priority,
      recommendations
    }
  }

  static getScoreColor(score: number): string {
    if (score >= 80) return 'bg-red-100 text-red-800'
    if (score >= 60) return 'bg-orange-100 text-orange-800'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  static getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'critical': return '🔥'
      case 'high': return '🚀'
      case 'medium': return '⚡'
      default: return '📋'
    }
  }
}

// Smart Notification System
export class SmartNotificationService {
  static async sendIntelligentNotification(inquiry: any, property: any, leadScore: LeadScore) {
    const notification = {
      title: this.generateSmartTitle(inquiry, leadScore),
      body: this.generateSmartBody(inquiry, property, leadScore),
      urgency: leadScore.priority,
      actions: this.generateSmartActions(inquiry, property, leadScore),
      channels: this.selectOptimalChannels(leadScore, inquiry.preferred_contact)
    }

    // Send via multiple channels based on priority
    await this.deliverNotification(notification, inquiry.agent_id)
  }

  private static generateSmartTitle(inquiry: any, leadScore: LeadScore): string {
    const priorityIcon = LeadScoringEngine.getPriorityIcon(leadScore.priority)
    const scoreEmoji = leadScore.total >= 80 ? '🎯' : leadScore.total >= 60 ? '⭐' : '📬'
    
    return `${priorityIcon} ${scoreEmoji} New ${inquiry.inquiry_type} inquiry (Score: ${leadScore.total})`
  }

  private static generateSmartBody(inquiry: any, property: any, leadScore: LeadScore): string {
    let body = `${inquiry.customer_name} is interested in ${property.title}.\n\n`
    
    // Add priority context
    if (leadScore.priority === 'critical') {
      body += '🚨 CRITICAL: This lead shows extremely high purchase intent. Respond immediately!\n\n'
    } else if (leadScore.priority === 'high') {
      body += '🚀 HIGH PRIORITY: Strong lead with good conversion potential.\n\n'
    }

    // Add key insights
    body += 'Key Insights:\n'
    leadScore.recommendations.slice(0, 3).forEach(rec => {
      body += `• ${rec}\n`
    })

    return body
  }

  private static generateSmartActions(inquiry: any, property: any, leadScore: LeadScore): any[] {
    const actions = [
      {
        id: 'quick_response',
        label: '⚡ Quick Response',
        action: 'QUICK_RESPONSE',
        template: this.generateQuickResponseTemplate(inquiry, property, leadScore)
      },
      {
        id: 'schedule_call',
        label: '📞 Schedule Call',
        action: 'SCHEDULE_CALL',
        url: `tel:${inquiry.customer_phone}`
      },
      {
        id: 'view_full',
        label: '👁️ View Details',
        action: 'VIEW_INQUIRY',
        url: `/agent/inquiries/${inquiry.id}`
      }
    ]

    // Add priority-specific actions
    if (leadScore.priority === 'critical') {
      actions.unshift({
        id: 'urgent_call',
        label: '🚨 URGENT CALL',
        action: 'URGENT_CALL',
        url: `tel:${inquiry.customer_phone}`
      })
    }

    return actions
  }

  private static generateQuickResponseTemplate(inquiry: any, property: any, leadScore: LeadScore): string {
    let template = `Hi ${inquiry.customer_name},\n\n`
    template += `Thank you for your interest in ${property.title}! `

    // Customize based on inquiry type
    switch (inquiry.inquiry_type) {
      case 'offer':
        template += `I understand you're ready to make an offer. I'd love to discuss this with you immediately. `
        break
      case 'viewing':
        template += `I'd be happy to arrange a viewing for you. I have availability today and tomorrow. `
        break
      case 'information':
        template += `I'd be delighted to provide you with detailed information about this property. `
        break
      default:
        template += `I'm excited to help you with this property. `
    }

    // Add property highlights
    template += `\n\nProperty Highlights:\n`
    template += `📍 Location: ${property.location}\n`
    template += `💰 Price: GYD ${property.price.toLocaleString()}\n`
    template += `🏠 ${property.bedrooms} bed, ${property.bathrooms} bath\n\n`

    // Add call to action based on lead score
    if (leadScore.priority === 'critical') {
      template += `Given your high interest, I'm prioritizing your inquiry. `
      template += `Can we schedule a call in the next hour? I'm available at ${inquiry.customer_phone || 'your convenience'}.\n\n`
    } else {
      template += `I'd love to discuss this property with you. `
      template += `When would be a good time for a ${inquiry.preferred_contact === 'phone' ? 'call' : 'detailed email discussion'}?\n\n`
    }

    template += `Looking forward to hearing from you!\n\n`
    template += `Best regards,\n`
    template += `[Your Name]\n`
    template += `Guyana Home Hub Agent`

    return template
  }

  private static selectOptimalChannels(leadScore: LeadScore, preferredContact: string): string[] {
    const channels = ['email', 'dashboard']

    // Add SMS for high-priority leads
    if (leadScore.priority === 'critical') {
      channels.push('sms', 'push', 'call')
    } else if (leadScore.priority === 'high') {
      channels.push('push')
      if (preferredContact === 'phone') channels.push('sms')
    }

    return channels
  }

  private static async deliverNotification(notification: any, agentId: string) {
    // Implementation would send via various channels
    console.log('Smart notification delivered:', notification)
  }
}
