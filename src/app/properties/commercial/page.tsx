'use client';
import { Suspense } from 'react';
import PropertiesListingFixed from '@/components/PropertiesListingFixed';
import PropertySearchTabs from '@/components/PropertySearchTabs';

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
