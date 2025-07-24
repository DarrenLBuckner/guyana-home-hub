import Link from 'next/link';
import { ArrowLeft, TrendingUp, BarChart3, Calendar, MapPin, DollarSign, Phone, Mail } from 'lucide-react';

export default function RecentSalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-indigo-200 hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Recent Home Sales
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Stay informed about the latest property sales in your area. Track market trends and compare prices to make informed decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12 text-center">
          <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sales Data Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're compiling comprehensive sales data from across Guyana to provide you with the most 
            accurate market insights. Check back soon for detailed sales reports and market analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/properties" 
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse Current Listings
            </Link>
            <Link 
              href="/contact" 
              className="border border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Get Market Updates
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* What You'll Find */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Recent Sales Data Includes</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <DollarSign className="h-8 w-8 text-green-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sale Prices</h3>
                    <p className="text-gray-600">
                      Actual sale prices of recently sold properties to help you understand current market values.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-8 w-8 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sale Dates</h3>
                    <p className="text-gray-600">
                      When properties were sold to identify recent market activity and trends over time.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-8 w-8 text-purple-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Locations</h3>
                    <p className="text-gray-600">
                      Property locations to help you understand neighborhood-specific market conditions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <TrendingUp className="h-8 w-8 text-orange-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Trends</h3>
                    <p className="text-gray-600">
                      Analysis of price trends, time on market, and other key market indicators.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Use Sales Data */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Use Recent Sales Data</h2>
              <div className="space-y-6">
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">For Buyers</h3>
                  <p className="text-gray-600 mb-3">
                    Use recent sales data to:
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Determine fair market value for properties you're considering</li>
                    <li>• Make informed offers based on recent comparable sales</li>
                    <li>• Understand price trends in your preferred neighborhoods</li>
                    <li>• Negotiate with confidence using market data</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">For Sellers</h3>
                  <p className="text-gray-600 mb-3">
                    Use recent sales data to:
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Price your property competitively</li>
                    <li>• Understand what buyers are paying in your area</li>
                    <li>• Time your sale to market conditions</li>
                    <li>• Set realistic expectations for your sale</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">For Investors</h3>
                  <p className="text-gray-600 mb-3">
                    Use recent sales data to:
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Identify emerging market opportunities</li>
                    <li>• Analyze rental yield potential</li>
                    <li>• Track appreciation rates in different areas</li>
                    <li>• Make data-driven investment decisions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Market Regions */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Market Coverage Areas</h2>
              <p className="text-gray-600 mb-6">
                Our sales data will cover all major regions across Guyana, providing comprehensive 
                market insights for both urban and rural areas.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Urban Centers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                      Greater Georgetown Area
                    </li>
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                      New Amsterdam
                    </li>
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                      Linden
                    </li>
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                      Anna Regina
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Regional Areas</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                      East Coast Demerara
                    </li>
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                      West Coast Demerara
                    </li>
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                      Berbice Region
                    </li>
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                      Essequibo Region
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Report Alerts</h3>
              <p className="text-gray-600 mb-6">
                Get notified when new market reports and sales data become available for your area.
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area of Interest
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>Georgetown</option>
                    <option>New Amsterdam</option>
                    <option>Linden</option>
                    <option>Anna Regina</option>
                    <option>East Coast Demerara</option>
                    <option>West Coast Demerara</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Frequency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>Weekly Updates</option>
                    <option>Monthly Reports</option>
                    <option>Quarterly Analysis</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Subscribe to Reports
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Market Insights</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Coming Soon</div>
                  <div className="text-lg font-semibold text-gray-900">Average Sale Price</div>
                  <div className="text-sm text-gray-600">Georgetown Area</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Coming Soon</div>
                  <div className="text-lg font-semibold text-gray-900">Days on Market</div>
                  <div className="text-sm text-gray-600">Average time to sell</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Coming Soon</div>
                  <div className="text-lg font-semibold text-gray-900">Price Trend</div>
                  <div className="text-sm text-gray-600">Month over month</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a href="mailto:info@guyanahomehub.com" className="text-indigo-600 hover:text-indigo-800">
                    info@guyanahomehub.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Phone Coming Soon</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Related Pages</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/properties" className="text-indigo-600 hover:text-indigo-800 text-sm">
                      Current Property Listings
                    </Link>
                  </li>
                  <li>
                    <Link href="/open-houses" className="text-indigo-600 hover:text-indigo-800 text-sm">
                      Open Houses
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides/buying" className="text-indigo-600 hover:text-indigo-800 text-sm">
                      Home Buying Guide
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
