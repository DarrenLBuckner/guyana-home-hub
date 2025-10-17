import Link from 'next/link';
import { ArrowLeft, Home, DollarSign, FileText, Phone } from 'lucide-react';

export default function FSBOPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-blue-200 hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              For Sale By Owner (FSBO)
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Sell your property directly without an agent. Save on commission fees and maintain complete control over your sale.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Benefits Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose FSBO?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <DollarSign className="h-8 w-8 text-green-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Money</h3>
                    <p className="text-gray-600">
                      Keep 100% of your sale price. No agent commission fees, which can save you thousands of dollars.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Home className="h-8 w-8 text-primary mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Control</h3>
                    <p className="text-gray-600">
                      Set your own price, schedule showings, and negotiate directly with buyers on your terms.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="h-8 w-8 text-purple-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Communication</h3>
                    <p className="text-gray-600">
                      Communicate directly with potential buyers without any intermediaries or delays.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-8 w-8 text-red-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Touch</h3>
                    <p className="text-gray-600">
                      Share your property's unique story and features directly with interested buyers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FSBO Tips */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">FSBO Success Tips</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Price It Right</h3>
                  <p className="text-gray-600">
                    Research comparable sales in your area and consider getting a professional appraisal to set the right price.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Professional Photos</h3>
                  <p className="text-gray-600">
                    High-quality photos are crucial. Consider hiring a professional photographer or use good lighting and staging.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Market Effectively</h3>
                  <p className="text-gray-600">
                    List on multiple platforms, use social media, and consider yard signs to maximize exposure.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Be Prepared</h3>
                  <p className="text-gray-600">
                    Have all necessary documents ready, including property disclosure forms and recent utility bills.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Considerations */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Legal Note</h3>
              <p className="text-yellow-700">
                While you can sell your property without an agent, consider consulting with a real estate attorney 
                to ensure all legal requirements are met and contracts are properly handled.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to List Your Property?</h3>
              <p className="text-gray-600 mb-6">
                Get started with our simple listing process and reach thousands of potential buyers.
              </p>
              <Link 
                href="/list-owner" 
                className="block w-full bg-primary text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors mb-4"
              >
                List Your Property
              </Link>
              <Link 
                href="/contact" 
                className="block w-full border border-primary text-primary text-center py-3 px-6 rounded-lg font-semibold hover:bg-primary/10 transition-colors"
              >
                Get Help
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">FSBO Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/guides/buying" className="text-primary hover:text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Home Selling Guide
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="text-primary hover:text-blue-800 flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Browse All Properties
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-primary hover:text-blue-800 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
