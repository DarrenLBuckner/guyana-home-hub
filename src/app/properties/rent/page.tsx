"use client";


export default function RentPage() {
  return (
    <div>
      
      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          Search Properties for Rent
        </h1>

        <form className="max-w-5xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Input */}
            <input
              type="text"
              placeholder="Region, City, or Area"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />

            {/* Property Type */}
            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Property Type</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
              <option>Commercial</option>
            </select>

            {/* Price Range (GYD) */}
            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Min Price (GYD)</option>
              <option>25,000</option>
              <option>50,000</option>
              <option>100,000</option>
              <option>250,000</option>
              <option>500,000</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Max Price (GYD)</option>
              <option>100,000</option>
              <option>250,000</option>
              <option>500,000</option>
              <option>1,000,000</option>
              <option>2,000,000</option>
            </select>

            {/* Bedrooms */}
            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Bedrooms</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
            </select>

            {/* Bathrooms */}
            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Bathrooms</option>
              <option>1+</option>
              <option>2+</option>
            </select>

            {/* Parking */}
            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Parking / Garage</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          {/* Feature Checkboxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            {["Pet Friendly", "Pool", "Garden", "Fruit Trees", "Security", "AC"].map((feature) => (
              <label key={feature} className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        </form>
      </main>
    </div>
  );
}
