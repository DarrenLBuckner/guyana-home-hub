import Link from 'next/link';
import { ArrowLeft, Gavel, AlertTriangle, DollarSign, Clock, FileText, Phone, Mail } from 'lucide-react';

export default function ForeclosuresPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-red-200 hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bank Foreclosures
            </h1>
            <p className="text-xl text-red-100 mb-8">
              Discover distressed properties and foreclosure opportunities across Guyana. Find properties below market value from financial institutions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-12">
          <div className="flex items-start">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notice</h2>
              <p className="text-gray-700 mb-4">
                Foreclosure properties require special consideration and due diligence. We're currently working 
                with financial institutions to provide accurate foreclosure listings for Guyana.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition-colors text-center"
                >
                  Get Foreclosure Updates
                </Link>
                <Link 
                  href="/properties" 
                  className="border border-yellow-600 text-yellow-700 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-50 transition-colors text-center"
                >
                  Browse Regular Listings
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Understanding Foreclosures */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Foreclosures</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Gavel className="h-8 w-8 text-red-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">What is Foreclosure?</h3>
                    <p className="text-gray-600">
                      Foreclosure occurs when a borrower defaults on their mortgage payments, and the lender 
                      takes legal action to repossess and sell the property to recover the debt.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="h-8 w-8 text-green-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Potential Savings</h3>
                    <p className="text-gray-600">
                      Foreclosed properties are often sold below market value as financial institutions 
                      want to recover their investment quickly.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-8 w-8 text-primary mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Timeline Varies</h3>
                    <p className="text-gray-600">
                      The foreclosure process can take months or years, depending on local laws and 
                      the specific circumstances of each case.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Types of Foreclosure Sales */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Foreclosure Sales</h2>
              <div className="grid md:grid-cols-1 gap-6">
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Pre-Foreclosure</h3>
                  <p className="text-gray-600 mb-3">
                    Properties where the owner has received a notice of default but the foreclosure process hasn't been completed yet.
                  </p>
                  <div className="text-sm text-gray-500">
                    • Owner may still be living in the property<br/>
                    • Opportunity for short sales<br/>
                    • More negotiation flexibility
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Auction/Sheriff Sales</h3>
                  <p className="text-gray-600 mb-3">
                    Properties sold at public auction, typically held at the courthouse or other designated locations.
                  </p>
                  <div className="text-sm text-gray-500">
                    • Cash payment usually required<br/>
                    • Sold "as-is" without inspections<br/>
                    • Competitive bidding environment
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Bank-Owned (REO)</h3>
                  <p className="text-gray-600 mb-3">
                    Properties that didn't sell at auction and are now owned by the bank or lending institution.
                  </p>
                  <div className="text-sm text-gray-500">
                    • More traditional purchase process<br/>
                    • Inspections may be possible<br/>
                    • Bank may handle repairs
                  </div>
                </div>
              </div>
            </div>

            {/* Risks and Considerations */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Risks and Considerations</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Property Condition</h3>
                    <p className="text-gray-600 text-sm">
                      Foreclosed properties are typically sold "as-is" and may require significant repairs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Limited Inspections</h3>
                    <p className="text-gray-600 text-sm">
                      You may not be able to conduct thorough inspections before purchase.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Title Issues</h3>
                    <p className="text-gray-600 text-sm">
                      There may be liens, back taxes, or other title complications to resolve.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Occupancy Issues</h3>
                    <p className="text-gray-600 text-sm">
                      Previous owners or tenants may still be occupying the property.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Foreclosure Alerts</h3>
              <p className="text-gray-600 mb-6">
                Get notified when foreclosure properties become available in your area of interest.
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Region
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option>Georgetown</option>
                    <option>New Amsterdam</option>
                    <option>Linden</option>
                    <option>Anna Regina</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Budget
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option>Any Amount</option>
                    <option>Under G$30M</option>
                    <option>G$30M - G$60M</option>
                    <option>G$60M - G$100M</option>
                    <option>Over G$100M</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Get Alerts
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Professional Help?</h3>
              <p className="text-gray-600 mb-4">
                Foreclosure purchases can be complex. Consider working with experienced professionals.
              </p>
              <div className="space-y-3">
                <Link 
                  href="/list-agent" 
                  className="block w-full bg-gray-100 text-gray-800 text-center py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Find an Agent
                </Link>
                <Link 
                  href="/contact" 
                  className="block w-full bg-gray-100 text-gray-800 text-center py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Legal Consultation
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a href="mailto:info@guyanahomehub.com" className="text-red-600 hover:text-red-800">
                    info@guyanahomehub.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Phone Coming Soon</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Related Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/properties" className="text-red-600 hover:text-red-800 text-sm">
                      Regular Property Listings
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides/buying" className="text-red-600 hover:text-red-800 text-sm">
                      Home Buying Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/recent-sales" className="text-red-600 hover:text-red-800 text-sm">
                      Recent Sales Data
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
