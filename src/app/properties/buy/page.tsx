"use client";

import Navbar from '@/components/layout/Navbar';

export default function BuyPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          Search Properties for Sale
        </h1>

        <form className="max-w-5xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Region, City, or Area"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Property Type</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
              <option>Commercial</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Min Price (GYD)</option>
              <option>1,000,000</option>
              <option>5,000,000</option>
              <option>10,000,000</option>
              <option>20,000,000</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Max Price (GYD)</option>
              <option>20,000,000</option>
              <option>50,000,000</option>
              <option>100,000,000</option>
              <option>200,000,000+</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Bedrooms</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Bathrooms</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Parking/Garage</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              "Pet-Friendly",
              "Pool",
              "Garden",
              "Fruit Trees",
              "Security",
              "Estate",
              "AC",
            ].map((filter) => (
              <label key={filter} className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>{filter}</span>
              </label>
            ))}
          </div>

          <div className="text-center pt-4">
            <button className="bg-green-700 text-white font-semibold px-8 py-3 rounded hover:bg-green-800 transition">
              Search Properties
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
