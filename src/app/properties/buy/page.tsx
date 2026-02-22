'use client';
import { Suspense } from 'react';
import PropertiesListingFixed from '@/components/PropertiesListingFixed';
import PropertySearchTabs from '@/components/PropertySearchTabs';

function BuyPropertiesContent() {
  return (
    <>
      <PropertySearchTabs variant="listing" defaultTab="buy" />
      <PropertiesListingFixed
        title="Properties for Sale"
        filterType="sale"
        propertyCategory="residential"
        showFilters={false}
      />
    </>
  );
}

export default function BuyPropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties for sale...</p>
        </div>
      </div>
    }>
      <BuyPropertiesContent />
    </Suspense>
  );
}
