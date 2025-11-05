import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Public API endpoint for submitting FREE business listings
 * No authentication required - designed for easy business onboarding
 * Auto-creates service with 'free' type directly in the database
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessName,
      category,
      phone,
      email,
      address,
      description,
      website,
      countryCode = 'GY'
    } = body;

    // Validation
    if (!businessName || !category || !phone || !email || !address || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, category, phone, email, address, description' },
        { status: 400 }
      );
    }

    // Generate slug from business name
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Prepare service data for Portal Home Hub backend
    const serviceData = {
      name: businessName,
      slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
      description: description,
      shortDescription: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
      icon: getCategoryIcon(category),
      category: category,
      serviceType: 'free',
      basePrice: 0,
      currency: 'GYD',
      isActive: true,
      sortOrder: 999, // Put free listings at bottom
      // Contact info for the service
      contactInfo: {
        phone,
        email,
        address,
        website: website || null
      }
    };

    // Create Supabase client and submit directly to database
    const supabase = await createClient();
    
    // Insert service into services table
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .insert({
        name: businessName,
        slug: `${slug}-${Date.now()}`,
        description: description,
        short_description: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
        icon: getCategoryIcon(category),
        category: category,
        service_type: 'free',
        base_price: 0,
        currency: 'GYD',
        is_active: true,
        sort_order: 999
      })
      .select()
      .single();

    if (serviceError) {
      console.error('Error creating service:', serviceError);
      return NextResponse.json(
        { error: 'Unable to process your submission. Please try again later.' },
        { status: 500 }
      );
    }

    // Insert country-specific service data
    const { error: countryServiceError } = await supabase
      .from('country_services')
      .insert({
        service_id: service.id,
        country_code: countryCode,
        country_name: getCountryName(countryCode),
        is_available: true,
        local_price: 0,
        local_currency: 'GYD',
        contact_email: email,
        contact_phone: phone,
        contact_address: address,
        contact_website: website || null
      });

    if (countryServiceError) {
      console.error('Error creating country service:', countryServiceError);
      // Don't fail the entire request, just log the error
    }

    // Send confirmation email (optional - can be implemented later)
    // await sendConfirmationEmail(email, businessName);

    return NextResponse.json({
      success: true,
      message: 'Free listing submitted successfully',
      serviceId: service.id,
      estimatedLiveTime: '24 hours'
    });

  } catch (error) {
    console.error('Error in free listing submission:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * Get country name from country code
 */
function getCountryName(countryCode: string): string {
  const countryMap: Record<string, string> = {
    'GY': 'Guyana',
    'JM': 'Jamaica',
    'BB': 'Barbados'
  };
  
  return countryMap[countryCode] || 'Unknown';
}

/**
 * Get appropriate icon for business category
 */
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'renovations': '🔨',
    'electrical': '⚡',
    'interior': '🪑',
    'landscaping': '🌿',
    'building-materials': '🧱',
    'moving-storage': '📦',
    'cleaning': '🧽',
    'security': '🛡️',
    'legal-financial': '⚖️',
    'insurance': '📋',
    'automotive': '🚗',
    'health-beauty': '💄',
    'food-catering': '🍽️',
    'education': '📚',
    'technology': '💻',
    'transportation': '🚚',
    'entertainment': '🎉',
    'other': '🏢'
  };
  
  return iconMap[category] || '🏢';
}