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

        {/* Contact Section */}
        <section className="w-full max-w-4xl mt-16 bg-green-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Need Help? Get in Touch!
          </h2>
          <p className="text-gray-700 mb-6">
            Have questions about buying, selling, or renting property in Guyana? Our team is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+5927629797"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call +592 762 9797
            </a>
            <a
              href="https://wa.me/5927629797"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.101"/>
              </svg>
              WhatsApp Us (Faster)
            </a>
            <a
              href="mailto:info@guyanahomehub.com"
              className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            <strong>WhatsApp preferred for fastest response!</strong> Available during business hours.
          </p>
        </section>
      </main>
    </div>
  );
}
