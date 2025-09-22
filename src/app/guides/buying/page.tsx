import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, DollarSign, FileText, Home, Users, Phone, Mail } from 'lucide-react';

export default function HomeBuyingGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-teal-200 hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Home Buying Guide
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              Your complete guide to buying a home in Guyana. From getting pre-approved to closing on your dream property.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Table of Contents */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guide Contents</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Link href="#step1" className="block text-teal-600 hover:text-teal-800 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                1. Determine Your Budget
              </Link>
              <Link href="#step2" className="block text-teal-600 hover:text-teal-800 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                2. Get Pre-Approved for Financing
              </Link>
              <Link href="#step3" className="block text-teal-600 hover:text-teal-800 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                3. Find a Real Estate Agent
              </Link>
              <Link href="#step4" className="block text-teal-600 hover:text-teal-800 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                4. Start House Hunting
              </Link>
            </div>
            <div className="space-y-2">
              <Link href="#step5" className="block text-teal-600 hover:text-teal-800 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                5. Make an Offer
              </Link>
              <Link href="#step6" className="block text-teal-600 hover:text-teal-800 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                6. Get a Home Inspection
              </Link>
              <Link href="#step7" className="block text-teal-600 hover:text-teal-800 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                7. Finalize Your Mortgage
              </Link>
              <Link href="#step8" className="block text-teal-600 hover:text-teal-800 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                8. Close on Your Home
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Step 1 */}
            <div id="step1" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-teal-100 rounded-full p-3 mr-4">
                  <DollarSign className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Step 1: Determine Your Budget</h2>
                  <p className="text-gray-600">Know what you can afford before you start looking</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Calculate Your Affordability</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      Calculate your monthly income and expenses
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      Consider the 28/36 rule (housing costs shouldn't exceed 28% of gross income)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      Factor in down payment (typically 10-20% in Guyana)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      Account for closing costs and moving expenses
                    </li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Remember:</h4>
                      <p className="text-yellow-700 text-sm">
                        Don't forget ongoing costs like property taxes, insurance, maintenance, and utilities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div id="step2" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Step 2: Get Pre-Approved for Financing</h2>
                  <p className="text-gray-600">Secure your financing before you start shopping</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Required Documents</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        Proof of income (pay stubs, tax returns)
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        Bank statements
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        Employment verification
                      </li>
                    </ul>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        Credit history report
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        Identification documents
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        Asset documentation
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Benefits of Pre-Approval:</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Know your exact budget</li>
                    <li>• Show sellers you're a serious buyer</li>
                    <li>• Speed up the closing process</li>
                    <li>• Negotiate with confidence</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div id="step3" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Step 3: Find a Real Estate Agent</h2>
                  <p className="text-gray-600">Choose an experienced agent who knows the local market</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">What to Look For</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      Local market knowledge and experience
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      Good communication and responsiveness
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      Proper licensing and credentials
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      Positive reviews and references
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Link 
                    href="/list-agent" 
                    className="inline-flex items-center bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Find an Agent
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div id="step4" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                  <Home className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Step 4: Start House Hunting</h2>
                  <p className="text-gray-600">Begin your search with a clear list of priorities</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Considerations</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Must-Haves</h4>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• Number of bedrooms and bathrooms</li>
                        <li>• Preferred neighborhoods</li>
                        <li>• Maximum commute time</li>
                        <li>• Essential amenities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Nice-to-Haves</h4>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• Upgraded features</li>
                        <li>• Large yard or garden</li>
                        <li>• Modern appliances</li>
                        <li>• Proximity to schools/shops</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link 
                    href="/properties" 
                    className="inline-flex items-center bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Browse Properties
                  </Link>
                </div>
              </div>
            </div>

            {/* Remaining steps summary */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Completing Your Purchase</h2>
              <div className="grid md:grid-cols-2 gap-6">
                
                <div id="step5" className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 5: Make an Offer</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Work with your agent to submit a competitive offer based on market analysis and property condition.
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Include appropriate contingencies</li>
                    <li>• Set reasonable timelines</li>
                    <li>• Be prepared to negotiate</li>
                  </ul>
                </div>
                
                <div id="step6" className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 6: Get a Home Inspection</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Hire a qualified inspector to identify any potential issues with the property.
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Structural integrity check</li>
                    <li>• Electrical and plumbing systems</li>
                    <li>• Roof and foundation inspection</li>
                  </ul>
                </div>
                
                <div id="step7" className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 7: Finalize Your Mortgage</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Complete the final mortgage application and provide any additional documentation requested.
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Property appraisal</li>
                    <li>• Final underwriting approval</li>
                    <li>• Lock in your interest rate</li>
                  </ul>
                </div>
                
                <div id="step8" className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 8: Close on Your Home</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Review all documents, conduct a final walkthrough, and sign the necessary paperwork.
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Final walkthrough</li>
                    <li>• Sign closing documents</li>
                    <li>• Receive your keys!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help you navigate the home buying process in Guyana.
              </p>
              <div className="space-y-4">
                <Link 
                  href="/contact" 
                  className="block w-full bg-teal-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Contact Us
                </Link>
                <Link 
                  href="/list-agent" 
                  className="block w-full border border-teal-600 text-teal-600 text-center py-3 px-6 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                >
                  Find an Agent
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Tips</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">First-Time Buyer?</h4>
                  <p className="text-green-700 text-sm">
                    Ask about first-time buyer programs that may offer down payment assistance or reduced fees.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">Market Research</h4>
                  <p className="text-blue-700 text-sm">
                    Study recent sales in your target areas to understand current market values.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 text-sm mb-2">Be Patient</h4>
                  <p className="text-yellow-700 text-sm">
                    Finding the right home takes time. Don't rush into a decision you might regret.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a href="mailto:info@guyanahomehub.com" className="text-teal-600 hover:text-teal-800">
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
                    <Link href="/properties" className="text-teal-600 hover:text-teal-800 text-sm">
                      Browse All Properties
                    </Link>
                  </li>
                  <li>
                    <Link href="/recent-sales" className="text-teal-600 hover:text-teal-800 text-sm">
                      Recent Sales Data
                    </Link>
                  </li>
                  <li>
                    <Link href="/open-houses" className="text-teal-600 hover:text-teal-800 text-sm">
                      Open House Schedule
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
