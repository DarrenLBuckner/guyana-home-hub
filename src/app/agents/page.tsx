import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import PremierBadge from '@/components/PremierBadge'

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const PREMIER_THRESHOLD = 6

export const metadata: Metadata = {
  title: 'Our Agents | Guyana HomeHub',
  description: 'Browse verified real estate agents in Guyana. Find experienced professionals on Guyana HomeHub.',
  openGraph: {
    title: 'Our Agents | Guyana HomeHub',
    description: 'Browse verified real estate agents in Guyana.',
    type: 'website',
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

  const premierIds = new Set((agents as any[] || []).map((a: any) => a.id))
  const remainingAgents = (allVerifiedAgents || [])
    .filter((a: any) => !premierIds.has(a.id))
    .map((a: any) => ({
      ...a,
      full_name: `${a.first_name || ''} ${a.last_name || ''}`.trim(),
      active_listing_count: 0,
      years_experience: null,
    }))

  const premierAgents = (agents as any[] || [])
  const otherAgents = remainingAgents

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Our Agents</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Verified real estate professionals on Guyana HomeHub — trusted, experienced, and ready to help.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Premier Agents Section */}
        {premierAgents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              {/* Mobile: square badge */}
              <img
                src="/images/homehub-premier-agent-mobile.png"
                alt="HomeHub Premier Agent"
                className="sm:hidden h-12 w-12 object-contain"
              />
              {/* Desktop: horizontal badge */}
              <img
                src="/images/homehub-premier-agent-desktop.png"
                alt="HomeHub Premier Agent"
                className="hidden sm:block h-12 w-auto object-contain"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {premierAgents.map((agent: any) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-emerald-200 transition-all duration-300 overflow-hidden group"
                >
                  {/* Premier accent bar */}
                  <div className="h-1 bg-gradient-to-r from-green-700 via-amber-500 to-green-700" />
                  <div className="p-5">
                    {/* Avatar + Name row */}
                    <div className="flex items-center gap-3.5 mb-3">
                      {agent.profile_image ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-emerald-400 shrink-0">
                          <Image
                            src={agent.profile_image}
                            alt={agent.full_name}
                            fill
                            className="object-cover"
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
                    </div>

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

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                      <span className="text-gray-600">
                        <span className="font-semibold text-emerald-600">{agent.active_listing_count}</span> listings
                      </span>
                      {agent.years_experience && (
                        <span className="text-gray-400 text-xs">
                          {agent.years_experience}+ yrs exp
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
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
                <Link
                  key={agent.id}
                  href={`/agents/${agent.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-300 transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3.5 mb-3">
                      {agent.profile_image ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-200 shrink-0">
                          <Image
                            src={agent.profile_image}
                            alt={agent.full_name}
                            fill
                            className="object-cover"
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

                    <div className="flex items-center text-sm border-t border-gray-100 pt-3">
                      <span className="text-gray-400 text-xs">Contact for listings</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
