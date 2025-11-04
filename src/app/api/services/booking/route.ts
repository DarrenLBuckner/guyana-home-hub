import { NextRequest, NextResponse } from 'next/server';

/**
 * Service Booking API Route
 * Handles service booking form submissions
 */

interface BookingRequest {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceCurrency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  propertyType: string;
  preferredDate: string;
  preferredTime: string;
  alternativeDate?: string;
  alternativeTime?: string;
  message?: string;
  urgency: string;
  contactMethod: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      'serviceId', 'serviceName', 'firstName', 'lastName', 'email', 'phone',
      'propertyAddress', 'propertyType', 'preferredDate', 'preferredTime',
      'urgency', 'contactMethod'
    ];

    const missingFields = requiredFields.filter(field => !body[field as keyof BookingRequest]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare inquiry data for Portal Home Hub
    const inquiryData = {
      country: 'guyana',
      serviceId: body.serviceId,
      serviceName: body.serviceName,
      servicePrice: body.servicePrice,
      serviceCurrency: body.serviceCurrency,
      customerName: `${body.firstName} ${body.lastName}`,
      customerEmail: body.email,
      customerPhone: body.phone,
      propertyAddress: body.propertyAddress,
      propertyType: body.propertyType,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      alternativeDate: body.alternativeDate || null,
      alternativeTime: body.alternativeTime || null,
      message: body.message || null,
      urgency: body.urgency,
      preferredContactMethod: body.contactMethod,
      inquirySource: 'guyana-home-hub',
      status: 'pending'
    };

    // Submit to Portal Home Hub API
    const portalResponse = await fetch(
      `${process.env.PORTAL_API_URL}/api/public/services/inquiries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PORTAL_API_KEY}`,
        },
        body: JSON.stringify(inquiryData),
      }
    );

    if (!portalResponse.ok) {
      const errorData = await portalResponse.json().catch(() => ({}));
      console.error('Portal API error:', errorData);
      throw new Error('Failed to submit booking to portal');
    }

    const result = await portalResponse.json();

    // You can also send confirmation emails, notifications, etc. here
    
    return NextResponse.json({ 
      success: true, 
      inquiryId: result.id,
      message: 'Booking request submitted successfully'
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}