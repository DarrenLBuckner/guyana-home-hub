"use client";

import PropertiesListingFixed from '@/components/PropertiesListingFixed'

export default function BuyPage() {
  return (
    <PropertiesListingFixed 
      title="Find Your Dream Home to Buy"
      filterType="sale"
      showFilters={true}
    />
  )
}
