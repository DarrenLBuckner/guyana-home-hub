import { Metadata } from 'next'
import { getCountryFromHeaders } from '@/lib/country-detection'
import HomePageClient from './HomePageClient'

// Server component — exports SEO metadata and renders structured data for Google
export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountryFromHeaders()
  const isJamaica = country === 'JM'
  const countryName = isJamaica ? 'Jamaica' : 'Guyana'
  const siteName = isJamaica ? 'Jamaica Home Hub' : 'Guyana Home Hub'
  const baseUrl = isJamaica ? 'https://www.jamaicahomehub.com' : 'https://www.guyanahomehub.com'
  const countryAdjective = isJamaica ? 'Jamaican' : 'Guyanese'

  const title = `${countryName} Real Estate — Homes & Property for Sale & Rent | ${siteName}`
  const description = `Browse verified ${countryName} properties for sale and rent. Trusted agents, real listings, secure transactions. The trusted platform for ${countryAdjective} diaspora buyers in New York, Toronto & London.`

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function HomePage() {
  const country = await getCountryFromHeaders()
  const isJamaica = country === 'JM'
  const countryName = isJamaica ? 'Jamaica' : 'Guyana'
  const siteName = isJamaica ? 'Jamaica Home Hub' : 'Guyana Home Hub'
  const baseUrl = isJamaica ? 'https://www.jamaicahomehub.com' : 'https://www.guyanahomehub.com'

  // FAQPage schema — targets diaspora buyer search queries for rich snippet eligibility
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Can I buy property in ${countryName} from abroad?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes. ${countryName} allows foreign nationals and diaspora to purchase property. We connect overseas buyers with verified local agents who handle the process safely and legally.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I avoid property scams in ${countryName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Always work with verified agents, confirm property titles through the Deeds Registry, never send money without a signed agreement, and use a local attorney. All agents on our platform are vetted.`
        }
      },
      {
        "@type": "Question",
        "name": `Is it free to list property on ${siteName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes. During our launch period, property owners and real estate agents can list unlimited properties for free. Register as an agent or submit your property through our platform.`
        }
      },
      {
        "@type": "Question",
        "name": `What areas of ${countryName} do you cover?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": isJamaica
            ? `We cover all parishes across Jamaica including Kingston, St. Andrew, Montego Bay, Ocho Rios, and more. Browse properties by parish or search by neighborhood.`
            : `We cover all regions across Guyana including Georgetown, East Bank Demerara, East Coast Demerara, West Coast Demerara, Berbice, and more. Browse properties by region or search by neighborhood.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I find a trusted real estate agent in ${countryName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `All agents on ${siteName} are verified before they can list properties. You can browse agent profiles, see their active listings, and contact them directly through our platform.`
        }
      }
    ]
  }

  // BreadcrumbList schema for homepage
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  }

  return (
    <>
      {/* Server-rendered JSON-LD structured data — Google sees this immediately */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Client component handles all interactive content */}
      <HomePageClient />
    </>
  )
}
