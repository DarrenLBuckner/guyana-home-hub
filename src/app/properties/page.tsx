'use client';
import { Suspense } from 'react';
import PropertiesListing from '@/components/PropertiesListingFixed';

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
          <div className="text-4xl mb-4 animate-pulse">🏠</div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    }>
      <AllPropertiesContent />
    </Suspense>
  );
}
