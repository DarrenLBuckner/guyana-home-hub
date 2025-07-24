// Test minimal list-rental page
"use client";

import { CurrencyFormatter } from '@/lib/currency';

export default function TestRentalPage() {
  try {
    const pricing1 = CurrencyFormatter.pricing(5200);
    const pricing2 = CurrencyFormatter.pricing(7300);
    const pricing3 = CurrencyFormatter.pricing(12500);

    return (
      <div className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          Test List Your Rental Property
        </h1>
        
        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-green-700 font-semibold text-center">
            <div>
              <div className="text-lg">{pricing1} for 30 days</div>
              <div className="text-sm text-gray-600">Basic</div>
            </div>
            <div>
              <div className="text-lg">{pricing2} for 30 days</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div>
              <div className="text-lg">{pricing3} for 90 days</div>
              <div className="text-sm text-gray-600">Premium (20% savings)</div>
            </div>
          </div>
          
          <p>Test page loaded successfully!</p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-red-700 mb-8">
          Error in Test Page
        </h1>
        <div className="max-w-4xl mx-auto bg-red-50 p-6 rounded-lg">
          <p>Error: {String(error)}</p>
        </div>
      </div>
    );
  }
}
