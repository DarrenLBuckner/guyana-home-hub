import { Metadata } from 'next';
import { Suspense } from 'react';
import PropertiesListingFixed from '@/components/PropertiesListingFixed';
import PropertySearchTabs from '@/components/PropertySearchTabs';

export const metadata: Metadata = {
  title: 'Commercial Real Estate in Guyana | Office, Retail, Warehouse',
  description: 'Find commercial real estate in Guyana. Office spaces, retail, warehouses, and industrial properties. Verified listings from trusted agents.',
  alternates: {
    canonical: '/properties/commercial',
  },
  openGraph: {
    title: 'Commercial Real Estate in Guyana | Office, Retail, Warehouse',
    description: 'Find commercial real estate in Guyana. Office spaces, retail, warehouses, and industrial properties.',
    url: 'https://www.guyanahomehub.com/properties/commercial',
    type: 'website',
  },
};

function CommercialPropertiesContent() {
  return (
    <>
      <PropertySearchTabs variant="listing" defaultTab="commercial" />
      <PropertiesListingFixed
        title="Commercial Properties"
        filterType={['sale', 'lease']}
        propertyCategory="commercial"
        showFilters={false}
      />
    </>
  );
}

export default function CommercialPropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading commercial properties...</p>
        </div>
      </div>
    }>
      <CommercialPropertiesContent />
    </Suspense>
  );
}
