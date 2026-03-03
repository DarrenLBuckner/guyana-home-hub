import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List Your Property Free in Guyana | Real Estate Agents',
  description: 'List your properties for free on Guyana Home Hub. Reach Guyanese buyers in New York, Toronto, and London. Professional platform for real estate agents.',
  alternates: {
    canonical: '/advertise',
  },
  openGraph: {
    title: 'List Your Property Free in Guyana | Real Estate Agents',
    description: 'List your properties for free on Guyana Home Hub. Reach Guyanese buyers in New York, Toronto, and London.',
    url: 'https://www.guyanahomehub.com/advertise',
    type: 'website',
  },
}

export default function AdvertiseLayout({ children }: { children: React.ReactNode }) {
  return children
}
