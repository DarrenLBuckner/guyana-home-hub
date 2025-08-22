import React from 'react';

export default function ComingSoonLandlord() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Coming Soon: Landlord Services</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
        We’re working on powerful tools for landlords to find reliable tenants and manage properties. Stay tuned!
      </p>
      <p className="mb-4 text-gray-600">Questions or want to be notified? Contact us:</p>
      <div className="flex flex-col items-center gap-2">
        <a href="mailto:info@guyanahomehub.com" className="text-green-700 underline font-medium">info@guyanahomehub.com</a>
        <a href="#" className="text-green-700 underline font-medium">WhatsApp us (coming soon)</a>
      </div>
      <div className="mt-8 text-center text-gray-500">
        "Guyana’s trusted platform for landlords."
      </div>
    </div>
  );
}
