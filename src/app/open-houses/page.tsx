import Link from 'next/link';
import { ArrowLeft, Home, Calendar, Clock, MapPin, Users, Mail, Phone } from 'lucide-react';

export default function OpenHousesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-orange-200 hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Open Houses
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Visit properties without an appointment. Browse our open house schedule and find your next home this weekend.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12 text-center">
          <Home className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Open House Listings Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're working with agents and homeowners to bring you a comprehensive schedule of open houses 
            across Guyana. Check back soon for upcoming open house events!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/list-agent" 
              className="bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Schedule Open House
            </Link>
            <Link 
              href="/contact" 
              className="border border-orange-600 text-orange-600 py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Get Notified
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* What to Expect */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What to Expect at Open Houses</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Clock className="h-8 w-8 text-orange-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointment Needed</h3>
                    <p className="text-gray-600">
                      Simply show up during the scheduled hours. No need to call ahead or make appointments.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-8 w-8 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Meet the Agent</h3>
                    <p className="text-gray-600">
                      The listing agent will be present to answer questions and provide property details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Home className="h-8 w-8 text-green-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Freely</h3>
                    <p className="text-gray-600">
                      Walk through the property at your own pace and get a feel for the space and neighborhood.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-8 w-8 text-purple-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Typically Weekends</h3>
                    <p className="text-gray-600">
                      Most open houses are held on weekends when buyers have more time to visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Open House Tips */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Open House Visiting Tips</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Come Prepared</h3>
                  <p className="text-gray-600">
                    Bring a notepad, measure tape, and your phone for photos. Have your financing pre-approved if you're serious about buying.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ask Questions</h3>
                  <p className="text-gray-600">
                    Don't hesitate to ask about utilities, recent repairs, neighborhood amenities, and reasons for selling.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Your Time</h3>
                  <p className="text-gray-600">
                    Don't rush through the property. Check all rooms, storage spaces, and the outdoor areas if applicable.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Be Respectful</h3>
                  <p className="text-gray-600">
                    Remember that this might be someone's current home. Be courteous and avoid critical comments about decor or personal items.
                  </p>
                </div>
              </div>
            </div>

            {/* For Sellers & Agents */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">For Sellers & Agents</h2>
              <p className="text-gray-600 mb-6">
                Open houses are a great way to generate interest and allow multiple buyers to view your property 
                efficiently. Schedule your open house through our platform to reach more potential buyers.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits for Sellers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Increased property exposure</li>
                    <li>• Multiple visitors in one session</li>
                    <li>• Immediate feedback from buyers</li>
                    <li>• Potential for competitive offers</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips for Success</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Stage the property well</li>
                    <li>• Ensure good lighting</li>
                    <li>• Provide property information sheets</li>
                    <li>• Be present to answer questions</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/list-agent" 
                  className="bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-center"
                >
                  Schedule Open House
                </Link>
                <Link 
                  href="/contact" 
                  className="border border-orange-600 text-orange-600 py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Open House Alerts</h3>
              <p className="text-gray-600 mb-6">
                Be notified about upcoming open houses in your areas of interest.
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Area
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Georgetown</option>
                    <option>New Amsterdam</option>
                    <option>Linden</option>
                    <option>Anna Regina</option>
                    <option>Other Areas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Any Price</option>
                    <option>Under G$50M</option>
                    <option>G$50M - G$100M</option>
                    <option>G$100M - G$200M</option>
                    <option>Over G$200M</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Get Alerts
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a href="mailto:info@guyanahomehub.com" className="text-orange-600 hover:text-orange-800">
                    info@guyanahomehub.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Phone Coming Soon</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Related Services</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/properties" className="text-orange-600 hover:text-orange-800 text-sm">
                      Browse All Properties
                    </Link>
                  </li>
                  <li>
                    <Link href="/recent-sales" className="text-orange-600 hover:text-orange-800 text-sm">
                      Recent Home Sales
                    </Link>
                  </li>
                  <li>
                    <Link href="/list-agent" className="text-orange-600 hover:text-orange-800 text-sm">
                      Agent Services
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
