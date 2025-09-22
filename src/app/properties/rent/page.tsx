"use client";

import PropertiesListingFixed from '@/components/PropertiesListingFixed'

export default function RentPage() {
  return (
    <PropertiesListingFixed 
      title="Find Your Rental Property"
      filterType="rent"
      showFilters={true}
    />
  )
}
