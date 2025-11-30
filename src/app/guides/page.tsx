import type { Metadata } from 'next';
import Link from 'next/link';
import { getCountryFromHeaders } from '@/lib/country-detection';

export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  
  return {
    title: `Property Guides - ${siteName}`,
    description: `Complete guides for buying property in ${countryName}. Expert advice for diaspora buyers, locals, and investors. Avoid scams, understand the process, and make informed decisions.`,
    keywords: `${countryName} property guides, buying property ${countryName}, diaspora property investment, ${countryName} real estate guides, property buying advice`,
    openGraph: {
      title: `Property Guides - ${siteName}`,
      description: `Complete guides for buying property in ${countryName}. Expert advice for diaspora buyers, locals, and investors.`,
      type: 'website',
    },
  };
}

// Guide data structure
const guides = [
  {
    slug: 'buying-from-abroad',
    title: 'The Complete Guide to Buying Property in Guyana from Abroad',
    description: 'Everything diaspora buyers need to know about purchasing property in Guyana safely and legally from overseas.',
    readTime: '15 min read',
    category: 'Diaspora',
    priority: 1,
    comingSoon: false
  },
  {
    slug: 'avoid-property-scams',
    title: 'How to Avoid Property Scams in Guyana',
    description: 'Protect yourself from fraud and scams when buying property. Red flags, verification steps, and safety tips.',
    readTime: '10 min read',
    category: 'Safety',
    priority: 2,
    comingSoon: false
  },
  {
    slug: 'investment-guide',
    title: 'Guyana Real Estate Investment Guide for the Diaspora',
    description: 'Investment strategies, market analysis, and ROI considerations for overseas property investors.',
    readTime: '12 min read',
    category: 'Investment',
    priority: 3,
    comingSoon: false
  },
  {
    slug: 'buying-locally',
    title: 'Buying Property in Guyana — A Guide for Locals',
    description: 'Complete guide for Guyanese residents looking to purchase their first home or investment property.',
    readTime: '8 min read',
    category: 'Local Buyers',
    priority: 4,
    comingSoon: false
  },
  {
    slug: 'property-titles-explained',
    title: 'Understanding Property Titles in Guyana',
    description: 'Transport vs. Certificate of Title explained. What each document means and why it matters.',
    readTime: '6 min read',
    category: 'Legal',
    priority: 5,
    comingSoon: false
  }
];

export default async function GuidesPage() {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Guide to {countryName} Real Estate
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Everything you need to know about buying property in {countryName} — whether you're abroad or local
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties/buy"
                className="inline-flex items-center bg-white text-green-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                🏠 Browse Properties
              </Link>
              <Link
                href="#guides"
                className="inline-flex items-center border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-green-700 transition-all duration-200"
              >
                📚 Read Guides
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why These Guides Matter</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Stay Protected</h3>
              <p className="text-gray-600">Learn to identify and avoid property scams that target diaspora buyers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Understand the Process</h3>
              <p className="text-gray-600">Navigate {countryName}'s legal requirements and property buying procedures.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Make Smart Investments</h3>
              <p className="text-gray-600">Get expert insights on market trends and investment strategies.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div id="guides" className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Property Guides</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <div key={guide.slug} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {guide.category}
                  </span>
                  <span className="text-sm text-gray-500">{guide.readTime}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {guide.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {guide.description}
                </p>
                
                <div className="flex items-center justify-between">
                  {guide.comingSoon ? (
                    <span className="inline-flex items-center text-gray-500 font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Coming Soon
                    </span>
                  ) : (
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Read Guide
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Property Search?</h2>
          <p className="text-xl mb-8 opacity-90">
            Browse verified properties from trusted agents and verified owners
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties/buy"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              Properties for Sale
            </Link>
            <Link
              href="/properties/rent"
              className="inline-flex items-center border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              Properties for Rent
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-lg mb-4">Need personalized assistance?</p>
            <a 
              href="https://wa.me/5927629797?text=Hi%20Guyana%20Home%20Hub!%20I%20read%20your%20property%20guides%20and%20need%20help%20with%20buying%20property%20in%20Guyana." 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Get Expert Assistance
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}