import { Metadata } from 'next';
import { Suspense } from 'react';
import PropertiesListingFixed from '@/components/PropertiesListingFixed';
import PropertySearchTabs from '@/components/PropertySearchTabs';

export const metadata: Metadata = {
  title: 'Properties for Rent in Guyana | Houses, Apartments',
  description: 'Browse rental properties across Guyana. Houses, apartments, and commercial spaces. Verified landlords and agents. Filter by location, price, and bedrooms.',
  alternates: {
    canonical: '/properties/rent',
  },
  openGraph: {
    title: 'Properties for Rent in Guyana | Houses, Apartments',
    description: 'Browse rental properties across Guyana. Houses, apartments, and commercial spaces. Verified landlords and agents.',
    url: 'https://www.guyanahomehub.com/properties/rent',
    type: 'website',
  },
};

function RentPropertiesContent() {
  return (
    <>
      <PropertySearchTabs variant="listing" defaultTab="rent" />
      <PropertiesListingFixed
        title="Rental Properties"
        filterType="rent"
        propertyCategory="residential"
        showFilters={false}
      />
    </>
  );
}

export default function RentPropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rental properties...</p>
        </div>
      </div>
    }>
      <RentPropertiesContent />
    </Suspense>
  );
}
