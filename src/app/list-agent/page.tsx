// src/app/list-agent/page.tsx
"use client";

import Navbar from '@components/layout/Navbar';


export default function ListAgentPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
          Join Our Premier Agent Network
        </h1>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-gray-300 p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Starter</h2>
            <p className="text-xl font-bold mb-4">G$6,000 / month</p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>Up to 5 Listings</li>
              <li>Basic Agent Profile</li>
              <li>Monthly Email Stats</li>
            </ul>
            <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">
              Get Started
            </button>
          </div>

          <div className="border border-yellow-500 p-6 rounded-lg shadow-md text-center bg-yellow-50">
            <h2 className="text-2xl font-semibold text-yellow-700 mb-2">Pro Agent</h2>
            <p className="text-xl font-bold mb-4">G$11,000 / month</p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>Up to 20 Listings</li>
              <li>Enhanced Profile with Branding</li>
              <li>Real-Time Leads</li>
              <li>Featured Placement in Searches</li>
            </ul>
            <button className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition">
              Most Popular
            </button>
          </div>

          <div className="border border-gray-300 p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Elite Agent</h2>
            <p className="text-xl font-bold mb-4">G$25,000 / month</p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>Unlimited Listings</li>
              <li>Priority Profile & Badges</li>
              <li>Marketing Reports & Analytics</li>
              <li>Top Placement in Searches</li>
            </ul>
            <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
