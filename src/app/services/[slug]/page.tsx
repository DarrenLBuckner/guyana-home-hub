import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetail from '@/components/services/ServiceDetail';

/**
 * Dynamic Service Detail Page
 * Displays individual service information (drone-photography, property-photography, etc.)
 */

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  try {
    // Get Portal Home Hub base URL from environment
    const portalBaseUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com';
    
    const response = await fetch(`${portalBaseUrl}/api/public/services/GY`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return {
        title: 'Service | Guyana Home Hub',
        description: 'Professional real estate services in Guyana'
      };
    }
    
    const data = await response.json();
    const service = data.services.find((s: any) => s.slug === params.slug);
    
    if (!service) {
      return {
        title: 'Service Not Found | Guyana Home Hub',
        description: 'Professional real estate services in Guyana'
      };
    }

    return {
      title: `${service.name} | Guyana Home Hub`,
      description: service.shortDescription,
      keywords: `${service.name} Guyana, ${service.category} services, real estate marketing Guyana, professional photography Guyana`,
      openGraph: {
        title: `${service.name} | Guyana Home Hub`,
        description: service.shortDescription,
        type: 'website',
        ...(service.featuredImage && { images: [service.featuredImage] })
      }
    };
  } catch {
    return {
      title: 'Service | Guyana Home Hub',
      description: 'Professional real estate services in Guyana'
    };
  }
}

// Generate static params for build optimization
export async function generateStaticParams() {
  try {
    const portalBaseUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com';

    const response = await fetch(`${portalBaseUrl}/api/public/services/GY`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const services = data?.services || [];

    return services.map((service: any) => ({
      slug: service.slug,
    }));
  } catch {
    return [];
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  try {
    const portalBaseUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com';
    
    const response = await fetch(`${portalBaseUrl}/api/public/services/GY`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      notFound();
    }
    
    const data = await response.json();
    const service = data.services.find((s: any) => s.slug === params.slug);
    
    if (!service) {
      notFound();
    }

    return <ServiceDetail service={service} allServices={data.services} />;
  } catch {
    notFound();
  }
}