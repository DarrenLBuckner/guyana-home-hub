import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import AgentProfileClient from './AgentProfileClient'
import type { Metadata } from 'next'

export const revalidate = 300 // refresh every 5 minutes

const PREMIER_THRESHOLD = 6

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface AgentPageProps {
  params: Promise<{ slug: string }>
}

async function getAgent(slug: string) {
  const supabase = createServiceClient()

  // Query profiles directly so page works for ANY agent, not just premier
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, slug, full_name, first_name, last_name, profile_image, phone, email, company, is_founding_member, is_verified_agent, is_premium_agent')
    .eq('slug', slug)
    .single()

  if (error || !profile) return null
  if (!profile.id) return null

  // Get years_experience and bio from agent_vetting
  const { data: vetting } = await supabase
    .from('agent_vetting')
    .select('years_experience, bio, specialties')
    .eq('user_id', profile.id)
    .single()

  // Fetch visible listings — sold/rented kept for social proof, demoted to bottom
  const { data: listings } = await supabase
    .from('properties')
    .select(`
      id, title, price, currency, bedrooms, bathrooms,
      city, region, listing_type, status, slug,
      property_media!property_media_property_id_fkey (
        media_url, media_type, display_order, is_primary
      )
    `)
    .eq('user_id', profile.id)
    .in('status', ['active', 'under_contract', 'off_market', 'sold', 'rented'])
    .order('created_at', { ascending: false })

  const allListings = Array.isArray(listings) ? listings : []
  // Only count active/under_contract/off_market for premier threshold
  const activeListings = allListings.filter((l: any) => !['sold', 'rented'].includes(l.status))
  const isPremier = profile.is_premium_agent || activeListings.length >= PREMIER_THRESHOLD

  // Build full_name from parts if not set
  const fullName = profile.full_name
    || [profile.first_name, profile.last_name].filter(Boolean).join(' ')
    || 'Agent'

  // Sort: active/under_contract/off_market first, sold/rented last
  const demotedStatuses = new Set(['sold', 'rented'])
  const sortedListings = [...allListings].sort((a: any, b: any) => {
    const aD = demotedStatuses.has(a.status) ? 1 : 0
    const bD = demotedStatuses.has(b.status) ? 1 : 0
    return aD - bD
  })

  // Transform listings to include primary image
  const transformedListings = sortedListings.map((listing: any) => {
    const images = listing.property_media
      ?.filter((m: any) => m.media_type === 'image')
      ?.sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return (a.display_order || 0) - (b.display_order || 0)
      })
      ?.map((m: any) => m.media_url) || []

    return {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      currency: listing.currency,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      city: listing.city,
      region: listing.region,
      listing_type: listing.listing_type,
      status: listing.status,
      slug: listing.slug,
      image: images[0] || null,
    }
  })

  return {
    agent: {
      id: profile.id,
      slug: profile.slug,
      full_name: fullName,
      profile_image: profile.profile_image,
      phone: profile.phone,
      email: profile.email,
      company: profile.company,
      is_founding_member: profile.is_founding_member ?? false,
      is_verified_agent: profile.is_verified_agent ?? false,
      is_premium_agent: profile.is_premium_agent ?? false,
      active_listing_count: activeListings.length,
      years_experience: vetting?.years_experience ?? null,
      bio: vetting?.bio ?? null,
      specialties: vetting?.specialties ?? null,
    },
    listings: transformedListings,
    isPremier,
  }
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getAgent(slug)

  if (!result) {
    return { title: 'Agent Not Found | Guyana HomeHub' }
  }

  const { agent, isPremier } = result
  const label = isPremier ? 'Premier Agent' : 'Agent'
  const description = `${agent.full_name} has ${agent.active_listing_count} active listings in Guyana. Contact directly on Guyana HomeHub.`

  return {
    title: `${agent.full_name} | ${label}`,
    description,
    openGraph: {
      title: `${agent.full_name} | ${label} | Guyana HomeHub`,
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

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <AgentProfileClient
        agent={result.agent}
        listings={result.listings}
        isPremier={result.isPremier}
        slug={slug}
      />
    </Suspense>
  )
}
