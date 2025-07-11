'use client';  // ← this must be the very first line
export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Listing = {
  id: number;
  title: string;
  location: string;
  type: string;
  price: string;
  image: string;
};

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const searchLocation = searchParams.get('location')?.toLowerCase() || '';
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);

  useEffect(() => {
    fetch('/data/listings.json')
      .then((res) => res.json())
      .then((data: Listing[]) => setListings(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setFiltered(
      listings.filter((item) =>
        item.location.toLowerCase().includes(searchLocation)
      )
    );
  }, [listings, searchLocation]);

  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Properties in {searchLocation ? `"${searchLocation}"` : 'All Locations'}
      </h1>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500 mb-1">{item.location}</p>
                <p className="text-green-700 font-bold">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-12">
          No listings found for "{searchLocation}"
        </p>
      )}
    </main>
  );
}
