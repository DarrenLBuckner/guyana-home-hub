'use client';
import { Suspense, useState } from 'react';
import PropertiesListingFixed from '@/components/PropertiesListingFixed';

// Inner component with listing type filter
function CommercialPropertiesContent() {
  const [listingFilter, setListingFilter] = useState<'all' | 'sale' | 'lease'>('all');

  // Determine filterType based on selection
  const getFilterType = () => {
    if (listingFilter === 'all') {
      return ['sale', 'lease'];
    }
    return listingFilter;
  };

  return (
    <div>
      {/* Listing Type Filter Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setListingFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              listingFilter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setListingFilter('sale')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              listingFilter === 'sale'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => setListingFilter('lease')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              listingFilter === 'lease'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            For Lease
          </button>
        </div>
      </div>

      <PropertiesListingFixed
        title="Commercial Properties in Guyana"
        filterType={getFilterType()}
        propertyCategory="commercial"
        showFilters={true}
      />
    </div>
  );
}

// Outer component with Suspense
export default function CommercialPropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🏢</div>
          <p className="text-gray-600">Loading commercial properties...</p>
        </div>
      </div>
    }>
      <CommercialPropertiesContent />
    </Suspense>
  );
}
