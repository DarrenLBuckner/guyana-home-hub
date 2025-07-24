import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const {
      property_id,
      customer_name,
      customer_email,
      customer_phone,
      message,
      inquiry_type = 'general',
      preferred_contact = 'email'
    } = body

    // Validate required fields
    if (!property_id || !customer_name || !customer_email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get property and agent information
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        user_id,
        contact_email,
        contact_name,
        location,
        price,
        price_type
      `)
      .eq('id', property_id)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Create the inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .insert({
        property_id,
        agent_id: property.user_id,
        customer_name,
        customer_email,
        customer_phone,
        message,
        inquiry_type,
        preferred_contact,
        status: 'new',
        priority: 'medium'
      })
      .select()
      .single()

    if (inquiryError) {
      console.error('Error creating inquiry:', inquiryError)
      return NextResponse.json(
        { error: 'Failed to create inquiry' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to agent
    // This would integrate with a service like Resend, SendGrid, or AWS SES
    try {
      await sendAgentNotification({
        agentEmail: property.contact_email,
        agentName: property.contact_name,
        customerName: customer_name,
        customerEmail: customer_email,
        customerPhone: customer_phone,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyPrice: property.price,
        priceType: property.price_type,
        message,
        inquiryType: inquiry_type,
        preferredContact: preferred_contact
      })
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      inquiry: inquiry,
      message: 'Inquiry submitted successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agent_id')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let query = supabase
      .from('inquiries')
      .select(`
        *,
        properties (
          title,
          location,
          price,
          price_type,
          image_urls,
          hero_index
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Filter by agent (user can only see their own inquiries)
    query = query.eq('agent_id', user.id)

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: inquiries, error } = await query

    if (error) {
      console.error('Error fetching inquiries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiries' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      inquiries: inquiries || []
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Email notification function (to be implemented with your preferred email service)
async function sendAgentNotification(data: {
  agentEmail: string
  agentName: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  propertyTitle: string
  propertyLocation: string
  propertyPrice: number
  priceType?: string
  message: string
  inquiryType: string
  preferredContact: string
}) {
  // This is a placeholder for email integration
  // You would implement this with your preferred email service:
  // - Resend: https://resend.com/
  // - SendGrid: https://sendgrid.com/
  // - AWS SES: https://aws.amazon.com/ses/
  // - Nodemailer with SMTP
  
  console.log('Email notification would be sent:', {
    to: data.agentEmail,
    subject: `New Property Inquiry - ${data.propertyTitle}`,
    customerInfo: {
      name: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone,
      message: data.message,
      preferredContact: data.preferredContact
    }
  })

  // Example implementation with Resend (uncomment when you have API key):
  /*
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'noreply@guyanahomehub.com',
    to: data.agentEmail,
    subject: `New Property Inquiry - ${data.propertyTitle}`,
    html: `
      <h2>New Property Inquiry</h2>
      <p>You have received a new inquiry for your property:</p>
      
      <h3>Property Details:</h3>
      <ul>
        <li><strong>Title:</strong> ${data.propertyTitle}</li>
        <li><strong>Location:</strong> ${data.propertyLocation}</li>
        <li><strong>Price:</strong> GYD ${data.propertyPrice.toLocaleString()}${data.priceType === 'rent' ? '/month' : ''}</li>
      </ul>
      
      <h3>Customer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${data.customerName}</li>
        <li><strong>Email:</strong> ${data.customerEmail}</li>
        ${data.customerPhone ? `<li><strong>Phone:</strong> ${data.customerPhone}</li>` : ''}
        <li><strong>Preferred Contact:</strong> ${data.preferredContact}</li>
        <li><strong>Inquiry Type:</strong> ${data.inquiryType}</li>
      </ul>
      
      <h3>Message:</h3>
      <p>${data.message}</p>
      
      <p>Please respond to this inquiry promptly to maximize your conversion rate.</p>
      
      <a href="https://guyanahomehub.com/agent/inquiries" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
    `
  });
  */
}
