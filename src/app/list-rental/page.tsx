// src/app/list-rental/page.tsx
"use client";

import Navbar from '../../components/Navbar';


export default function ListRentalPage() {
  return (
    <div>
      
      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          List Your Rental Property
        </h1>

        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-green-700 font-semibold text-center">
            <div>
              <div className="text-lg">G$5,200 for 30 days</div>
              <div className="text-sm text-gray-600">Basic</div>
            </div>
            <div>
              <div className="text-lg">G$7,300 for 30 days</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div>
              <div className="text-lg">G$12,500 for 90 days</div>
              <div className="text-sm text-gray-600">Premium (20% savings)</div>
            </div>
          </div>

          <form className="space-y-6">
            <input type="text" placeholder="Property Title" className="w-full px-4 py-2 border border-gray-300 rounded" />
            <textarea placeholder="Property Description (Powered by AI)" className="w-full px-4 py-2 border border-gray-300 rounded" rows={4}></textarea>
            <input type="text" placeholder="Location / Region" className="w-full px-4 py-2 border border-gray-300 rounded" />
            <input type="number" placeholder="Monthly Rent (GYD)" className="w-full px-4 py-2 border border-gray-300 rounded" />
            <input type="number" placeholder="Security Deposit (GYD)" className="w-full px-4 py-2 border border-gray-300 rounded" />

            <div>
              <label className="block mb-1 font-medium">Lease Terms</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded">
                <option>Month-to-Month</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Pet Policy</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded">
                <option>No Pets</option>
                <option>Cats Only</option>
                <option>Small Dogs Only</option>
                <option>All Pets Allowed</option>
              </select>
            </div>

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
