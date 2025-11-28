// src/app/safety-tips/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Safety Tips | Guyana Home Hub',
  description: 'Important safety tips for buying, selling, and renting property in Guyana. Protect yourself from fraud and scams.',
};

export default function SafetyTipsPage() {
  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Guyana Home Hub';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Safety Tips</h1>
          <p className="text-lg text-gray-600">
            Protect yourself when buying, selling, or renting property. Follow these guidelines to stay safe.
          </p>
        </div>

        {/* Before You Visit */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🏠</span>
            Before You Visit a Property
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Research the listing</strong> — Search the address online, check if it matches public records</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Verify the seller</strong> — Ask for identification and proof of ownership</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Meet during daylight</strong> — Schedule viewings during daytime hours</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Bring someone with you</strong> — Don't go alone to property viewings</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Tell someone your plans</strong> — Share the address and meeting time with a friend or family member</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Meet at the property</strong> — Don't get in a car with someone you don't know</span>
            </li>
          </ul>
        </section>

        {/* Payment Safety */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">💰</span>
            Payment Safety
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span><strong>Never wire money</strong> before seeing the property in person</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span><strong>Never pay cash deposits</strong> without a written receipt and agreement</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span><strong>Never pay for a property you haven't visited</strong> — Scammers use photos of properties they don't own</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span><strong>Be wary of deals that seem too good to be true</strong> — Below-market prices can indicate fraud</span>
            </li>
          </ul>
        </section>

        {/* For Rentals */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🔑</span>
            For Rentals Specifically
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">⚠</span>
              <span><strong>Verify the landlord owns the property</strong> — Ask for proof of ownership or management authority</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">⚠</span>
              <span><strong>Get everything in writing</strong> — Ensure you have a proper lease agreement before paying</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">⚠</span>
              <span><strong>Inspect the property thoroughly</strong> — Document any existing damage before moving in</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">⚠</span>
              <span><strong>Understand all fees</strong> — Ask about deposits, utilities, and any additional charges</span>
            </li>
          </ul>
        </section>

        {/* Red Flags */}
        <section className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">🚩</span>
            Red Flags to Watch For
          </h2>
          <ul className="space-y-2 text-red-700">
            <li>• Seller refuses to meet in person</li>
            <li>• Seller asks for payment via wire transfer or cryptocurrency</li>
            <li>• Price is significantly below market value</li>
            <li>• Seller is "out of the country" and can't show the property</li>
            <li>• Pressure to make quick decisions or payments</li>
            <li>• Listing photos don't match the actual property</li>
            <li>• Seller can't provide documentation or proof of ownership</li>
            <li>• Communication only through messaging apps, refuses phone calls</li>
          </ul>
        </section>

        {/* Report Suspicious Activity */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">📢</span>
            Report Suspicious Activity
          </h2>
          <p className="text-blue-700 mb-4">
            If you encounter a suspicious listing or believe you've been targeted by a scam:
          </p>
          <ol className="space-y-2 text-blue-700 list-decimal list-inside">
            <li><strong>Report the listing</strong> using the "Report" button on the property page</li>
            <li><strong>Contact us</strong> at <a href="mailto:info@guyanahomehub.com" className="underline">info@guyanahomehub.com</a></li>
            <li><strong>File a police report</strong> if you've lost money</li>
            <li><strong>Contact your bank</strong> immediately if you've made a payment</li>
          </ol>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-sm text-gray-500 text-center">
            <strong>Disclaimer:</strong> {SITE_NAME} is a listing platform operated by Portal Home Hub, 
            its subsidiaries, Caribbean Home Hub LLC, and their affiliates. We do not verify ownership 
            of properties listed by private sellers (For Sale By Owner or private landlords). Users are 
            responsible for conducting their own due diligence before entering into any transaction.
          </p>
        </section>
      </div>
    </div>
  );
}