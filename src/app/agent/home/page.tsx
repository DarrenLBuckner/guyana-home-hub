'use client'

import Link from 'next/link'

export default function AgentDashboard() {
  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Agent Dashboard</h1>
      <p className="text-lg text-gray-700 mb-4">
        Welcome to your dashboard. Here you can manage your listings, view leads, and update your profile.
      </p>

      <ul className="list-disc pl-6 text-gray-600">
        <li>📦 Add/Edit Property Listings</li>
        <li>📨 See Property Inquiries</li>
        <li>📝 Update Agent Profile</li>
      </ul>
      
      <div className="mt-6 space-y-4">
        <Link
          href="/agent/home/upload"
          className="inline-block text-green-700 underline text-lg"
        >
          + Add New Property
        </Link>
        
        <br />
        
        <Link
          href="/agent/properties"
          className="inline-block text-gray-600 underline text-lg"
        >
          📋 View My Properties
        </Link>
      </div>

    </div>
  )
}
