"use client";

import PropertiesListingFixed from '@/components/PropertiesListingFixed'

// Force dynamic rendering - page uses useSearchParams
export const dynamic = 'force-dynamic'

export default function BuyPage() {
  return (
    <PropertiesListingFixed 
      title="Find Your Dream Home to Buy"
      filterType="sale"
      showFilters={true}
    />
  )
}
