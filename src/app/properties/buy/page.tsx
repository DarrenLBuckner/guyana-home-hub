"use client";

import PropertiesListingFixed from '@/components/PropertiesListingFixed'

export default function BuyPage() {
  return (
    <PropertiesListingFixed 
      title="Properties for Sale"
      filterType="sale"
      showFilters={true}
    />
  )
}
