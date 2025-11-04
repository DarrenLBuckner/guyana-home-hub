import React from 'react';
import { Metadata } from 'next';
import ServicesOverview from '@/components/services/ServicesOverview';

export const metadata: Metadata = {
  title: 'Professional Real Estate Services | Guyana Home Hub',
  description: 'Professional drone photography, property photography, 3D virtual tours, lockbox placement, and complete listing services for your Guyana property.',
  keywords: 'drone photography Guyana, property photography, 3D virtual tours, lockbox services, real estate marketing Guyana'
};

/**
 * Main Services Page
 * Displays all available services for the Guyana market
 */
export default function ServicesPage() {
  return <ServicesOverview />;
}