// src/app/advertise/page.tsx
"use client";

import Navbar from '@components/layout/Navbar';




export default function AdvertisePage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen py-20 px-6 bg-white">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-6">
          Advertise With Guyana Home Hub
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-2xl mx-auto mb-10">
          Reach thousands of property buyers, renters, and real estate professionals. Promote your business to a growing market in Guyana and beyond.
        </p>

        <div className="max-w-3xl mx-auto space-y-6 text-gray-800">
          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Why Advertise With Us?</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Highly targeted audience of home buyers and renters.</li>
              <li>Competitive pricing with flexible ad options.</li>
              <li>Custom campaign support from our marketing team.</li>
              <li>Display ads, featured listings, social promotions and more.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Get Started</h2>
            <p>Email us at <a href="mailto:advertise@guyanahomehub.com" className="text-green-600 underline">advertise@guyanahomehub.com</a> or contact us on WhatsApp to discuss your campaign goals.</p>
            <a
              href="https://wa.me/592XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-green-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              Message Us on WhatsApp
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
