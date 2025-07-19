"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroWithSearch from "../components/HeroWithSearch";
import BrowsePropertiesCards from "../components/BrowsePropertiesCards";
import ListYourPropertyCards from "../components/ListYourPropertyCards";

export default function HomePage() {
  const [showBrowseCards, setShowBrowseCards] = useState(false);
  const [showListCards, setShowListCards] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Super secret admin access: Ctrl + Shift + A
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        router.push('/admin-login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div>
      <HeroWithSearch />

      <main className="min-h-screen bg-white flex flex-col items-center justify-start pt-12 pb-24 px-4">
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setShowBrowseCards(true);
              setShowListCards(false);
            }}
            className="bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition"
          >
            Browse Properties
          </button>

          <button
            onClick={() => {
              setShowListCards(true);
              setShowBrowseCards(false);
            }}
            className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 hover:text-white transition"
          >
            List Your Property
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-gray-700 mb-12">
          <div>
            <h3 className="text-4xl font-bold text-green-700">500+</h3>
            <p className="text-lg">Properties Listed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-green-700">50+</h3>
            <p className="text-lg">Professional Agents</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-green-700">1000+</h3>
            <p className="text-lg">Happy Customers</p>
          </div>
        </div>

        {/* Featured Content - Only show when no cards are active */}
        {!showBrowseCards && !showListCards && (
          <div className="w-full max-w-6xl space-y-16">
            
            {/* Featured Properties Showcase */}
            <section className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Discover Beautiful Properties Across Guyana</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src="/images/hero-house-desktop.jpg" 
                    alt="Georgetown Villa"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800">Georgetown Luxury Homes</h3>
                    <p className="text-gray-600">Prime locations in the capital city</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src="/images/villa-beachfront.jpg" 
                    alt="Beachfront Property"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800">Coastal Properties</h3>
                    <p className="text-gray-600">Stunning beachfront and waterfront homes</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src="/images/land-berbice.jpg" 
                    alt="Development Land"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800">Investment Opportunities</h3>
                    <p className="text-gray-600">Prime land for development projects</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose Guyana Home Hub?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Verified Properties</h3>
                  <p className="text-gray-600">All listings verified by our professional team</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Expert Agents</h3>
                  <p className="text-gray-600">Licensed and vetted real estate professionals</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📍</span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Local Expertise</h3>
                  <p className="text-gray-600">Deep knowledge of Guyanese property markets</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💼</span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Full Service</h3>
                  <p className="text-gray-600">From browsing to closing, we're with you</p>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">What Our Clients Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-gray-600 italic mb-4">"Found my dream home in Georgetown through Guyana Home Hub. The agent was professional and the process was seamless!"</p>
                  <div className="font-semibold text-gray-800">- Sarah M., Georgetown</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-gray-600 italic mb-4">"As an investor, I appreciate the verified listings and professional service. Great platform for serious buyers."</p>
                  <div className="font-semibold text-gray-800">- David P., New Amsterdam</div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-green-700 text-white rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
              <p className="text-xl mb-6">Join thousands of satisfied customers who found their homes through Guyana Home Hub</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowBrowseCards(true);
                    setShowListCards(false);
                  }}
                  className="bg-white text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
                >
                  Start Browsing Now
                </button>
                <button
                  onClick={() => {
                    setShowListCards(true);
                    setShowBrowseCards(false);
                  }}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-700 transition"
                >
                  List Your Property
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Card Sections */}
        <section className="w-full max-w-6xl">
          {showBrowseCards && <BrowsePropertiesCards />}
          {showListCards && <ListYourPropertyCards />}
        </section>
      </main>
    </div>
  );
}
