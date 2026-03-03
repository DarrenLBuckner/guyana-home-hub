import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Guyana Home Hub | Real Estate Support | +592 762 9797',
  description: 'Contact Guyana Home Hub for property inquiries. WhatsApp +592 762 9797. Email info@guyanahomehub.com. Caribbean Home Hub LLC, Missouri, USA.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Guyana Home Hub | Real Estate Support',
    description: 'Contact Guyana Home Hub for property inquiries. WhatsApp +592 762 9797. Email info@guyanahomehub.com.',
    url: 'https://www.guyanahomehub.com/contact',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
