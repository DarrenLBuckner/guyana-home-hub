import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Services Agreement - Guyana Home Hub',
  description: 'Professional Services Agreement for Guyana Home Hub real estate platform and services.',
};

export default function ProfessionalServicesAgreementPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-2">GUYANA HOME HUB</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">PROFESSIONAL SERVICES AGREEMENT</h2>
      <p className="text-gray-600 mb-4">Last Updated: November 28, 2025</p>
      
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8">
        <p className="text-red-800 font-bold text-center">IMPORTANT: READ CAREFULLY BEFORE PURCHASING</p>
        <p className="text-red-800 font-bold text-center text-lg">ALL FEES ARE NON-REFUNDABLE</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 mb-6">
          This Professional Services Agreement ("Agreement") is entered into between Guyana Home Hub (a subsidiary of Caribbean Home Hub, "we," "us," or "our") and you ("User," "you," or "your") when you purchase any professional services on our platform.
        </p>

        <p className="text-gray-700 mb-6">
          By purchasing any services, including property listings, premium features, or advertising, you acknowledge that you have read, understood, and agree to be bound by this Agreement, our Terms of Service, Privacy Policy, Acceptable Use Policy, and Cookie Policy.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">1. SERVICES OFFERED</h3>
        <p className="text-gray-700 mb-4">
          Guyana Home Hub offers the following professional services (collectively, the "Services"):
        </p>
        
        <h4 className="text-lg font-medium text-gray-800 mb-3">1.1 Property Listing Services</h4>
        <p className="text-gray-700 mb-3">
          Property owners, landlords, and real estate professionals may purchase property listings. Each listing includes:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li><strong>Property listing:</strong> Post one property for a specified duration (30, 60, or 90 days)</li>
          <li><strong>Photo gallery:</strong> Upload multiple high-quality photos</li>
          <li><strong>Detailed description:</strong> Complete property details, features, and amenities</li>
          <li><strong>Contact management:</strong> Receive inquiries from interested parties</li>
          <li><strong>View analytics:</strong> Track property views and inquiry statistics</li>
          <li><strong>Social sharing:</strong> Share your listing on social media platforms</li>
        </ul>

        <p className="text-gray-700 mb-3"><strong>Listing Options:</strong></p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li><strong>Standard Listing:</strong> Basic visibility in search results</li>
          <li><strong>Featured Listing:</strong> Enhanced visibility with prominent placement (additional fee)</li>
          <li><strong>Premium Listing:</strong> Top placement, homepage features, priority in search results</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mb-3">1.2 Agent Services</h4>
        <p className="text-gray-700 mb-3">
          Licensed real estate agents and brokers may purchase enhanced services including:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li><strong>Professional profile:</strong> Enhanced agent profile with credentials and contact information</li>
          <li><strong>Multiple listings:</strong> Ability to post multiple properties</li>
          <li><strong>Lead management:</strong> Advanced tools for managing property inquiries</li>
          <li><strong>Priority support:</strong> Direct access to customer support</li>
          <li><strong>Market insights:</strong> Access to local market data and trends</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mb-3">1.3 Business Directory Services</h4>
        <p className="text-gray-700 mb-3">
          Real estate professionals and related businesses may purchase directory listings including:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
          <li><strong>Business profile:</strong> Professional business listing with contact details</li>
          <li><strong>Service descriptions:</strong> Detailed description of services offered</li>
          <li><strong>Customer reviews:</strong> Customer feedback and rating system</li>
          <li><strong>Direct contact:</strong> WhatsApp and phone integration for inquiries</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-4">2. ELIGIBILITY AND REQUIREMENTS</h3>
        
        <h4 className="text-lg font-medium text-gray-800 mb-3">2.1 General Requirements</h4>
        <p className="text-gray-700 mb-3">To purchase any services, you must:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Be at least 18 years of age</li>
          <li>Have legal authority to list the property or offer services</li>
          <li>Provide accurate and complete information</li>
          <li>Comply with all applicable laws in Guyana</li>
          <li>Agree to our Acceptable Use Policy and community standards</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mb-3">2.2 Property Listing Requirements</h4>
        <p className="text-gray-700 mb-3">For property listings, you must:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Be the property owner, authorized agent, or have power of attorney</li>
          <li>Ensure the property is legally available for sale or rent</li>
          <li>Provide accurate property information and pricing</li>
          <li>Include clear, recent photos of the actual property</li>
          <li>Comply with fair housing and anti-discrimination laws</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mb-3">2.3 Real Estate Professional Requirements</h4>
        <p className="text-gray-700 mb-3">For enhanced agent services, you must:</p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
          <li>Hold a valid real estate license where required by Guyana law</li>
          <li>Maintain good standing with relevant professional associations</li>
          <li>Provide proof of professional credentials upon request</li>
          <li>Comply with real estate professional conduct standards</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-4">3. PAYMENT TERMS AND PRICING</h3>
        
        <h4 className="text-lg font-medium text-gray-800 mb-3">3.1 Pricing</h4>
        <p className="text-gray-700 mb-4">
          Pricing for all services is displayed in Guyanese Dollars (GYD) and US Dollars (USD) on our platform at the time of purchase. Prices may vary based on service level, listing duration, and current promotional offers.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Price Changes:</strong> We reserve the right to change pricing at any time. New prices apply to future purchases but do not affect active listings or services purchased before the price change.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">3.2 Payment Methods</h4>
        <p className="text-gray-700 mb-3">We accept the following payment methods:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Credit and debit cards (Visa, Mastercard)</li>
          <li>Online banking transfers</li>
          <li>Mobile money services (where available in Guyana)</li>
          <li>PayPal and other digital wallets</li>
          <li>Bank transfers for larger purchases</li>
        </ul>
        <p className="text-gray-700 mb-4">
          Payment processing is handled securely by third-party processors. We do not store your complete payment details.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">3.3 Billing and Receipts</h4>
        <p className="text-gray-700 mb-4">
          All purchases are charged immediately upon completion. You will receive a receipt via email for each successful payment. Invoices and payment history are available in your account dashboard.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">3.4 Taxes and Fees</h4>
        <p className="text-gray-700 mb-6">
          All prices include applicable taxes and fees unless otherwise stated. You are responsible for any additional taxes required by your jurisdiction. Where required by law, we will collect and remit applicable taxes.
        </p>

        <div className="bg-red-50 border border-red-200 p-6 rounded-lg my-8">
          <h3 className="text-xl font-semibold text-red-800 mb-4">4. NO REFUND POLICY</h3>
          <p className="text-red-800 font-bold text-lg mb-4">ALL FEES ARE FINAL AND NON-REFUNDABLE</p>
          
          <h4 className="text-lg font-medium text-red-700 mb-3">4.1 General No-Refund Policy</h4>
          <p className="text-gray-700 mb-3">
            ALL PAYMENTS ARE FINAL AND NON-REFUNDABLE. This applies to all services, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Property listing fees (standard, featured, and premium)</li>
            <li>Agent service enhancements</li>
            <li>Business directory listings</li>
            <li>Any additional features or upgrades</li>
          </ul>

          <h4 className="text-lg font-medium text-red-700 mb-3">4.2 No Refunds for Early Sale/Rental</h4>
          <p className="text-gray-700 mb-3">NO REFUNDS will be provided if:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Your property sells or rents before the listing period expires</li>
            <li>You decide not to sell or rent your property</li>
            <li>You change your mind about the service</li>
            <li>You don't receive the number of inquiries you expected</li>
            <li>Market conditions change during your listing period</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Once your listing is published, fees are earned and non-refundable regardless of outcome.
          </p>

          <h4 className="text-lg font-medium text-red-700 mb-3">4.3 No Refunds for Service Dissatisfaction</h4>
          <p className="text-gray-700 mb-3">NO REFUNDS will be provided for:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Lower than expected property views or inquiries</li>
            <li>Technical issues that are resolved within reasonable time</li>
            <li>Dissatisfaction with platform features</li>
            <li>Changes to website design or functionality</li>
            <li>Competition from other listings</li>
          </ul>
          <p className="text-gray-700 mb-4">
            We make no guarantees about listing performance, results, or outcomes.
          </p>

          <h4 className="text-lg font-medium text-red-700 mb-3">4.4 Limited Exceptions</h4>
          <p className="text-gray-700 mb-3">Refunds may ONLY be provided for:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Duplicate charges:</strong> If you are accidentally charged twice for the same service</li>
            <li><strong>Service not delivered:</strong> If we completely fail to publish your listing despite successful payment</li>
            <li><strong>Fraudulent charges:</strong> If your payment method was used without authorization (subject to verification)</li>
            <li><strong>Our discretion:</strong> In exceptional circumstances at our sole discretion</li>
          </ul>
          <p className="text-gray-700">
            To request a refund under these limited exceptions, contact info@guyanahomehub.com within 7 days with supporting evidence.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">5. LISTING DURATION AND MANAGEMENT</h3>
        
        <h4 className="text-lg font-medium text-gray-800 mb-3">5.1 Listing Duration</h4>
        <p className="text-gray-700 mb-4">
          Property listings have a fixed duration selected at purchase (30, 60, or 90 days). Your listing is active and visible for the entire purchased period, automatically deactivates when the period expires, and cannot be extended; you must purchase a new listing.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">5.2 Early Removal</h4>
        <p className="text-gray-700 mb-4">
          You may remove your listing before it expires (e.g., if your property sells or rents). NO REFUNDS will be provided for early removal or unused time.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">5.3 Listing Updates</h4>
        <p className="text-gray-700 mb-4">
          You may update your listing information, photos, and pricing during the active period at no additional cost. Major changes that alter the fundamental nature of the listing may require approval.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">5.4 Renewal</h4>
        <p className="text-gray-700 mb-6">
          Before your listing expires, you will receive notification with the option to purchase a new listing period. Renewals require new payment and are subject to current pricing.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">6. CONTENT STANDARDS AND RESPONSIBILITIES</h3>
        
        <h4 className="text-lg font-medium text-gray-800 mb-3">6.1 Content Requirements</h4>
        <p className="text-gray-700 mb-3">All content must:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Be accurate, truthful, and not misleading</li>
          <li>Comply with all applicable laws in Guyana</li>
          <li>Use appropriate, professional language</li>
          <li>Include current, representative photos of the actual property</li>
          <li>Not infringe on intellectual property rights</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mb-3">6.2 Photo and Media Standards</h4>
        <p className="text-gray-700 mb-3">Photos and media must:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Be high quality and clearly show the property</li>
          <li>Be recent and accurately represent current property condition</li>
          <li>Not include people without their consent</li>
          <li>Not contain watermarks from other websites or photographers</li>
          <li>Be appropriate for a family-friendly platform</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mb-3">6.3 Prohibited Content</h4>
        <p className="text-gray-700 mb-3">You may not post content that:</p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
          <li>Violates fair housing or anti-discrimination laws</li>
          <li>Contains false or misleading information</li>
          <li>Promotes illegal activities</li>
          <li>Includes inappropriate or offensive material</li>
          <li>Infringes on copyrights or trademarks</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-4">7. WARRANTIES AND DISCLAIMERS</h3>
        
        <h4 className="text-lg font-medium text-gray-800 mb-3">7.1 Your Warranties</h4>
        <p className="text-gray-700 mb-3">By purchasing services, you warrant that:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>You have legal authority to enter into this Agreement</li>
          <li>All information provided is accurate and complete</li>
          <li>You own or have rights to all content you upload</li>
          <li>You will comply with all applicable laws and our policies</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mb-3">7.2 Service Disclaimers</h4>
        <p className="text-gray-700 mb-4">
          Services are provided "as is" and "as available." We make no guarantees regarding:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Number of property views or inquiries</li>
          <li>Speed of property sale or rental</li>
          <li>Continuous website availability</li>
          <li>Specific search result positioning</li>
          <li>Transaction completion or success</li>
        </ul>
        
        <p className="text-gray-700 mb-4">
          <strong>Private Listing Verification:</strong> For properties listed by private sellers (For Sale By Owner) or private landlords, the Platform (including Portal Home Hub, Caribbean Home Hub LLC, and all affiliated country-specific sites) does not verify ownership, accuracy of information, or identity of the listing party. Buyers and renters must conduct their own due diligence. The Platform is not liable for any losses resulting from transactions with private sellers or landlords.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">7.3 Limitation of Liability</h4>
        <p className="text-gray-700 mb-6">
          To the maximum extent permitted by law, Guyana Home Hub is not liable for any indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid for services in the 12 months prior to any claim.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">8. TERMINATION</h3>
        
        <h4 className="text-lg font-medium text-gray-800 mb-3">8.1 Our Right to Terminate</h4>
        <p className="text-gray-700 mb-3">We may suspend or terminate services if:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>You violate this Agreement or our policies</li>
          <li>You engage in fraudulent or illegal activity</li>
          <li>Your payment fails or is disputed</li>
          <li>We are required to do so by law</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mb-3">8.2 Effect of Termination</h4>
        <p className="text-gray-700 mb-6">
          Upon termination, your listings are deactivated, you lose access to services, and no refunds are provided for unused services.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">9. GENERAL PROVISIONS</h3>
        
        <h4 className="text-lg font-medium text-gray-800 mb-3">9.1 Governing Law</h4>
        <p className="text-gray-700 mb-4">
          This Agreement is governed by the laws of Guyana. Any disputes shall be resolved in the courts of Georgetown, Guyana.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">9.2 Amendments</h4>
        <p className="text-gray-700 mb-4">
          We may update this Agreement at any time. Material changes will be communicated via email or website notice at least 30 days before taking effect.
        </p>

        <h4 className="text-lg font-medium text-gray-800 mb-3">9.3 Entire Agreement</h4>
        <p className="text-gray-700 mb-6">
          This Agreement, together with our Terms of Service, Privacy Policy, Acceptable Use Policy, and Cookie Policy, constitutes the complete agreement between you and Guyana Home Hub.
        </p>

        <div className="bg-green-50 border border-green-200 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold text-green-800 mb-4">10. CONTACT INFORMATION</h3>
          <p className="text-gray-700 mb-4">
            For questions about this Agreement or billing issues, contact us:
          </p>
          <div className="space-y-2 mb-4">
            <p className="text-gray-800 font-medium">Guyana Home Hub</p>
            <p className="text-gray-700">A subsidiary of Caribbean Home Hub</p>
            <p className="text-gray-700">Email: <strong>info@guyanahomehub.com</strong></p>
            <p className="text-gray-700">Website: www.guyanahomehub.com</p>
          </div>

          <div className="space-y-3">
            <a 
              href="https://wa.me/5927629797?text=Hi%20Guyana%20Home%20Hub!%20I%20have%20a%20question%20about%20your%20professional%20services%20agreement." 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="mr-2">💬</span>
              WhatsApp Support
            </a>
            <p className="text-sm text-gray-600">
              Preferred method for fastest response • +592 762-9797
            </p>
          </div>
        </div>

        <hr className="my-8" />

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">ACKNOWLEDGMENT</h3>
          <p className="text-blue-800 font-semibold mb-3">By completing your purchase, you acknowledge that:</p>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>You have read and agree to this Professional Services Agreement</li>
            <li>You understand ALL fees are NON-REFUNDABLE</li>
            <li>You have legal authority to list the property or provide services</li>
            <li>All information provided is accurate and complete</li>
            <li>You agree to comply with all applicable laws and platform policies</li>
          </ol>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          © 2025 Caribbean Home Hub. All rights reserved.
        </div>
      </div>
    </main>
  );
}