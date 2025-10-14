'use client';
import { Suspense } from 'react';
import PropertiesListingFixed from '@/components/PropertiesListingFixed';

// Inner component
function BuyPropertiesContent() {
  return (
    <PropertiesListingFixed 
      title="Find Your Dream Home to Buy"
      filterType="sale"
      showFilters={true}
    />
  );
}

// Outer component with Suspense
export default function BuyPropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🏠</div>
          <p className="text-gray-600">Loading properties for sale...</p>
        </div>
      </div>
    }>
      <BuyPropertiesContent />
    </Suspense>
  );
}
