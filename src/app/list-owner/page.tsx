// src/app/list-owner/page.tsx
"use client";

import Navbar from '@components/layout/Navbar';

export default function ListOwnerPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          List Your Home for Sale
        </h1>

        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
          <div className="flex justify-between items-center text-sm sm:text-base text-green-700 font-semibold">
            <span>G$10,000 for 30 days</span>
            <span className="text-center font-bold">No agent fees</span>
            <span>G$25,000 for 90 days <span className="text-xs ml-1 text-gray-500">(Most Popular)</span></span>
          </div>

          <form className="space-y-6">
            <input type="text" placeholder="Property Title" className="w-full px-4 py-2 border border-gray-300 rounded" />
            <textarea placeholder="Property Description (Powered by AI)" className="w-full px-4 py-2 border border-gray-300 rounded" rows={4}></textarea>
            <input type="text" placeholder="Location / Region" className="w-full px-4 py-2 border border-gray-300 rounded" />
            <input type="number" placeholder="Price (GYD)" className="w-full px-4 py-2 border border-gray-300 rounded" />
            <input type="number" placeholder="Square Footage" className="w-full px-4 py-2 border border-gray-300 rounded" />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {["Garden", "Security", "Fruit Trees", "Swimming Pool", "Air Conditioning", "Garage / Parking"].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>{feature}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block mb-1 font-medium">Upload Property Images</label>
              <input type="file" accept="image/*" multiple className="w-full" />
            </div>

            <div className="text-center pt-4">
              <button type="submit" className="bg-green-700 text-white font-semibold px-8 py-3 rounded hover:bg-green-800 transition">
                Submit Listing
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
