"use client";

import Navbar from '@/components/layout/Navbar';





export default function DevelopmentsPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          Explore New Developments
        </h1>

        <form className="max-w-5xl mx-auto bg-gray-50 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Region, City, or Area"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Development Type</option>
              <option>Gated Community</option>
              <option>Luxury Villas</option>
              <option>Townhouses</option>
              <option>Mixed-Use</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Min Price (GYD)</option>
              <option>5,000,000</option>
              <option>10,000,000</option>
              <option>20,000,000</option>
              <option>50,000,000</option>
              <option>100,000,000</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Max Price (GYD)</option>
              <option>10,000,000</option>
              <option>50,000,000</option>
              <option>100,000,000</option>
              <option>200,000,000</option>
              <option>500,000,000</option>
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
              <option>4+</option>
            </select>
          </div>
        </form>
      </main>
    </div>
  );
}

