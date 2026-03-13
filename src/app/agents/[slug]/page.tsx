import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import AgentProfileClient from './AgentProfileClient'
import type { Metadata } from 'next'

// Service role client to bypass RLS for server-side reads
function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Matches the rebuilt premier_agents view exactly
interface PremierAgent {
  id: string
  slug: string
  full_name: string
  profile_image: string | null
  phone: string | null
  email: string | null
  company: string | null
  is_founding_member: boolean
  is_verified_agent: boolean
  is_premium_agent: boolean
  bio: string | null
  specialties: string[] | null
  target_region: string | null
  years_experience: number | null
  active_listing_count: number
}

interface AgentPageProps {
  params: Promise<{ slug: string }>
}

async function getAgent(slug: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('premier_agents' as any)
    .select('*')
    .eq('slug', slug)
    .single()

  const agent = data as unknown as PremierAgent | null
  if (error || !agent) return null

  // Fetch active listings for this agent using agent.id
  const { data: listings } = await supabase
    .from('properties')
    .select(`
      id, title, price, currency, bedrooms, bathrooms, area_sqft,
      city, region, listing_type, status, slug,
      property_media (
        media_url, media_type, display_order, is_primary
      )
    `)
    .eq('user_id', agent.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  // Normalize specialties from the view — runtime type may vary from TS interface
  let specialties: string[] = []
  const rawSpecialties = agent.specialties as unknown
  if (Array.isArray(rawSpecialties)) {
    specialties = rawSpecialties
  } else if (typeof rawSpecialties === 'string') {
    try {
      const parsed = JSON.parse(rawSpecialties)
      specialties = Array.isArray(parsed) ? parsed : [rawSpecialties]
    } catch {
      specialties = rawSpecialties.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
  }

  const vetting = {
    bio: agent.bio || null,
    specialties,
    target_region: agent.target_region || null,
  }

  return { agent, listings: Array.isArray(listings) ? listings : [], vetting }
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getAgent(slug)

  if (!result) {
    return { title: 'Agent Not Found | Guyana HomeHub' }
  }

  const { agent } = result
  const description = `${agent.full_name} has ${agent.active_listing_count || 0} active listings in Guyana. Contact directly on Guyana HomeHub.`

  return {
    title: `${agent.full_name} | Premier Agent`,
    description,
    openGraph: {
      title: `${agent.full_name} | Premier Agent | Guyana HomeHub`,
      description,
      type: 'profile',
      ...(agent.profile_image ? { images: [{ url: agent.profile_image }] } : {}),
    },
  }
}

export default async function AgentProfilePage({ params }: AgentPageProps) {
  const { slug } = await params
  const result = await getAgent(slug)

  if (!result) {
    notFound()
  }

  const { agent, listings, vetting } = result

  // Transform listings to include primary image
  const transformedListings = listings.map((listing: any) => {
    const images = listing.property_media
      ?.filter((m: any) => m.media_type === 'image')
      ?.sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return a.display_order - b.display_order
      })
      ?.map((m: any) => m.media_url) || []

    return {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      currency: listing.currency,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      area_sqft: listing.area_sqft,
      city: listing.city,
      region: listing.region,
      listing_type: listing.listing_type,
      slug: listing.slug,
      image: images[0] || null,
    }
  })

  return (
    <AgentProfileClient
      agent={agent}
      listings={transformedListings}
      vetting={vetting}
      slug={slug}
    />
  )
}
