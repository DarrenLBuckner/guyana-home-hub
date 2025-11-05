import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Public API to fetch services for a specific country
 * Used by the services page to display available services
 * Falls back gracefully when database is not set up yet
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params;
    const supabase = await createClient();

    // Try to fetch services from database
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select(`
        id,
        name,
        slug,
        description,
        short_description,
        icon,
        category,
        service_type,
        base_price,
        currency,
        is_active,
        sort_order,
        country_services!inner (
          country_code,
          country_name,
          is_available,
          local_price,
          local_currency,
          contact_email,
          contact_phone,
          contact_address,
          contact_website
        )
      `)
      .eq('is_active', true)
      .eq('country_services.country_code', country.toUpperCase())
      .eq('country_services.is_available', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    // If database error or no service_type field, return fallback data
    if (servicesError || !services) {
      console.log('Database error or no services found, returning fallback data');
      return NextResponse.json({
        services: getFallbackServices(country),
        packages: [],
        totalCount: 4
      });
    }

    // Transform the data to match expected format
    const transformedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description,
      shortDescription: service.short_description,
      icon: service.icon,
      category: service.category,
      serviceType: service.service_type || 'card',
      price: service.country_services[0]?.local_price || service.base_price,
      currency: service.country_services[0]?.local_currency || service.currency,
      contactEmail: service.country_services[0]?.contact_email || '',
      contactPhone: service.country_services[0]?.contact_phone || '',
      contactAddress: service.country_services[0]?.contact_address || '',
      contactWebsite: service.country_services[0]?.contact_website || null,
      featuredImage: null,
      galleryImages: []
    }));

    return NextResponse.json({
      services: transformedServices,
      packages: [], // Packages can be implemented later
      totalCount: transformedServices.length
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    
    // Return fallback services if there's any error
    return NextResponse.json({
      services: getFallbackServices(params.country),
      packages: [],
      totalCount: 4
    });
  }
}

/**
 * Fallback services to show when database is not set up yet
 * These are the core real estate services for Guyana
 */
function getFallbackServices(country: string) {
  return [
    {
      id: 'fallback-photography',
      name: 'Professional Property Photography',
      slug: 'property-photography',
      description: 'High-quality professional photography to showcase your property in the best light. Our experienced photographers capture stunning interior and exterior shots that highlight your property\'s key features and attract potential buyers.',
      shortDescription: 'Professional photos to make your property stand out',
      icon: '📸',
      category: 'photography',
      serviceType: 'card',
      price: 25000,
      currency: 'GYD',
      contactEmail: 'services@guyanahomehub.com',
      contactPhone: '(592) 123-4567',
      contactAddress: 'Georgetown, Guyana',
      contactWebsite: null,
      featuredImage: null,
      galleryImages: []
    },
    {
      id: 'fallback-drone',
      name: 'Aerial Drone Photography',
      slug: 'drone-photography',
      description: 'Stunning aerial photography and videography using professional drones. Perfect for showcasing large properties, land plots, commercial buildings, and unique architectural features from breathtaking perspectives.',
      shortDescription: 'Breathtaking aerial views of your property',
      icon: '🚁',
      category: 'photography',
      serviceType: 'card',
      price: 40000,
      currency: 'GYD',
      contactEmail: 'services@guyanahomehub.com',
      contactPhone: '(592) 123-4567',
      contactAddress: 'Georgetown, Guyana',
      contactWebsite: null,
      featuredImage: null,
      galleryImages: []
    },
    {
      id: 'fallback-virtual-tour',
      name: '3D Virtual Property Tours',
      slug: 'virtual-tours',
      description: 'Interactive 3D virtual tours that let potential buyers explore your property from anywhere. Using cutting-edge 360° technology, we create immersive experiences that increase engagement and serious inquiries.',
      shortDescription: 'Interactive 3D tours for remote property viewing',
      icon: '🏠',
      category: 'virtual',
      serviceType: 'card',
      price: 50000,
      currency: 'GYD',
      contactEmail: 'services@guyanahomehub.com',
      contactPhone: '(592) 123-4567',
      contactAddress: 'Georgetown, Guyana',
      contactWebsite: null,
      featuredImage: null,
      galleryImages: []
    },
    {
      id: 'fallback-lockbox',
      name: 'Secure Lockbox Placement',
      slug: 'lockbox-placement',
      description: 'Professional lockbox installation and management for secure property access. We provide high-quality lockboxes and handle the setup, maintenance, and retrieval process for seamless property showings.',
      shortDescription: 'Secure access solutions for property showings',
      icon: '🔐',
      category: 'placement',
      serviceType: 'card',
      price: 15000,
      currency: 'GYD',
      contactEmail: 'services@guyanahomehub.com',
      contactPhone: '(592) 123-4567',
      contactAddress: 'Georgetown, Guyana',
      contactWebsite: null,
      featuredImage: null,
      galleryImages: []
    }
  ];
}