import Link from 'next/link';
import { ArrowLeft, Building2, Hammer, Clock, Star, Phone, Mail } from 'lucide-react';

export default function NewConstructionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-green-200 hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              New Construction Properties
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Discover brand new homes and developments across Guyana. Be the first to live in these modern, well-designed properties.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12 text-center">
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">New Construction Listings Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're currently partnering with developers and builders across Guyana to bring you the latest new construction properties. 
            Check back soon for exciting new developments!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/list-owner" 
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              List Your Development
            </Link>
            <Link 
              href="/contact" 
              className="border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Notified
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Benefits of New Construction */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose New Construction?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Star className="h-8 w-8 text-yellow-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Features</h3>
                    <p className="text-gray-600">
                      Latest design trends, energy-efficient appliances, and modern building materials.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Hammer className="h-8 w-8 text-orange-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Customization Options</h3>
                    <p className="text-gray-600">
                      Many builders offer options to customize finishes, layouts, and features to your preferences.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Building2 className="h-8 w-8 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Warranty Protection</h3>
                    <p className="text-gray-600">
                      New homes typically come with builder warranties covering major systems and components.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-8 w-8 text-green-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Move-in Ready</h3>
                    <p className="text-gray-600">
                      No need for immediate repairs or renovations - everything is brand new and ready to go.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Types of New Construction */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of New Construction</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Single Family Homes</h3>
                  <p className="text-gray-600">
                    Brand new standalone houses in established and new neighborhoods across Guyana's regions.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Townhouses & Condos</h3>
                  <p className="text-gray-600">
                    Modern multi-unit developments offering community amenities and maintenance-free living.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Planned Communities</h3>
                  <p className="text-gray-600">
                    Entire neighborhoods with shared amenities, parks, and community centers.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Builds</h3>
                  <p className="text-gray-600">
                    Work directly with builders to create your dream home from the ground up.
                  </p>
                </div>
              </div>
            </div>

            {/* Builder Information */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">For Builders & Developers</h2>
              <p className="text-gray-600 mb-6">
                Are you a builder or developer with new construction properties? Partner with Guyana Home Hub 
                to showcase your developments to thousands of potential buyers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/list-owner" 
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  List Your Development
                </Link>
                <Link 
                  href="/contact" 
                  className="border border-green-600 text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-colors text-center"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Notified</h3>
              <p className="text-gray-600 mb-6">
                Be the first to know about new construction properties in your area of interest.
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Region
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Georgetown</option>
                    <option>New Amsterdam</option>
                    <option>Linden</option>
                    <option>Anna Regina</option>
                    <option>Other</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Notify Me
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a href="mailto:info@guyanahomehub.com" className="text-green-600 hover:text-green-800">
                    info@guyanahomehub.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Coming Soon</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/properties" className="text-green-600 hover:text-green-800 text-sm">
                      Browse All Properties
                    </Link>
                  </li>
                  <li>
                    <Link href="/fsbo" className="text-green-600 hover:text-green-800 text-sm">
                      For Sale By Owner
                    </Link>
                  </li>
                  <li>
                    <Link href="/commercial" className="text-green-600 hover:text-green-800 text-sm">
                      Commercial Properties
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
