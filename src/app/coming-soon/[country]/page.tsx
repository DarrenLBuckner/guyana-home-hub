import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ country: string }>
}

async function getTerritoryData(countryCode: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('territories')
      .select('display_name, flag_emoji, primary_color, country_name, default_language')
      .eq('country_code', countryCode.toUpperCase())
      .single()

    if (error || !data) return null
    return data
  } catch (error) {
    console.error('Failed to fetch territory data:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params
  const territory = await getTerritoryData(country)

  const title = territory
    ? `${territory.display_name} - Coming Soon`
    : `${country.toUpperCase()} HomeHub - Coming Soon`

  const description = territory
    ? `${territory.display_name} is preparing to launch. Check back soon for real estate listings in ${territory.country_name}.`
    : 'This HomeHub territory is preparing to launch. Check back soon!'

  return {
    title,
    description,
    robots: { index: false, follow: false },
  }
}

export default async function ComingSoonPage({ params }: Props) {
  const { country } = await params
  const territory = await getTerritoryData(country)

  const displayName = territory?.display_name ?? `${country.toUpperCase()} HomeHub`
  const countryName = territory?.country_name ?? country.toUpperCase()
  const flag = territory?.flag_emoji
  const accentColor = territory?.primary_color

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-16">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">
        {flag && (
          <div className="text-8xl mb-6" aria-hidden="true">
            {flag}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {displayName}
        </h1>

        <p
          className="text-xl font-semibold mb-6"
          style={accentColor ? { color: accentColor } : undefined}
        >
          Coming Soon
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          We&apos;re preparing to launch real estate listings in {countryName}.
          Check back soon!
        </p>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-400">
            HomeHub &mdash; Real estate across the Caribbean and beyond
          </p>
        </div>

        {/* TODO: Waitlist email capture
        <form className="mt-6 flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: accentColor || '#2563eb' }}
          >
            Notify Me
          </button>
        </form>
        */}
      </div>
    </div>
  )
}
