'use client';

import React from 'react';
import Image from 'next/image';

const industries = [
  {
    title: 'I’m an agent or broker',
    image: '/images/agent-broker.jpg',
  },
  {
    title: 'I’m a property manager',
    image: '/images/property-manager.jpg',
  },
  {
    title: 'I’m a landlord',
    image: '/images/landlord.jpg',
  },
  {
    title: 'I’m a lender or loan officer',
    image: '/images/loan-officer.jpg',
  },
  {
    title: 'I’m a builder',
    image: '/images/builder.jpg',
  },
  {
    title: 'I’m a local business',
    image: '/images/local-business.jpg',
  },
];

export default function AdvertisePage() {
  return (
    <div className="px-4 md:px-16 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
        Partner with Guyana Home Hub to Grow Your Business
      </h1>
      <p className="text-center text-gray-700 mt-4 max-w-3xl mx-auto">
        Reach Guyanese locals and diaspora — buyers, sellers, and renters — on the only real estate network of its kind in Guyana.
      </p>

      <h2 className="text-xl md:text-2xl font-semibold text-center mt-12 mb-6 text-gray-800">
        Select your industry to get started
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map(({ title, image }, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col"
          >
            <div className="relative w-full h-48">
              <Image
                src={image}
                alt={title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4 flex flex-col justify-between flex-1">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                {title}
              </h3>
              <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition w-full mt-auto">
                Get started
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
