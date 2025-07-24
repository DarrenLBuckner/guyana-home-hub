'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const industries = [
  // Property Listing Services - Revenue Generators (Top Priority)
  {
    title: 'For Sale by Owner (FSBO)',
    subtitle: 'List your home without an agent',
    image: '/images/list-my-home.jpg',
    href: '/list-owner',
    badge: 'Most Popular',
    description: 'Sell your property directly and save on commission fees',
    isPrimary: true
  },
  {
    title: 'List My Rental Property',
    subtitle: 'For landlords and property owners',
    image: '/images/list-my-rental.jpg',
    href: '/list-rental',
    badge: 'Flat Fee',
    description: 'Advertise your rental property to qualified tenants',
    isPrimary: true
  },
  {
    title: 'Join Our Premier Agent Network',
    subtitle: 'Exclusive agent opportunities',
    image: '/images/agent-list-property.jpg',
    href: '/list-agent',
    badge: 'Free 6 Months',
    description: 'Professional listing tools and lead generation',
    isPrimary: true
  },
  
  // Professional Services
  {
    title: 'I am an agent or broker',
    subtitle: 'Real estate professional services',
    image: '/images/agent-broker.jpg',
    href: '/agent-register',
    description: 'Connect with buyers and sellers across Guyana'
  },
  {
    title: 'I am a property manager',
    subtitle: 'Property management services',
    image: '/images/property-manager.jpg',
    href: '/contact',
    description: 'Manage multiple properties and tenant relationships'
  },
  {
    title: 'I am a landlord',
    subtitle: 'Property rental services',
    image: '/images/landlord.jpg',
    href: '/list-rental',
    description: 'Find reliable tenants for your properties'
  },
  {
    title: 'I am a lender or loan officer',
    subtitle: 'Financial services',
    image: '/images/loan-officer.jpg',
    href: '/contact',
    description: 'Offer mortgage and financing solutions'
  },
  {
    title: 'I am a builder',
    subtitle: 'Construction and development',
    image: '/images/builder.jpg',
    href: '/contact',
    description: 'Showcase new developments and projects'
  },
  {
    title: 'I am a local business',
    subtitle: 'Real estate related services',
    image: '/images/local-business.jpg',
    href: '/contact',
    description: 'Partner with Guyana premier real estate platform'
  },
];

export default function AdvertisePage() {
  const primaryServices = industries.filter(service => service.isPrimary);
  const professionalServices = industries.filter(service => !service.isPrimary);

  return (
    <div className="px-4 md:px-16 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
        List Your Property & Grow Your Business
      </h1>
      <p className="text-center text-gray-700 mt-4 max-w-3xl mx-auto">
        Reach Guyanese locals and diaspora — buyers, sellers, and renters — on the only real estate network of its kind in Guyana.
      </p>

      {/* Primary Listing Services */}
      <div className="mt-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-green-700">
          List Your Property
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Choose the best option for your property listing needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {primaryServices.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-green-100 hover:border-green-300 transition-all duration-300 transform hover:scale-105"
            >
              {service.badge && (
                <div className="bg-green-600 text-white text-center py-2 font-semibold text-sm">
                  {service.badge}
                </div>
              )}
              <div className="relative w-full h-48">
                <Image
                  src={service.image}
                  alt={service.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  {service.subtitle}
                </p>
                <p className="text-gray-600 mb-4 text-sm">
                  {service.description}
                </p>
                <Link href={service.href}>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Services */}
      <div className="mt-16">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-800">
          Professional Services & Partnerships
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionalServices.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-40">
                <Image
                  src={service.image}
                  alt={service.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {service.description}
                </p>
                <Link href={service.href}>
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
