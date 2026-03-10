// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getUserWithRole, getSupabaseServer } from '@/lib/supabaseServer'

// Force dynamic rendering - this page uses cookies for auth
export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const { user, role } = await getUserWithRole()

  // Fetch admin_level from profiles for platform admin card visibility
  let adminLevel: string | null = null
  if (user) {
    const supabase = getSupabaseServer()
    const { data: profile } = await supabase
      .from('profiles')
      .select('admin_level')
      .eq('id', user.id)
      .single()
    adminLevel = profile?.admin_level || null
  }

  const isPlatformAdmin = adminLevel === 'super' || adminLevel === 'owner'

  /* 1️⃣  Bounce unauthenticated users (middleware also covers this) */
  if (!user) redirect('/signin')

  /* 2️⃣  Show a notice to guests (no paid access yet) */
  if (role === 'guest') {
    return (
      <main className="p-8">
        <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
        <p>Your account isn’t upgraded yet.</p>
      </main>
    )
  }

  /* 3️⃣  Render links for agents / admins / supers */
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Agent Dashboard</h1>

      {/* Agents + Admins + Supers */}
      {(role === 'agent' || role === 'admin' || role === 'super') && (
        <a href="/dashboard/new" className="block text-[#0891b2] underline">
          ➕ New Listing
        </a>
      )}

      {/* Admins + Supers (role-based) */}
      {(role === 'admin' || role === 'super') && (
        <a href="/dashboard/pending" className="block text-[#0891b2] underline">
          ✅ Approve Listings
        </a>
      )}

      {/* Platform admins: super + owner (admin_level-based) */}
      {isPlatformAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          <a
            href="/admin/agents"
            className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Agent Review Queue</h3>
            <p className="text-sm text-gray-600">
              Review and approve new agent applications.
            </p>
          </a>

          <a
            href="/admin/report-export"
            className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Report Export</h3>
            <p className="text-sm text-gray-600">
              Run market reports with date filters. Export as JSON or CSV.
            </p>
          </a>
        </div>
      )}
    </main>
  )
}
