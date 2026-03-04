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
      .select('display_name, country_name, flag_emoji')
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
    ? `${territory.display_name} - Temporarily Unavailable`
    : 'Territory Temporarily Unavailable'

  return {
    title,
    description: 'This territory is temporarily unavailable.',
    robots: { index: false, follow: false },
  }
}

export default async function SuspendedPage({ params }: Props) {
  const { country } = await params
  const territory = await getTerritoryData(country)

  const flag = territory?.flag_emoji

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-10 text-center">
        {flag && (
          <div className="text-7xl mb-6" aria-hidden="true">
            {flag}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Temporarily Unavailable
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          This territory is currently unavailable. For inquiries, please
          contact support.
        </p>

        <a
          href="mailto:support@portalhomehub.com"
          className="inline-block text-gray-700 underline underline-offset-2 hover:text-gray-900 transition-colors"
        >
          support@portalhomehub.com
        </a>
      </div>
    </div>
  )
}
