// src/app/list-rental/page.tsx
"use client";

import { CurrencyFormatter } from '@/lib/currency';

export default function ListRentalPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
        List Your Rental Property
      </h1>
      
      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-green-700 font-semibold text-center">
          <div>
            <div className="text-lg">{CurrencyFormatter.pricing(5200)} for 30 days</div>
            <div className="text-sm text-gray-600">Basic</div>
          </div>
          <div>
            <div className="text-lg">{CurrencyFormatter.pricing(7300)} for 30 days</div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
          <div>
            <div className="text-lg">{CurrencyFormatter.pricing(12500)} for 90 days</div>
            <div className="text-sm text-gray-600">Premium (20% savings)</div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Choose your rental listing package above and get started!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Complete form and property upload system coming soon...
          </p>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">What's Included:</h3>
              <ul className="text-left text-sm text-gray-600 space-y-1">
                <li>• Professional property listing</li>
                <li>• Photo gallery with up to 20 images</li>
                <li>• Property details and amenities</li>
                <li>• Contact form for inquiries</li>
                <li>• Featured placement options</li>
              </ul>
            </div>
            
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Contact Us to Get Started
            </button>
            
            <p className="text-xs text-gray-500">
              Need help? Email us at <a href="mailto:info@guyanahomehub.com" className="text-green-600 underline">info@guyanahomehub.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
