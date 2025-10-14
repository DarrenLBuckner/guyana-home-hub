"use client";

import PropertiesListingFixed from '@/components/PropertiesListingFixed'

// Force dynamic rendering - page uses useSearchParams
export const dynamic = 'force-dynamic'

export default function RentPage() {
  return (
    <PropertiesListingFixed 
      title="Find Your Rental Property"
      filterType="rent"
      showFilters={true}
    />
  )
}
