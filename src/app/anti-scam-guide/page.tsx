import type { Metadata } from 'next';
import { getCountryFromHeaders } from '@/lib/country-detection';

export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountryFromHeaders();
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  
  return {
    title: `Anti-Scam Guide - Safe Property Buying in ${countryName}`,
    description: `Protect yourself from property scams when buying real estate in ${countryName}. Essential safety tips for diaspora buyers and local property seekers.`,
    keywords: `${countryName} property scams, real estate fraud prevention, safe property buying, diaspora property investment, ${countryName} real estate safety`,
    openGraph: {
      title: `Anti-Scam Guide - Safe Property Buying in ${countryName}`,
      description: `Protect yourself from property scams when buying real estate in ${countryName}. Essential safety tips for diaspora buyers.`,
      type: 'article',
    },
  };
}

export default async function AntiScamGuidePage() {
  const country = await getCountryFromHeaders();
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          🛡️ Anti-Scam Guide
        </h1>
        <h2 className="text-2xl text-gray-700 mb-6">
          Protect Yourself When Buying Property in {countryName}
        </h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">
                ⚠️ Critical Warning for Diaspora Buyers
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Property scams targeting overseas {countryName} nationals have increased significantly. <strong>Never send money or cryptocurrency before physically viewing a property and verifying ownership.</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Guide Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-green-700 mb-6">Why This Guide Is Essential</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">📈 The Problem</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Facebook Marketplace lacks verification systems</li>
              <li>• Fake listings targeting diaspora buyers</li>
              <li>• No legal protection or escrow services</li>
              <li>• Difficult to verify property ownership</li>
              <li>• Currency conversion scams</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4">✅ {siteName} Solution</h3>
            <ul className="space-y-2 text-green-700">
              <li>• Verified agents and property owners</li>
              <li>• Property ownership verification</li>
              <li>• Legal documentation support</li>
              <li>• Secure transaction processes</li>
              <li>• Anti-fraud monitoring systems</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Red Flags Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-red-600 mb-6">🚨 Major Red Flags - Run Away!</h2>
        
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-red-800 mb-4">💰 Payment Red Flags</h3>
            <ul className="space-y-2 text-red-700">
              <li>• <strong>Demands immediate payment</strong> - "Property will be sold to someone else"</li>
              <li>• <strong>Requests cryptocurrency payments</strong> - Bitcoin, USDT, etc.</li>
              <li>• <strong>Wire transfer to personal accounts</strong> - Not business accounts</li>
              <li>• <strong>Refuses escrow services</strong> - Won't use lawyer or bank</li>
              <li>• <strong>Price far below market value</strong> - "Too good to be true" pricing</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">📋 Documentation Red Flags</h3>
            <ul className="space-y-2 text-orange-700">
              <li>• <strong>Refuses to provide title documents</strong> - No ownership proof</li>
              <li>• <strong>Won't meet at the actual property</strong> - Always "out of town"</li>
              <li>• <strong>Uses only WhatsApp/Facebook</strong> - No phone calls or video chats</li>
              <li>• <strong>Pressures for quick decisions</strong> - "Must decide today"</li>
              <li>• <strong>Can't provide lawyer contacts</strong> - No legal representation</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">🌐 Online Red Flags</h3>
            <ul className="space-y-2 text-purple-700">
              <li>• <strong>New social media profiles</strong> - Account created recently</li>
              <li>• <strong>Stock photos or limited images</strong> - Same photos on multiple listings</li>
              <li>• <strong>Poor grammar/spelling</strong> - Inconsistent with claimed education</li>
              <li>• <strong>Avoids video calls</strong> - Always "bad connection"</li>
              <li>• <strong>Multiple properties for sale</strong> - Unrealistic portfolio</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Safe Buying Process */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-green-700 mb-6">✅ Safe Property Buying Process</h2>
        
        <div className="space-y-8">
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4">🔍 Step 1: Verification Phase</h3>
            <ul className="space-y-3 text-green-700">
              <li>
                <strong>• Verify property ownership</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- Request official title documents</li>
                  <li>- Check with {countryName} Lands & Surveys Department</li>
                  <li>- Verify owner identity with government ID</li>
                </ul>
              </li>
              <li>
                <strong>• Research the agent/seller</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- Check {countryName} Real Estate Board registration</li>
                  <li>- Search for online reviews and testimonials</li>
                  <li>- Ask for references from recent clients</li>
                </ul>
              </li>
              <li>
                <strong>• Verify the property exists</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- Use Google Street View to confirm location</li>
                  <li>- Ask for live video tour via video call</li>
                  <li>- Request recent photos with dated newspapers</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">👥 Step 2: Professional Support</h3>
            <ul className="space-y-3 text-blue-700">
              <li>
                <strong>• Hire a {countryName} lawyer</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- Specialized in real estate transactions</li>
                  <li>- Registered with {countryName} Bar Association</li>
                  <li>- Will handle title search and due diligence</li>
                </ul>
              </li>
              <li>
                <strong>• Get professional property inspection</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- Licensed building inspector</li>
                  <li>- Check for structural issues and repairs needed</li>
                  <li>- Verify utilities and legal connections</li>
                </ul>
              </li>
              <li>
                <strong>• Use escrow services</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- {countryName} bank escrow account</li>
                  <li>- Lawyer-managed trust account</li>
                  <li>- Never send money directly to seller</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4">✈️ Step 3: Physical Verification</h3>
            <ul className="space-y-3 text-yellow-700">
              <li>
                <strong>• Plan a verification visit</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- Schedule trip specifically for property viewing</li>
                  <li>- Meet seller/agent at the actual property</li>
                  <li>- Bring a local friend or hire a representative</li>
                </ul>
              </li>
              <li>
                <strong>• Document everything</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- Take photos/videos of property and documents</li>
                  <li>- Record meetings and conversations</li>
                  <li>- Get all agreements in writing</li>
                </ul>
              </li>
              <li>
                <strong>• Final verification</strong>
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>- Confirm property matches listing exactly</li>
                  <li>- Verify neighborhood and access roads</li>
                  <li>- Check for any liens or legal issues</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Diaspora-Specific Tips */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6">🌍 Special Tips for Diaspora Buyers</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">💸 Financial Protection</h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• <strong>Use bank wire transfers</strong> - Traceable transactions</li>
                <li>• <strong>Keep currency exchange records</strong> - Tax and legal purposes</li>
                <li>• <strong>Get receipt for all payments</strong> - Official receipts only</li>
                <li>• <strong>Consider property insurance</strong> - Before final purchase</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">🏛️ Legal Considerations</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• <strong>Understand foreign ownership laws</strong> - {countryName} regulations</li>
                <li>• <strong>Tax implications</strong> - Both {countryName} and your residence country</li>
                <li>• <strong>Estate planning</strong> - How property transfers to heirs</li>
                <li>• <strong>Residency requirements</strong> - Impact on property ownership</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">🤝 Building Local Network</h3>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>• <strong>Connect with {countryName} diaspora groups</strong> - Get referrals</li>
                <li>• <strong>Join local Facebook groups</strong> - Real community members</li>
                <li>• <strong>Contact family/friends in {countryName}</strong> - Local verification</li>
                <li>• <strong>Build relationship with local bank</strong> - Future financing needs</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">📱 Technology Security</h3>
              <ul className="space-y-2 text-orange-700 text-sm">
                <li>• <strong>Video call verification</strong> - See person and property live</li>
                <li>• <strong>Reverse image search</strong> - Check if photos are stolen</li>
                <li>• <strong>Use secure payment methods</strong> - Avoid cash apps</li>
                <li>• <strong>Document all communications</strong> - Screenshots and recordings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-red-600 mb-6">🚨 If You've Been Scammed</h2>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-6">
          <h3 className="text-xl font-semibold text-red-800 mb-4">Immediate Actions:</h3>
          <ul className="space-y-2 text-red-700 mb-6">
            <li>• <strong>Contact your bank immediately</strong> - Try to reverse wire transfers</li>
            <li>• <strong>Report to {countryName} Police</strong> - File criminal complaint</li>
            <li>• <strong>Contact your local police</strong> - International fraud division</li>
            <li>• <strong>Report to FBI IC3</strong> - If from USA (ic3.gov)</li>
            <li>• <strong>Document everything</strong> - Save all communications and evidence</li>
          </ul>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-red-800 mb-3">{countryName} Emergency Contacts:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                {country === 'JM' ? (
                  <>
                    <li>• <strong>Jamaica Police:</strong> 119</li>
                    <li>• <strong>Jamaica Financial Investigation Division:</strong> 876-754-8896</li>
                    <li>• <strong>Consumer Affairs Commission:</strong> 876-906-5425</li>
                  </>
                ) : (
                  <>
                    <li>• <strong>Guyana Police:</strong> 911</li>
                    <li>• <strong>Special Organized Crime Unit (SOCU):</strong> 225-3650</li>
                    <li>• <strong>Consumer Protection Agency:</strong> 223-7274</li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-800 mb-3">International Support:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• <strong>FBI IC3 (USA):</strong> ic3.gov</li>
                <li>• <strong>Action Fraud (UK):</strong> 0300 123 2040</li>
                <li>• <strong>Canadian Anti-Fraud:</strong> 1-888-495-8501</li>
                <li>• <strong>ACCC Scamwatch (Australia):</strong> scamwatch.gov.au</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Verified Platform */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">🛡️ Why Choose {siteName}?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-3">Verified Agents</h3>
              <p className="text-sm opacity-90">All agents verified through {countryName} Real Estate Board and business registration</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-3">Property Authentication</h3>
              <p className="text-sm opacity-90">Ownership verification and title document validation for every listing</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">Secure Transactions</h3>
              <p className="text-sm opacity-90">Legal documentation support and secure payment processing</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a 
              href="/properties/buy"
              className="inline-flex items-center bg-white text-green-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🏠 Browse Verified Properties
            </a>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">📚 Additional Resources</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔗 Useful Links</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <a href="/safety-tips" className="text-green-600 hover:text-green-800 underline">Complete Safety Tips Guide</a></li>
              <li>• <a href="/legal-requirements" className="text-green-600 hover:text-green-800 underline">{countryName} Legal Requirements</a></li>
              <li>• <a href="/financing-guide" className="text-green-600 hover:text-green-800 underline">Property Financing Options</a></li>
              <li>• <a href="/market-reports" className="text-green-600 hover:text-green-800 underline">Market Reports & Trends</a></li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📞 Get Help</h3>
            <div className="space-y-3">
              <a 
                href="https://wa.me/5927629797?text=Hi%20Guyana%20Home%20Hub!%20I%20need%20help%20with%20property%20verification%20and%20avoiding%20scams." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span className="mr-2">💬</span>
                WhatsApp Support
              </a>
              <p className="text-sm text-gray-600 text-center">
                Get personalized assistance with property verification • +592 762-9797
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section>
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Disclaimer:</strong> This guide provides general information and should not be considered legal advice. 
            Always consult with qualified {countryName} legal and real estate professionals for specific transactions.
          </p>
          <p className="text-xs text-gray-500">
            © 2025 {siteName} - Protecting {countryName} Property Buyers Worldwide
          </p>
        </div>
      </section>
    </main>
  );
}