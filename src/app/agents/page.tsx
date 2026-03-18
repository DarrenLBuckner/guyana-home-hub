import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { AgentWhatsAppButton } from '@/components/WhatsAppButton'

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export const metadata: Metadata = {
  title: 'Find Property in Guyana — Message Agents Directly',
  description: 'Browse listings and connect with verified agents on WhatsApp.',
  alternates: {
    canonical: 'https://www.guyanahomehub.com/agents',
  },
  openGraph: {
    title: 'Find Property in Guyana — Message Agents Directly',
    description: 'Browse listings and connect with verified agents on WhatsApp.',
    type: 'website',
    url: 'https://www.guyanahomehub.com/agents',
    images: [
      {
        url: 'https://www.guyanahomehub.com/images/og-agents.png',
        width: 1200,
        height: 630,
        alt: 'Guyana HomeHub Agents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Property in Guyana — Message Agents Directly',
    description: 'Browse listings and connect with verified agents on WhatsApp.',
  },
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function cleanPhone(phone: string): string {
  return phone.replace(/[\s\-\+\(\)]/g, '')
}

export const revalidate = 300

export default async function AgentsPage() {
  const supabase = createServiceClient()

  const { data: agents } = await supabase
    .from('premier_agents' as any)
    .select('*')
    .order('active_listing_count', { ascending: false })

  const { data: allVerifiedAgents } = await supabase
    .from('profiles')
    .select('id, slug, first_name, last_name, profile_image, company, is_founding_member, is_verified_agent, phone')
    .eq('is_verified_agent', true)
    .eq('user_type', 'agent')

  // Fetch neighborhoods from agent_vetting bio_questionnaire
  const allAgentIds = [
    ...(agents as any[] || []).map((a: any) => a.id),
    ...(allVerifiedAgents || []).map((a: any) => a.id),
  ]
  const { data: vettingData } = await supabase
    .from('agent_vetting')
    .select('user_id, bio_questionnaire')
    .in('user_id', allAgentIds)

  const neighborhoodMap = new Map<string, string[]>()
  for (const v of (vettingData || [])) {
    const hoods = v.bio_questionnaire?.neighborhoods
    if (Array.isArray(hoods) && hoods.length > 0) {
      neighborhoodMap.set(v.user_id, hoods)
    }
  }

  const premierIds = new Set((agents as any[] || []).map((a: any) => a.id))
  const remainingAgents = (allVerifiedAgents || [])
    .filter((a: any) => !premierIds.has(a.id))
    .map((a: any) => ({
      ...a,
      full_name: `${a.first_name || ''} ${a.last_name || ''}`.trim(),
      active_listing_count: 0,
      years_experience: null,
      neighborhoods: neighborhoodMap.get(a.id) || [],
    }))

  const premierAgents = (agents as any[] || []).map((a: any) => ({
    ...a,
    neighborhoods: neighborhoodMap.get(a.id) || [],
  }))
  const otherAgents = remainingAgents

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Our Agents</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect directly with verified agents in Guyana.<br />
            Call or message instantly — no middleman.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-10">
        {/* Premier Agents Section */}
        {premierAgents.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {premierAgents.map((agent: any) => (
                <div
                  key={agent.id}
                  className="bg-emerald-50/40 rounded-xl shadow-sm border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 overflow-hidden"
                >
                  {/* Premier accent bar */}
                  <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600" />
                  <div className="p-5">
                    {/* Clickable profile area */}
                    <Link href={`/agents/${agent.slug}`} className="block group mb-3">
                      <div className="flex items-center gap-3.5">
                        {agent.profile_image ? (
                          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-emerald-400 shrink-0">
                            <Image
                              src={agent.profile_image}
                              alt={agent.full_name}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center ring-2 ring-emerald-400 shrink-0">
                            <span className="text-lg font-bold text-white">
                              {getInitials(agent.full_name)}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h2 className="font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                            {agent.full_name}
                          </h2>
                          {agent.company && (
                            <p className="text-sm text-gray-500 truncate">{agent.company}</p>
                          )}
                        </div>
                        {/* Premier badge */}
                        <img
                          src="/images/homehub-premier-agent-mobile.png"
                          alt="HomeHub Premier Agent"
                          className="h-10 w-10 object-contain shrink-0"
                        />
                      </div>
                    </Link>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {agent.is_founding_member && (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                          Founding Member
                        </span>
                      )}
                      {agent.is_verified_agent && (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Experience + Coverage */}
                    {agent.years_experience && (
                      <p className="text-xs text-gray-400 mb-1">
                        {agent.years_experience}+ yrs experience
                      </p>
                    )}
                    {agent.neighborhoods.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3 truncate">
                        📍 Covers: {agent.neighborhoods.join(' | ')}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <Link
                        href={`/agents/${agent.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                        </svg>
                        View {agent.active_listing_count} Listings
                      </Link>
                      {agent.phone ? (
                        <AgentWhatsAppButton
                          agentName={agent.full_name}
                          agentPhone={cleanPhone(agent.phone)}
                          className="flex-1 !px-3 !py-2.5 !rounded-lg !text-sm"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Verified Agents */}
        {otherAgents.length > 0 && (
          <div>
            {premierAgents.length > 0 && (
              <h2 className="text-lg font-semibold text-gray-700 mb-5">All Verified Agents</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {otherAgents.map((agent: any) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Clickable profile area */}
                    <Link href={`/agents/${agent.slug}`} className="block group mb-3">
                      <div className="flex items-center gap-3.5">
                        {agent.profile_image ? (
                          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-200 shrink-0">
                            <Image
                              src={agent.profile_image}
                              alt={agent.full_name}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center ring-2 ring-gray-200 shrink-0">
                            <span className="text-lg font-bold text-white">
                              {getInitials(agent.full_name)}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h2 className="font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                            {agent.full_name}
                          </h2>
                          {agent.company && (
                            <p className="text-sm text-gray-500 truncate">{agent.company}</p>
                          )}
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {agent.is_founding_member && (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                          Founding Member
                        </span>
                      )}
                      {agent.is_verified_agent && (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Coverage areas */}
                    {agent.neighborhoods.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3 truncate">
                        📍 Covers: {agent.neighborhoods.join(' | ')}
                      </p>
                    )}

                    {/* WhatsApp button only */}
                    {agent.phone ? (
                      <div className="pt-3 border-t border-gray-100">
                        <AgentWhatsAppButton
                          agentName={agent.full_name}
                          agentPhone={cleanPhone(agent.phone)}
                          className="w-full !px-3 !py-2.5 !rounded-lg !text-sm"
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic text-center pt-3 border-t border-gray-100">
                        Contact unavailable
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
