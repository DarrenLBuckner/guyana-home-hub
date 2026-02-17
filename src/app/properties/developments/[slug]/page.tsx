import { Metadata } from 'next'
import DevelopmentDetailClient from './DevelopmentDetailClient'

interface DevelopmentMeta {
  name: string
  tagline: string | null
  description: string | null
  location_area: string | null
  city: string | null
  price_from: number | null
  price_to: number | null
  currency: string | null
  hero_image: string | null
  developer_name: string | null
}

async function getDevelopment(slug: string): Promise<DevelopmentMeta | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.guyanahomehub.com'
    const res = await fetch(`${baseUrl}/api/developments/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.development ?? null
  } catch {
    return null
  }
}

function formatPrice(price: number, currency: string): string {
  if (currency === 'GYD') return `GYD ${(price / 1_000_000).toFixed(1)}M`
  return `$${price.toLocaleString()}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dev = await getDevelopment(slug)

  if (!dev) {
    return {
      title: 'Development Not Found | Guyana Home Hub',
      description: 'The development you are looking for could not be found.',
    }
  }

  const location = [dev.location_area, dev.city].filter(Boolean).join(', ')
  const currency = dev.currency || 'USD'
  const priceStr =
    dev.price_from && dev.price_to
      ? `${formatPrice(dev.price_from, currency)} - ${formatPrice(dev.price_to, currency)}`
      : ''
  const description = [
    dev.tagline,
    dev.developer_name ? `by ${dev.developer_name}` : null,
    location ? `in ${location}` : null,
    priceStr ? `from ${priceStr}` : null,
  ]
    .filter(Boolean)
    .join(' | ')

  const ogImage = dev.hero_image || '/images/default-property-og.jpg'

  return {
    title: `${dev.name} | Developments | Guyana Home Hub`,
    description,
    openGraph: {
      title: dev.name,
      description,
      url: `https://www.guyanahomehub.com/properties/developments/${slug}`,
      siteName: 'Guyana Home Hub',
      images: [{ url: ogImage, width: 1200, height: 630, alt: dev.name }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dev.name,
      description,
      images: [ogImage],
    },
  }
}

export default async function DevelopmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <DevelopmentDetailClient slug={slug} />
}
