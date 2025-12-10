import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ServiceBooking from '@/components/services/ServiceBooking';

/**
 * Service Booking Page
 * Allows users to book a specific service
 */

interface BookingPageProps {
  params: {
    slug: string;
  };
}

// Portal API base URL with fallback
const PORTAL_API_URL = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalhomehub.com';

// Fetch service data from Portal Home Hub
async function getService(slug: string) {
  try {
    const response = await fetch(
      `${PORTAL_API_URL}/api/public/services/GY?slug=${slug}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Find the specific service by slug
    const service = [...data.services, ...data.packages.flatMap((p: any) => p.services)]
      .find((s: any) => s.slug === slug);

    return service;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${PORTAL_API_URL}/api/public/services/GY`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const slugs = [
      ...data.services.map((service: any) => ({ slug: service.slug })),
      ...data.packages.flatMap((pkg: any) =>
        pkg.services.map((service: any) => ({ slug: service.slug }))
      )
    ];

    return slugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const service = await getService(params.slug);
  
  if (!service) {
    return {
      title: 'Service Not Found | Guyana Home Hub'
    };
  }

  return {
    title: `Book ${service.name} | Guyana Home Hub Services`,
    description: `Book ${service.name} service for your property. ${service.shortDescription} Professional service with guaranteed quality.`,
    keywords: [
      service.name.toLowerCase(),
      service.category,
      'book service',
      'Guyana property services',
      'real estate services'
    ],
    openGraph: {
      title: `Book ${service.name}`,
      description: service.shortDescription,
      type: 'website',
    },
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  return <ServiceBooking service={service} />;
}