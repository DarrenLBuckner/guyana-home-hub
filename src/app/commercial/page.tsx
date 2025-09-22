import Link from 'next/link';
import { ArrowLeft, Building, MapPin, DollarSign, TrendingUp, Phone, Mail } from 'lucide-react';

export default function CommercialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-purple-200 hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Commercial Property For Sale
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Discover prime commercial real estate opportunities across Guyana. From retail spaces to office buildings and industrial properties.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12 text-center">
          <Building className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commercial Listings Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're building partnerships with commercial property owners and brokers to bring you the best 
            commercial real estate opportunities in Guyana. Check back soon!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/list-owner" 
              className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              List Commercial Property
            </Link>
            <Link 
              href="/contact" 
              className="border border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Get Updates
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Property Types */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Commercial Property Types</h2>
              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <Building className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Office Buildings</h3>
                  <p className="text-gray-600">
                    Professional office spaces in prime business districts across Georgetown and other major cities.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <MapPin className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Retail Spaces</h3>
                  <p className="text-gray-600">
                    Storefronts, shopping centers, and standalone retail buildings in high-traffic areas.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Industrial</h3>
                  <p className="text-gray-600">
                    Warehouses, manufacturing facilities, and distribution centers for businesses of all sizes.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <DollarSign className="h-8 w-8 text-orange-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mixed-Use</h3>
                  <p className="text-gray-600">
                    Properties combining residential, retail, and office spaces for diverse investment opportunities.
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Benefits */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Invest in Commercial Real Estate?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-3 mr-4 mt-1">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Higher Income Potential</h3>
                    <p className="text-gray-600">
                      Commercial properties typically generate higher rental yields compared to residential properties.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4 mt-1">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Long-term Leases</h3>
                    <p className="text-gray-600">
                      Commercial tenants often sign longer lease agreements, providing stable income streams.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-3 mr-4 mt-1">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Appreciation Potential</h3>
                    <p className="text-gray-600">
                      Well-located commercial properties can appreciate significantly over time.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-orange-100 rounded-full p-3 mr-4 mt-1">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Relationships</h3>
                    <p className="text-gray-600">
                      Building relationships with business tenants can lead to additional opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Areas */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Prime Commercial Areas in Guyana</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Greater Georgetown</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Central Business District</li>
                    <li>• Water Street Commercial Area</li>
                    <li>• Sheriff Street</li>
                    <li>• Camp Street</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Regional Centers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• New Amsterdam</li>
                    <li>• Linden</li>
                    <li>• Anna Regina</li>
                    <li>• Parika</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">List Your Commercial Property</h3>
              <p className="text-gray-600 mb-6">
                Reach serious investors and business owners looking for commercial real estate opportunities.
              </p>
              <Link 
                href="/list-owner" 
                className="block w-full bg-purple-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors mb-4"
              >
                List Property
              </Link>
              <Link 
                href="/contact" 
                className="block w-full border border-purple-600 text-purple-600 text-center py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Learn More
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Consultation</h3>
              <p className="text-gray-600 mb-4">
                Interested in commercial real estate investment? Get expert guidance on market opportunities.
              </p>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Property Type Interest</option>
                  <option>Office Buildings</option>
                  <option>Retail Spaces</option>
                  <option>Industrial</option>
                  <option>Mixed-Use</option>
                </select>
                <button 
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Request Consultation
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a href="mailto:info@guyanahomehub.com" className="text-purple-600 hover:text-purple-800">
                    info@guyanahomehub.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Phone Coming Soon</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Related Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/properties" className="text-purple-600 hover:text-purple-800 text-sm">
                      All Properties
                    </Link>
                  </li>
                  <li>
                    <Link href="/fsbo" className="text-purple-600 hover:text-purple-800 text-sm">
                      For Sale By Owner
                    </Link>
                  </li>
                  <li>
                    <Link href="/new-construction" className="text-purple-600 hover:text-purple-800 text-sm">
                      New Construction
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
