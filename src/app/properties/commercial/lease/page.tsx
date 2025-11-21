'use client';
import { Suspense } from 'react';
import PropertiesListingFixed from '@/components/PropertiesListingFixed';

// Inner component
function CommercialLeasePropertiesContent() {
  return (
    <PropertiesListingFixed 
      title="Find Your Commercial Lease Properties"
      filterType={["lease", "rent"]}
      propertyCategory="commercial"
      showFilters={true}
    />
  );
}

// Outer component with Suspense
export default function CommercialLeasePropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🏢</div>
          <p className="text-gray-600">Loading commercial properties for lease...</p>
        </div>
      </div>
    }>
      <CommercialLeasePropertiesContent />
    </Suspense>
  );
}