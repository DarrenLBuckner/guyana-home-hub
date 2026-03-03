import { Metadata } from 'next';
import { Suspense } from 'react';
import PropertiesListing from '@/components/PropertiesListingFixed';

export const metadata: Metadata = {
  title: 'Browse All Properties in Guyana | Buy, Rent, Commercial',
  description: 'Browse all verified property listings in Guyana. Houses, apartments, land, and commercial properties for sale and rent. Filter by type, price, and location.',
  alternates: {
    canonical: '/properties',
  },
  openGraph: {
    title: 'Browse All Properties in Guyana',
    description: 'Browse all verified property listings in Guyana. Houses, apartments, land, and commercial properties.',
    url: 'https://www.guyanahomehub.com/properties',
    type: 'website',
  },
};

// Inner component with PropertiesListing logic
function AllPropertiesContent() {
  return (
    <PropertiesListing
      title="All Properties"
      filterType="all"
      showFilters={true}
    />
  );
}

// Outer component with Suspense wrapper
export default function AllPropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    }>
      <AllPropertiesContent />
    </Suspense>
  );
}
