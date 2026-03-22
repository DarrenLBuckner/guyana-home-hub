"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Users, MapPin, Briefcase, Globe, ShieldCheck, Gift, Building2, BookOpen, Shield, TrendingUp, ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import BrowsePropertiesCards from "../components/BrowsePropertiesCards";
import ListYourPropertyCards from "../components/ListYourPropertyCards";
import FeaturedProperties from "../components/FeaturedProperties";
import FeaturedCommercialProperties from "../components/FeaturedCommercialProperties";
import { useCountryTheme } from "@/components/CountryThemeProvider";
import { useFragmentFix } from "@/hooks/useFragmentFix";
// import TajPartnerBanner from "@/components/ads/TajPartnerBanner";

export default function HomePageClient() {
  const [showBrowseCards, setShowBrowseCards] = useState(false);
  const [showListCards, setShowListCards] = useState(false);
  const router = useRouter();
  const { theme, country } = useCountryTheme();

  // Fix Google search fragment navigation issues
  useFragmentFix();

  // Dynamic country values for authentic branding
  const countryName = country === 'JM' ? 'Jamaica' : country === 'CO' ? 'Colombia' : 'Guyana';
  const countryAdjective = country === 'JM' ? 'Jamaican' : country === 'CO' ? 'Colombian' : 'Guyanese';

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
      <Hero site={country === 'JM' ? 'jamaica' : country === 'CO' ? 'colombia' : 'guyana'} />

      {/* TAJ Developer Partner Banner - hold for approval */}
      {/* <TajPartnerBanner /> */}

      {/* Property Browsing Buttons - Below Hero */}
      <section className="w-full bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">

          {/* Main Action Buttons - Side by Side */}
          <div className="flex flex-row gap-3 justify-center mb-6">

            {/* Browse For Sale Button */}
            <button
              onClick={() => router.push('/properties/buy')}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-200 hover:scale-105 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              For Sale
            </button>

            {/* Browse For Rent Button */}
            <button
              onClick={() => router.push('/properties/rent')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-600 font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-200 hover:scale-105 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
              </svg>
              For Rent
            </button>
          </div>

          {/* Secondary CTA - List Property */}
          <div className="flex justify-center mt-2">
            <a href="/advertise" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
              Own a property? List it free →
            </a>
          </div>
        </div>
      </section>

      {/* Agent CTA Banner - Prominent call-to-action for real estate agents */}
      <section className="w-full bg-emerald-600 py-3">
        <div className="max-w-4xl mx-auto px-4 flex flex-row items-center justify-center gap-3 flex-wrap">
          <p className="text-white text-sm font-medium whitespace-nowrap">
            Are you an agent?
          </p>
          <a
            href="/advertise#agents"
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white text-emerald-700 font-semibold text-sm py-1.5 px-4 rounded-full hover:bg-emerald-50 transition-colors"
          >
            Register Free →
          </a>
        </div>
      </section>

      <main className="min-h-screen bg-white flex flex-col items-center justify-start pt-12 pb-24 px-4">

        {/* Featured Content - Only show when no cards are active */}
        {!showBrowseCards && !showListCards && (
          <div className="w-full max-w-6xl space-y-16">

            {/* Featured Properties Showcase - Live from database */}
            <FeaturedProperties countryName={countryName} />

            {/* Browse All Residential Properties Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => router.push('/properties')}
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                Browse All Residential Properties
              </button>
            </div>

            {/* Featured Commercial Properties Showcase - Live from database */}
            <FeaturedCommercialProperties countryName={countryName} />

            {/* ==================== RESOURCES FOR BUYERS ==================== */}
            <section className="bg-gray-50 rounded-2xl py-14 px-6 sm:px-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">Resources for Buyers &amp; Investors</h2>
              <p className="text-center text-gray-500 mb-10 max-w-lg mx-auto text-sm">Expert guides to help you navigate Guyana&apos;s property market with confidence.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: BookOpen,
                    title: "Buying Property from Abroad",
                    description: "Everything diaspora buyers need to know about purchasing property safely and legally.",
                    slug: "buying-from-abroad",
                  },
                  {
                    icon: Shield,
                    title: "How to Avoid Property Scams",
                    description: "Red flags, verification steps, and safety tips to protect your investment.",
                    slug: "avoid-property-scams",
                  },
                  {
                    icon: TrendingUp,
                    title: "Real Estate Investment Guide",
                    description: "Why Guyana real estate is one of the best opportunities for diaspora investors.",
                    slug: "investment-guide",
                  },
                ].map((guide) => (
                  <a
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <guide.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{guide.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{guide.description}</p>
                    <span className="text-sm font-medium text-green-600 group-hover:text-green-700 inline-flex items-center gap-1 transition-colors">
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                ))}
              </div>
              <div className="text-center mt-8">
                <a href="/guides" className="text-sm font-medium text-green-600 hover:text-green-700 inline-flex items-center gap-1 transition-colors">
                  Browse All Guides <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>

            {/* ==================== LATEST FROM THE BLOG ==================== */}
            <section className="py-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">Latest from the Blog</h2>
              <p className="text-center text-gray-500 mb-10 max-w-lg mx-auto text-sm">Market insights, buyer stories, and expert analysis.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "The Real Estate Chaos Costing Diaspora Buyers Millions",
                    excerpt: "The exposed underbelly of Guyana\u2019s emerging real estate market \u2014 and what diaspora buyers can do to protect themselves.",
                    slug: "real-estate-chaos-costing-millions",
                    category: "Diaspora Buyers",
                  },
                  {
                    title: "Top 5 Mistakes Diaspora Buyers Make",
                    excerpt: "Learn from the common pitfalls that overseas Guyanese buyers encounter and how to avoid them.",
                    slug: "diaspora-buyer-mistakes",
                    category: "Diaspora Tips",
                  },
                ].map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
                  >
                    <span className="inline-block text-xs font-semibold uppercase tracking-wide text-green-600 mb-3">{post.category}</span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{post.excerpt}</p>
                    <span className="text-sm font-medium text-green-600 group-hover:text-green-700 inline-flex items-center gap-1 transition-colors">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                ))}
              </div>
              <div className="text-center mt-8">
                <a href="/blog" className="text-sm font-medium text-green-600 hover:text-green-700 inline-flex items-center gap-1 transition-colors">
                  Read All Articles <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose {theme.name}?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-8 h-8 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Verified Properties</h3>
                  <p className="text-gray-600">All listings verified by our professional team</p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Expert Agents</h3>
                  <p className="text-gray-600">Licensed and vetted real estate professionals</p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Local Expertise</h3>
                  <p className="text-gray-600">
                    {country === 'JM'
                      ? 'Born and raised agents who understand Jamaican communities'
                      : 'Deep knowledge of Guyanese property markets and local neighborhoods'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Full Service</h3>
                  <p className="text-gray-600">From browsing to closing, we're with you</p>
                </div>
              </div>
            </section>

            {/* For Real Estate Agents Section */}
            <section id="agents" className="bg-blue-50 rounded-lg p-8 scroll-mt-20">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">For Real Estate Agents</h2>
              <p className="text-center text-gray-600 mb-8">Your listings. Diaspora buyers.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-blue-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Reach Buyers Abroad</h3>
                  <p className="text-gray-600">Your listings seen by {countryAdjective} in New York, Toronto, and London actively looking to invest back home.</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-blue-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Professional Platform</h3>
                  <p className="text-gray-600">No more Facebook chaos. A real platform that makes you look professional.</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-blue-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Free During Launch</h3>
                  <p className="text-gray-600">List unlimited properties at no cost while we build the marketplace together.</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">US-Based Company</h3>
                  <p className="text-gray-600">Caribbean Home Hub LLC. Real company. Real support. Not another fly-by-night website.</p>
                </div>
              </div>

              {/* Agent CTA Button */}
              <div className="text-center mt-8">
                <a
                  href="/advertise#agents"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-base"
                >
                  Register as an Agent
                </a>
              </div>
            </section>

            {/* Be Part of Something New */}
            <section className="bg-slate-900 text-white rounded-xl p-8 md:p-12 text-center">
              <p className="text-lg md:text-xl text-slate-300 mb-3">Tired of scrolling through Facebook for property listings?</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">We're building a better way.</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
                Real listings. Verified agents. One platform for {countryName} property.
              </p>
            </section>

            {/* Call to Action */}
            <section className="bg-green-700 text-white rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
              <p className="text-xl mb-6">Join {countryName}'s newest professional property platform</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/properties')}
                  className="bg-white text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
                >
                  Start Browsing Now
                </button>
                <a
                  href="/advertise"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-700 transition"
                >
                  List Your Property
                </a>
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
        <section
          className="w-full max-w-4xl mt-16 rounded-xl p-8 text-center"
          style={{ backgroundColor: `${theme.colors.primary}10` }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>
            Need Help? Get in Touch!
          </h2>
          <p className="text-gray-700 mb-6">
            Have questions about buying, selling, or renting property in {countryName}? Our team is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+5927629797"
              className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
              style={{ backgroundColor: theme.colors.primary }}
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
              className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
              style={{ backgroundColor: theme.colors.secondary }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.101"/>
              </svg>
              WhatsApp Us (Faster)
            </a>
            <a
              href="mailto:info@guyanahomehub.com"
              className="border-2 px-6 py-3 rounded-lg font-semibold hover:text-white transition flex items-center gap-2"
              style={{
                borderColor: theme.colors.primary,
                color: theme.colors.primary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
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
