'use client';

import React from 'react';
import Link from 'next/link';

export default function AdvertisePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="text-center py-12 px-4 md:px-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          List Your Property. Grow Your Business.
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Join Guyana's dedicated real estate platform
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <a
            href="#agents"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            For Agents
          </a>
          <a
            href="#property-owners"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            For Property Owners
          </a>
          <a
            href="#businesses"
            className="border-2 border-gray-800 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition"
          >
            For Businesses
          </a>
        </div>
      </section>

      {/* SECTION 2: AGENTS - GREEN THEME, MOST PROMINENT */}
      <section id="agents" className="bg-gradient-to-br from-green-600 to-green-700 py-16 px-4 md:px-16 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur text-white rounded-full text-sm font-bold mb-6">
            Only 25 Founding Agent Spots Available
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Premier Agent Network
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Reach local buyers and the Guyanese diaspora worldwide
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-xl">📋</span>
              <span>List up to 25 properties</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-xl">💰</span>
              <span>20% lifetime discount</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-xl">🎬</span>
              <span>Video uploads enabled</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-xl">🔝</span>
              <span>Priority placement in search</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-xl">📊</span>
              <span>Professional agent dashboard</span>
            </div>
          </div>

          <a
            href="https://www.portalhomehub.com/register?code=FOUNDING-AGENT-GY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-green-700 px-10 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition shadow-lg"
          >
            Become a Founding Agent
          </a>

          <p className="text-green-200 text-sm mt-4">
            Limited spots remaining &bull; Use code <span className="font-mono font-bold text-white">FOUNDING-AGENT-GY</span>
          </p>
        </div>
      </section>

      {/* SECTION 3: PROPERTY OWNERS */}
      <section id="property-owners" className="py-16 px-4 md:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
            List Your Property
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Choose the option that fits your needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FSBO Card */}
            <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200 hover:border-green-400 transition relative">
              <div className="absolute -top-3 left-6 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-2">Selling Your Home</h3>
              <p className="text-green-600 font-medium mb-4">For Sale By Owner</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                From G$20,592
              </p>
              <p className="text-gray-600 mb-6">
                Sell without paying agent commission
              </p>
              <a
                href="https://www.portalhomehub.com/register/fsbo"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                List Your Property
              </a>
            </div>

            {/* Landlord Card */}
            <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200 hover:border-blue-400 transition relative">
              <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Flat Fee
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-2">Listing a Rental</h3>
              <p className="text-blue-600 font-medium mb-4">For Landlords</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                From G$10,400
              </p>
              <p className="text-gray-600 mb-6">
                Find quality tenants fast
              </p>
              <a
                href="https://www.portalhomehub.com/register/landlord"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                List Your Rental
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: BUSINESSES */}
      <section id="businesses" className="py-16 px-4 md:px-16 bg-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            List Your Business
          </h2>
          <p className="text-gray-600 mb-6">
            Connect with property seekers looking for contractors, builders, and home services
          </p>
          <p className="text-gray-500 mb-8">
            Get discovered by homeowners and investors searching for trusted local professionals.
          </p>
          <Link
            href="/business-directory/list-your-business"
            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            List Your Business - Free
          </Link>
        </div>
      </section>

      {/* SECTION 5: PROFESSIONAL SERVICES */}
      <section className="py-16 px-4 md:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
            Boost Your Listing
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Professional marketing services to help your property stand out
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-semibold text-gray-900 mb-1">Property Photography</h3>
              <p className="text-green-600 font-bold">G$20,000</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <div className="text-3xl mb-3">🚁</div>
              <h3 className="font-semibold text-gray-900 mb-1">Drone Photography</h3>
              <p className="text-green-600 font-bold">G$25,000</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="font-semibold text-gray-900 mb-1">3D Virtual Tours</h3>
              <p className="text-green-600 font-bold">G$35,000</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="font-semibold text-gray-900 mb-1">Lockbox Installation</h3>
              <p className="text-green-600 font-bold">G$15,000</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-900">
              <span className="font-bold">Complete Package:</span>{' '}
              <span className="text-green-700 font-bold text-xl">G$75,000</span>{' '}
              <span className="text-gray-600">(Save G$20,000)</span>
            </p>
          </div>

          <div className="text-center">
            <a
              href="https://www.portalhomehub.com/services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              View All Services
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY GUYANA HOME HUB */}
      <section className="py-12 px-4 md:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-8">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-12 h-8 mx-auto mb-3 rounded overflow-hidden shadow-sm" style={{
                background: 'linear-gradient(90deg, #009E49 0%, #009E49 100%)',
                position: 'relative'
              }}>
                {/* Guyana flag golden arrow */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 0,
                  height: 0,
                  borderTop: '16px solid transparent',
                  borderBottom: '16px solid transparent',
                  borderLeft: '24px solid #FFD100'
                }} />
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '25%',
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderLeft: '12px solid #CE1126'
                }} />
              </div>
              <p className="font-medium text-gray-800">Local Expertise</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🌍</div>
              <p className="font-medium text-gray-800">Diaspora Reach</p>
            </div>
            <div>
              <div className="text-4xl mb-2">✨</div>
              <p className="font-medium text-gray-800">Easy to Use</p>
            </div>
            <div>
              <div className="text-4xl mb-2">📈</div>
              <p className="font-medium text-gray-800">Growing Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CONTACT CTA */}
      <section className="py-16 px-4 md:px-16 bg-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Questions? Let's Talk
          </h2>
          <p className="text-gray-300 mb-8">
            We're here to help you get started
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
            <a
              href="tel:+5927629797"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition"
            >
              Call +592-762-9797
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
