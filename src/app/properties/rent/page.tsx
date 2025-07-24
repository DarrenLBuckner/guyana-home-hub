"use client";

import PropertiesListingFixed from '@/components/PropertiesListingFixed'

export default function RentPage() {
  return (
    <PropertiesListingFixed 
      title="Properties for Rent"
      filterType="rent"
      showFilters={true}
    />
  )
}
