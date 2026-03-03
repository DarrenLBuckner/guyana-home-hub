import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Property Developments in Guyana',
  description: 'Discover new property developments and housing projects in Guyana. Modern homes, gated communities, and investment opportunities from verified developers.',
  alternates: {
    canonical: '/properties/developments',
  },
  openGraph: {
    title: 'New Property Developments in Guyana',
    description: 'Discover new property developments and housing projects in Guyana. Modern homes and investment opportunities.',
    url: 'https://www.guyanahomehub.com/properties/developments',
    type: 'website',
  },
}

export default function DevelopmentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
