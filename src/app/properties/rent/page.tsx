'use client';
import { Suspense } from 'react';
import PropertiesListingFixed from '@/components/PropertiesListingFixed';

// Inner component
function RentPropertiesContent() {
  return (
    <PropertiesListingFixed 
      title="Find Your Rental Property"
      filterType="rent"
      showFilters={true}
    />
  );
}

// Outer component with Suspense
export default function RentPropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🏠</div>
          <p className="text-gray-600">Loading rental properties...</p>
        </div>
      </div>
    }>
      <RentPropertiesContent />
    </Suspense>
  );
}
