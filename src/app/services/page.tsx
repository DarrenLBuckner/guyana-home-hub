import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Professional Real Estate Services in Guyana | Drone Photography, Virtual Tours & More',
  description: 'Looking for professional real estate services in Guyana? Get expert drone photography, property photography, 3D virtual tours, and complete marketing packages for your property listings.',
  keywords: 'real estate services Guyana, drone photography Guyana, property photography Georgetown, 3D virtual tours Guyana, professional property marketing, real estate agents Guyana, property listing services'
};

/**
 * SEO-Optimized Services Landing Page
 * Funnels visitors to Portal Home Hub for professional services
 */
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Real Estate Services in Guyana
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8">
            Transform your property listings with professional photography, drone shots, and virtual tours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://portalhomehub.com/services"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              View Professional Services →
            </a>
            <Link
              href="/advertise#agents"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Join as Real Estate Professional
            </Link>
          </div>
        </div>
      </div>

      {/* Services Overview - SEO Content */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Elevate Your Guyana Property Listings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional real estate services designed to make your properties stand out in the competitive Guyana market. 
              From Georgetown to New Amsterdam, we help agents, landlords, and property owners showcase their listings professionally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Drone Photography</h3>
              <p className="text-gray-600">Stunning aerial shots of your Guyana properties that capture the full scope and beauty of the location.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Photography</h3>
              <p className="text-gray-600">Professional interior and exterior photography that highlights your property's best features and attracts buyers.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3D Virtual Tours</h3>
              <p className="text-gray-600">Interactive virtual tours that let potential buyers explore your property remotely, perfect for international clients.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Packages</h3>
              <p className="text-gray-600">Comprehensive marketing packages that include photography, tours, and professional listing optimization.</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <a
              href="https://portalhomehub.com/services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
            >
              Get Professional Services
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* For Real Estate Professionals Section */}
      <div className="py-16 bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Are You a Real Estate Professional in Guyana?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join Portal Home Hub - the professional platform for agents, landlords, and property managers across Guyana. 
              Manage your listings, access professional services, and grow your real estate business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🏢 Real Estate Agents</h3>
              <p className="text-gray-600 mb-4">Professional platform for managing clients, listings, and accessing marketing services.</p>
              <Link
                href="/advertise#agents"
                className="text-green-600 font-medium hover:text-green-700"
              >
                Join as Agent →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🏠 Landlords</h3>
              <p className="text-gray-600 mb-4">Manage rental properties, screen tenants, and access professional photography services.</p>
              <Link
                href="/advertise#property-owners"
                className="text-green-600 font-medium hover:text-green-700"
              >
                Join as Landlord →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🔑 Property Owners</h3>
              <p className="text-gray-600 mb-4">For Sale By Owner tools, professional services, and direct buyer connections.</p>
              <Link
                href="/advertise#property-owners"
                className="text-green-600 font-medium hover:text-green-700"
              >
                Join as Owner →
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/advertise"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              View All Listing Options
              <span className="ml-2">🚀</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Local SEO Content */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Real Estate Services Across Guyana
            </h2>
            <p className="text-lg text-gray-600">
              Whether you're in Georgetown, New Amsterdam, Linden, or anywhere across Guyana, 
              our professional real estate services help you market properties effectively to local and international buyers.
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <h3>Why Professional Real Estate Services Matter in Guyana</h3>
            <p>
              The Guyana real estate market is growing rapidly, with increased international interest and local development. 
              To stand out in this competitive market, professional presentation is essential. High-quality photography, 
              drone shots, and virtual tours help potential buyers envision themselves in the property, whether they're 
              local residents or international investors.
            </p>

            <h3>Serving Real Estate Professionals Nationwide</h3>
            <p>
              Our network of professional real estate service providers works with agents, landlords, and property owners 
              throughout Guyana. From coastal properties in Georgetown to inland developments in Linden, we provide 
              consistent, high-quality marketing services that help your listings attract serious buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-green-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Property Listings?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of real estate professionals using Portal Home Hub for their marketing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://portalhomehub.com/services"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              View Services & Pricing
            </a>
            <Link
              href="/advertise"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Start Your Professional Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}