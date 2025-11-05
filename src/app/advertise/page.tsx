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
    href: 'https://portalhomehub.com/register/select-country?type=fsbo',
    badge: 'Most Popular',
    description: 'Sell your property directly and save on commission fees',
    isPrimary: true,
    external: true
  },
  {
    title: 'List My Rental Property',
    subtitle: 'For landlords and property owners',
    image: '/images/list-my-rental.jpg',
    href: 'https://portalhomehub.com/register/select-country?type=landlord',
    badge: 'Flat Fee',
    description: 'Advertise your rental property to qualified tenants',
    isPrimary: true,
    external: true
  },
  {
    title: 'Join Our Premier Agent Network',
    subtitle: 'Exclusive agent opportunities',
    image: '/images/agent-list-property.jpg',
    href: 'https://portalhomehub.com/register/select-country?type=agent',
    badge: 'Up to 2 Months Free',
    description: 'Professional listing tools and lead generation',
    isPrimary: true,
    external: true
  },
  
  // Professional Services
  {
    title: 'I am an agent or broker',
    subtitle: 'Real estate professional services',
    image: '/images/agent-broker.jpg',
    href: '/coming-soon/agent-broker',
    description: 'Connect with buyers and sellers across Guyana'
  },
  {
    title: 'I am a property manager',
    subtitle: 'Property management services',
    image: '/images/property-manager.jpg',
    href: '/coming-soon/property-manager',
    description: 'Manage multiple properties and tenant relationships'
  },
  {
    title: 'I am a landlord',
    subtitle: 'Property rental services',
    image: '/images/landlord.jpg',
    href: '/coming-soon/landlord',
    description: 'Find reliable tenants for your properties'
  },
  {
    title: 'I am a lender or loan officer',
    subtitle: 'Financial services',
    image: '/images/loan-officer.jpg',
    href: '/coming-soon/lender',
    description: 'Offer mortgage and financing solutions'
  },
  {
    title: 'I am a builder',
    subtitle: 'Construction and development',
    image: '/images/builder.jpg',
    href: '/coming-soon/builder',
    description: 'Showcase new developments and projects'
  },
  {
    title: 'I am a local business',
    subtitle: 'Get listed for FREE',
    image: '/images/local-business.jpg',
    href: '/free-listing',
    badge: '100% FREE',
    description: 'Start with a FREE listing, upgrade for premium visibility',
    isPrimary: false
  },
];

// Paid Advertising Options
const advertisingOptions = [
  {
    title: 'Banner Advertising',
    subtitle: 'Premium display ads',
    image: '/images/local-business.jpg', // Using existing image
    href: '/contact?service=banner-advertising',
    price: 'From G$5,000/month',
    features: ['Prime website locations', 'Desktop & mobile optimized', 'Detailed analytics'],
    badge: 'Most Visible',
    isPremium: true
  },
  {
    title: 'Featured Listings',
    subtitle: 'Promote specific properties',
    image: '/images/list-my-home.jpg', // Using existing image
    href: '/contact?service=featured-listings',
    price: 'G$2,500 per property',
    features: ['Top of search results', '30-day promotion', 'Enhanced property details'],
    badge: 'High Conversion',
    isPremium: true
  },
  {
    title: 'Search Promotions',
    subtitle: 'Target specific searches',
    image: '/images/agent-broker.jpg', // Using existing image
    href: '/contact?service=search-promotions',
    price: 'G$25 per click',
    features: ['Targeted by location', 'Property type targeting', 'Pay per click model'],
    badge: 'Targeted',
    isPremium: true
  },
  {
    title: 'Newsletter Sponsorship',
    subtitle: 'Reach subscribers directly',
    image: '/images/loan-officer.jpg', // Using existing image
    href: '/contact?service=newsletter-sponsorship',
    price: 'G$15,000 per issue',
    features: ['10,000+ subscribers', 'Weekly newsletter', 'Brand recognition'],
    badge: 'Direct Reach',
    isPremium: true
  }
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

      {/* FREE Business Listing Hero */}
      <div className="mt-12 mb-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full text-sm font-bold mb-4">
              🎉 NEW: 100% FREE Business Listings
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start with a <span className="text-green-600">FREE</span> Business Directory Listing
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Get discovered by thousands of property seekers! List your business in our directory completely FREE. 
              Upgrade to premium options when you're ready for maximum visibility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/free-listing"
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg flex items-center space-x-2 shadow-lg"
              >
                <span>🆓</span>
                <span>Get FREE Listing Now</span>
              </Link>
              <Link 
                href="/business-directory"
                className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
              >
                <span>👀 See Directory Examples</span>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                No payment required
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Live within 24 hours
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Upgrade options available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paid Advertising Section */}
      <div className="mt-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-blue-700">
          Advertise Your Business
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Promote your real estate services to thousands of active property seekers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
          {advertisingOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
            >
              {option.badge && (
                <div className="bg-blue-600 text-white text-center py-2 font-semibold text-sm">
                  {option.badge}
                </div>
              )}
              <div className="relative w-full h-40">
                <Image
                  src={option.image}
                  alt={option.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1 text-gray-900">
                  {option.title}
                </h3>
                <p className="text-blue-600 font-medium mb-2 text-sm">
                  {option.subtitle}
                </p>
                <p className="text-green-600 font-bold mb-3 text-lg">
                  {option.price}
                </p>
                <ul className="text-gray-600 mb-4 text-xs space-y-1">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-green-500 mr-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={option.href}>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium text-sm">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Ready to Reach More Customers?</h3>
          <p className="mb-6 opacity-90">
            Join successful businesses already advertising on Guyana's premier real estate platform. 
            Over 50,000 monthly visitors looking for properties and services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?service=advertising-consultation">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
                Free Consultation
              </button>
            </Link>
            <Link href="tel:+592-762-9797">
              <button className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition">
                Call +592-762-9797
              </button>
            </Link>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16 bg-white rounded-lg p-8 max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8 text-gray-900">Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">350%</div>
              <div className="text-gray-600 text-sm">Increase in leads for Premier Realty after banner advertising campaign</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">2.5x</div>
              <div className="text-gray-600 text-sm">Faster property sales with featured listing promotions</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
              <div className="text-gray-600 text-sm">of advertisers renewed their campaigns within 3 months</div>
            </div>
          </div>
        </div>

        {/* Why Advertise With Us */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8 text-gray-900">Why Choose Guyana Home Hub?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Largest Audience</h4>
                <p className="text-gray-600 text-sm">Over 50,000 monthly visitors actively searching for properties and real estate services in Guyana.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Detailed Analytics</h4>
                <p className="text-gray-600 text-sm">Track impressions, clicks, and conversions with comprehensive reporting dashboard.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cost Effective</h4>
                <p className="text-gray-600 text-sm">Competitive pricing with flexible payment options and no hidden fees.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Local Expertise</h4>
                <p className="text-gray-600 text-sm">Deep understanding of the Guyana real estate market and customer behavior.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                {service.external ? (
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold">
                      Get Started
                    </button>
                  </a>
                ) : (
                  <Link href={service.href}>
                    <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold">
                      Get Started
                    </button>
                  </Link>
                )}
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
