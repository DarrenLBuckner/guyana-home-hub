// Modern Property Listings Page - Zillow-style Experience
// src/app/properties/page.tsx

import React from 'react'
import { Metadata } from 'next'
import PropertiesListing from '@/components/PropertiesListingFixed'

// Force dynamic rendering - page uses useSearchParams
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Properties for Sale and Rent in Guyana | Real Estate Listings - Guyana Home Hub',
  description: 'Browse all available properties in Guyana. Find houses, apartments, commercial properties, and land for sale or rent in Georgetown, New Amsterdam, Linden, Berbice, Anna Regina and throughout the Caribbean.',
  keywords: 'Guyana properties, real estate Guyana, houses for sale Georgetown, apartments for rent New Amsterdam, commercial properties Linden, land for sale Berbice, Guyana real estate listings, Caribbean properties, South America real estate, properties Anna Regina, homes for sale Guyana, rental properties Guyana, investment properties Caribbean, overseas property investment, diaspora property investment, Guyanese property market, Region 4 properties, Region 3 properties, Region 6 properties, Demerara properties, Essequibo properties, waterfront properties Guyana, luxury homes Georgetown, affordable housing Guyana',
}

export default function PropertiesPage() {
  return (
    <PropertiesListing 
      title="All Properties"
      filterType="all"
      showFilters={true}
    />
  )
}
