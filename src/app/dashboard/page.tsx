// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/supabaseServer'

export default async function Dashboard() {
  const { user, role } = await getUserWithRole()

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

      {/* Admins + Supers */}
      {(role === 'admin' || role === 'super') && (
        <a href="/dashboard/pending" className="block text-[#0891b2] underline">
          ✅ Approve Listings
        </a>
      )}
    </main>
  )
}
