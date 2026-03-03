import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guyana Business Directory | Real Estate Services',
  description: 'Find real estate services in Guyana. Lawyers, surveyors, contractors, movers, and more. Trusted professionals for property transactions.',
  alternates: {
    canonical: '/business-directory',
  },
  openGraph: {
    title: 'Guyana Business Directory | Real Estate Services',
    description: 'Find real estate services in Guyana. Lawyers, surveyors, contractors, and more.',
    url: 'https://www.guyanahomehub.com/business-directory',
    type: 'website',
  },
}

export default function BusinessDirectoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
