import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountryFromHeaders } from '@/lib/country-detection';

interface GuideData {
  slug: string;
  title: string;
  description: string;
  content: string;
  readTime: string;
  category: string;
  lastUpdated: string;
  relatedGuides: Array<{
    slug: string;
    title: string;
    description: string;
  }>;
  tableOfContents: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

// Guide data - in production this would come from a CMS or database
const guidesData: Record<string, GuideData> = {
  'buying-from-abroad': {
    slug: 'buying-from-abroad',
    title: 'The Complete Guide to Buying Property in Guyana from Abroad',
    description: 'Everything diaspora buyers need to know about purchasing property in Guyana safely and legally from overseas.',
    readTime: '15 min read',
    category: 'Diaspora',
    lastUpdated: 'November 30, 2024',
    content: `
# The Complete Guide to Buying Property in Guyana from Abroad

## Introduction

Buying property in Guyana from abroad has become increasingly popular among the diaspora community. Whether you're in the United States, Canada, United Kingdom, or elsewhere, this comprehensive guide will walk you through everything you need to know to make a safe and successful property purchase in Guyana.

## Why Buy Property in Guyana?

### Growing Economy
Guyana's economy has been experiencing significant growth, particularly with the oil and gas discoveries. This economic boom has created opportunities for property investment and long-term value appreciation.

### Diaspora Connection
Many Guyanese living abroad maintain strong ties to their homeland and see property ownership as a way to stay connected while building wealth.

### Favorable Exchange Rates
For diaspora buyers earning in USD, CAD, GBP, or EUR, the favorable exchange rates can make Guyana property purchases very attractive.

## Step-by-Step Buying Process

### 1. Research and Property Selection

**Online Research**
- Use verified platforms like Guyana Home Hub to browse properties
- Avoid Facebook Marketplace and unverified sources
- Look for properties with clear ownership documentation

**Property Verification**
- Request title documents before making any commitments
- Verify property boundaries and any encumbrances
- Check with the Guyana Lands and Surveys Commission

### 2. Legal Representation

**Why You Need a Lawyer**
- Property law in Guyana requires legal expertise
- Title transfers must be handled properly
- Protection against fraud and legal issues

**Choosing the Right Lawyer**
- Select a lawyer registered with the Guyana Bar Association
- Look for experience in real estate transactions
- Ensure they have good communication with overseas clients

### 3. Financial Planning

**Currency Considerations**
- Plan for exchange rate fluctuations
- Consider the timing of currency transfers
- Factor in transfer fees and banking costs

**Payment Methods**
- Bank wire transfers are the safest option
- Avoid cryptocurrency or cash transactions
- Use escrow services when available

**Additional Costs**
- Legal fees (typically 2-3% of property value)
- Stamp duty (varies by property value)
- Registration fees
- Property inspection costs

### 4. Due Diligence Process

**Document Review**
- Transport (if applicable)
- Certificate of Title
- Property survey
- Tax compliance certificates
- Building permits (for new construction)

**Property Inspection**
- Hire a qualified building inspector
- Check for structural issues
- Verify utilities and infrastructure
- Assess neighborhood and access roads

## Common Challenges and Solutions

### Challenge 1: Communication Barriers

**Problem:** Difficulty communicating with local agents and lawyers
**Solution:** Use verified platforms that facilitate international communication

### Challenge 2: Property Verification

**Problem:** Difficulty verifying property ownership from abroad
**Solution:** Work with established real estate platforms and verified agents

### Challenge 3: Currency Transfer

**Problem:** High fees and unfavorable exchange rates
**Solution:** Use specialized currency transfer services, plan timing strategically

## Red Flags to Avoid

### Immediate Red Flags
- Seller demands immediate payment
- Price significantly below market value
- Refusal to provide title documents
- Pressure to make quick decisions
- Requests for cryptocurrency payments

### Documentation Red Flags
- Incomplete or missing title documents
- Seller cannot provide lawyer contact information
- Property has unclear boundaries
- Outstanding liens or legal issues

## Technology and Remote Buying

### Virtual Property Tours
- Request live video tours via WhatsApp or Zoom
- Ask for specific areas to be shown
- Request recent photos with dated newspapers

### Digital Documentation
- Use secure platforms for document sharing
- Verify documents with official sources
- Maintain digital copies of all transactions

## Working with Agents

### Choosing the Right Agent
- Verify agent licensing with Guyana Real Estate Board
- Look for agents experienced with diaspora clients
- Check references and past transactions
- Ensure good communication and responsiveness

### Agent Red Flags
- Unlicensed or unverified agents
- Reluctance to provide credentials
- Poor communication or unavailability
- Pressure tactics or unrealistic promises

## Final Steps and Completion

### 1. Final Property Inspection
- Conduct a final walkthrough (in person or virtual)
- Verify property condition matches agreement
- Confirm all agreed-upon repairs are completed

### 2. Closing Process
- Review all documents with your lawyer
- Ensure funds are in escrow or secure account
- Complete title transfer procedures
- Obtain all necessary certificates and documents

### 3. Post-Purchase Considerations
- Property management (if rental investment)
- Insurance arrangements
- Tax obligations in both countries
- Estate planning considerations

## Resources and Contacts

### Government Agencies
- **Guyana Lands and Surveys Commission:** For title verification
- **Guyana Revenue Authority:** For tax matters
- **Ministry of Housing:** For housing programs and information

### Professional Services
- **Guyana Bar Association:** For verified lawyers
- **Guyana Association of Professional Engineers:** For building inspections
- **Banks:** For financing options and currency services

## Conclusion

Buying property in Guyana from abroad is entirely achievable with proper planning, due diligence, and the right professional support. The key is to work with verified agents, qualified lawyers, and established platforms that understand the unique needs of diaspora buyers.

Remember: **Never rush into a property purchase**. Take the time to verify everything, work with qualified professionals, and ensure you understand all aspects of the transaction before committing.

Ready to start your property search? Browse verified listings on [Guyana Home Hub](/properties/buy) or [contact our expert team](https://wa.me/5927629797) for personalized assistance.
`,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'why-buy-property-in-guyana', title: 'Why Buy Property in Guyana?', level: 2 },
      { id: 'step-by-step-buying-process', title: 'Step-by-Step Buying Process', level: 2 },
      { id: 'research-and-property-selection', title: 'Research and Property Selection', level: 3 },
      { id: 'legal-representation', title: 'Legal Representation', level: 3 },
      { id: 'financial-planning', title: 'Financial Planning', level: 3 },
      { id: 'due-diligence-process', title: 'Due Diligence Process', level: 3 },
      { id: 'common-challenges-and-solutions', title: 'Common Challenges and Solutions', level: 2 },
      { id: 'red-flags-to-avoid', title: 'Red Flags to Avoid', level: 2 },
      { id: 'technology-and-remote-buying', title: 'Technology and Remote Buying', level: 2 },
      { id: 'working-with-agents', title: 'Working with Agents', level: 2 },
      { id: 'final-steps-and-completion', title: 'Final Steps and Completion', level: 2 },
      { id: 'resources-and-contacts', title: 'Resources and Contacts', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 }
    ],
    relatedGuides: [
      {
        slug: 'avoid-property-scams',
        title: 'How to Avoid Property Scams in Guyana',
        description: 'Protect yourself from fraud and scams when buying property.'
      },
      {
        slug: 'property-titles-explained',
        title: 'Understanding Property Titles in Guyana',
        description: 'Transport vs. Certificate of Title explained.'
      }
    ]
  },
  'avoid-property-scams': {
    slug: 'avoid-property-scams',
    title: 'How to Avoid Property Scams in Guyana',
    description: 'Protect yourself from fraud and scams when buying property in Guyana. Learn to identify red flags and verify legitimate properties.',
    readTime: '10 min read',
    category: 'Safety',
    lastUpdated: 'November 30, 2024',
    content: `
# How to Avoid Property Scams in Guyana

## The Growing Problem

Property scams targeting diaspora buyers have become increasingly sophisticated. Scammers often target Guyanese living abroad, knowing they may be less familiar with current local procedures and more likely to rely on remote communications.

**This guide will help you identify scams and protect yourself from becoming a victim.**

## Common Types of Property Scams

### 1. Fake Property Listings

**How It Works:**
- Scammers post attractive properties at below-market prices
- Use stolen photos from legitimate listings
- Create fake contact information and agent profiles
- Request immediate payments or deposits

**Warning Signs:**
- Price significantly below market value
- Limited or recycled photos
- Seller unwilling to meet at the property
- Requests for cryptocurrency or untraceable payments

### 2. Title Document Fraud

**How It Works:**
- Fraudsters create fake title documents
- Use properties they don't own
- May show partial or outdated documents
- Rush buyers to avoid proper verification

**Warning Signs:**
- Reluctance to provide complete title documentation
- Documents that look unprofessional or incomplete
- Seller cannot provide lawyer contact information
- Pressure to complete transaction quickly

### 3. Advance Fee Scams

**How It Works:**
- Scammer requests upfront fees for "processing"
- Claims fees are for legal documents, inspections, or taxes
- Disappears after receiving payment
- May provide fake receipts or documentation

**Warning Signs:**
- Requests for upfront fees before showing property
- Unusual payment methods (gift cards, cryptocurrency)
- Vague explanations for fee purposes
- No official receipts or proper documentation

## How to Verify Legitimate Properties

### 1. Title Verification

**Official Verification Process:**
- Contact the Guyana Lands and Surveys Commission directly
- Request title search using property address and lot number
- Verify current owner matches seller identity
- Check for any liens, encumbrances, or legal issues

**Required Information:**
- Complete property address
- Lot and block numbers
- Current owner's full legal name
- Property boundaries and size

### 2. Agent Verification

**Check Agent Credentials:**
- Verify registration with Guyana Real Estate Board
- Request agent license number and verify independently
- Check business registration and physical office address
- Look for established track record and references

**Red Flags for Fake Agents:**
- No physical office or established address
- Recently created social media profiles
- Unwilling to provide credentials or license information
- Communication only through messaging apps

### 3. Property Inspection

**In-Person Verification:**
- Hire a qualified local inspector
- Meet at the actual property location
- Verify property matches listing descriptions
- Check neighborhood and surrounding area

**Remote Verification:**
- Request live video tour via video call
- Ask for specific areas and angles to be shown
- Request photos with current dated newspapers
- Use Google Street View to verify location

## Safe Communication Practices

### 1. Initial Contact

**Best Practices:**
- Use verified platforms like Guyana Home Hub
- Avoid deals found only on social media
- Request professional email addresses
- Verify phone numbers and business information

**Communication Red Flags:**
- Contact only through WhatsApp or Facebook
- Reluctance to provide professional contact details
- Poor grammar or spelling in communications
- Inconsistent information across conversations

### 2. Documentation Requests

**What to Request:**
- Complete, unedited title documents
- Agent license and credentials
- Lawyer contact information
- Property survey and plans
- Recent property tax receipts

**Red Flags:**
- Partial or edited documents
- Refusal to provide complete documentation
- Documents that look unprofessional
- Inconsistent information across documents

## Secure Payment Practices

### 1. Safe Payment Methods

**Recommended:**
- Bank wire transfers to established legal firms
- Escrow services through verified lawyers
- Payments made directly to title companies
- Official business accounts with proper documentation

**Never Use:**
- Cryptocurrency payments
- Cash transactions
- Personal checks to individuals
- Gift cards or money transfer services
- Payments to personal bank accounts

### 2. Escrow and Legal Protection

**Why Use Escrow:**
- Protects your funds until transaction completes
- Provides legal recourse if issues arise
- Ensures proper documentation and procedures
- Third-party verification of transaction details

**Setting Up Escrow:**
- Choose lawyer registered with Guyana Bar Association
- Verify lawyer credentials independently
- Ensure escrow account is properly established
- Get written agreement detailing escrow terms

## What to Do If You Suspect a Scam

### 1. Immediate Actions

**Stop All Payments:**
- Do not send any additional money
- Contact your bank if payments already sent
- Document all communications and evidence
- Preserve all emails, messages, and documents

**Gather Evidence:**
- Screenshots of all communications
- Copies of any documents received
- Payment receipts and transaction details
- Contact information used by scammers

### 2. Reporting Procedures

**Local Authorities:**
- **Guyana Police Force - Fraud Department:** Report in person or online
- **Special Organized Crime Unit (SOCU):** For complex fraud cases
- **Consumer Protection Agency:** For business-related fraud

**International Reporting:**
- **FBI Internet Crime Complaint Center (IC3):** For US residents
- **Action Fraud (UK):** For UK residents
- **Canadian Anti-Fraud Centre:** For Canadian residents
- **Local police:** In your country of residence

### 3. Recovery Options

**Financial Recovery:**
- Contact your bank immediately
- File disputes for credit card transactions
- Work with international law enforcement
- Consider legal action through Guyana courts

**Legal Assistance:**
- Consult with lawyers in both jurisdictions
- Document all losses and expenses
- Cooperate with law enforcement investigations
- Consider civil litigation options

## Working with Verified Platforms

### Benefits of Using Guyana Home Hub

**Agent Verification:**
- All agents verified with Real Estate Board
- Background checks and credential verification
- Established business addresses and contacts
- Track record of successful transactions

**Property Authentication:**
- Title document verification
- Property ownership confirmation
- Current market value assessments
- Professional property descriptions and photos

**Transaction Security:**
- Secure communication channels
- Verified contact information
- Legal documentation support
- Dispute resolution procedures

## Prevention Checklist

### Before Starting Your Search

- [ ] Research current market values in your area of interest
- [ ] Identify verified real estate platforms and agents
- [ ] Establish relationships with qualified Guyana lawyers
- [ ] Understand proper legal procedures for property transfer
- [ ] Set up secure communication and payment methods

### During Property Viewing

- [ ] Verify agent credentials and license
- [ ] Request complete title documentation
- [ ] Confirm property ownership with official sources
- [ ] Conduct thorough property inspection
- [ ] Verify neighborhood and location details

### Before Making Payment

- [ ] Complete all due diligence procedures
- [ ] Verify all documentation with independent sources
- [ ] Establish proper escrow arrangements
- [ ] Review all contracts with qualified lawyer
- [ ] Confirm secure payment methods and procedures

## Conclusion

Property scams are a serious threat, but they are entirely preventable with proper knowledge and precautions. The key is to work with verified platforms, qualified professionals, and to always verify information independently.

**Remember:** Legitimate property transactions take time and proper documentation. Any seller who pressures you to act quickly or skip verification steps is likely running a scam.

**Trust your instincts.** If something feels wrong or too good to be true, take time to investigate further.

For verified property listings and professional assistance, visit [Guyana Home Hub](/properties/buy) or [contact our verified agents](https://wa.me/5927629797) who are trained to help diaspora buyers safely navigate the Guyana property market.
`,
    tableOfContents: [
      { id: 'the-growing-problem', title: 'The Growing Problem', level: 2 },
      { id: 'common-types-of-property-scams', title: 'Common Types of Property Scams', level: 2 },
      { id: 'how-to-verify-legitimate-properties', title: 'How to Verify Legitimate Properties', level: 2 },
      { id: 'safe-communication-practices', title: 'Safe Communication Practices', level: 2 },
      { id: 'secure-payment-practices', title: 'Secure Payment Practices', level: 2 },
      { id: 'what-to-do-if-you-suspect-a-scam', title: 'What to Do If You Suspect a Scam', level: 2 },
      { id: 'working-with-verified-platforms', title: 'Working with Verified Platforms', level: 2 },
      { id: 'prevention-checklist', title: 'Prevention Checklist', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 }
    ],
    relatedGuides: [
      {
        slug: 'buying-from-abroad',
        title: 'The Complete Guide to Buying Property in Guyana from Abroad',
        description: 'Everything diaspora buyers need to know about purchasing property safely.'
      },
      {
        slug: 'property-titles-explained',
        title: 'Understanding Property Titles in Guyana',
        description: 'Transport vs. Certificate of Title explained.'
      }
    ]
  }
  // Additional guides would be added here
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  
  const guide = guidesData[params.slug];
  
  if (!guide) {
    return {
      title: `Guide Not Found - ${siteName}`,
    };
  }
  
  return {
    title: `${guide.title} | ${siteName}`,
    description: guide.description,
    keywords: `${guide.category.toLowerCase()}, property guide, ${country === 'JM' ? 'Jamaica' : 'Guyana'} real estate`,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
    },
  };
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  
  const guide = guidesData[params.slug];
  
  if (!guide) {
    notFound();
  }

  return (
    <>
      {/* Article Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": guide.title,
            "description": guide.description,
            "author": {
              "@type": "Organization",
              "name": siteName
            },
            "publisher": {
              "@type": "Organization", 
              "name": siteName,
              "logo": {
                "@type": "ImageObject",
                "url": `${country === 'JM' ? 'https://jamaicahomehub.com' : 'https://guyanahomehub.com'}/images/logo.png`
              }
            },
            "datePublished": guide.lastUpdated,
            "dateModified": guide.lastUpdated
          })
        }}
      />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-6xl mx-auto px-6">
            <nav className="text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="mx-2 text-gray-400">›</span>
              <Link href="/guides" className="text-gray-500 hover:text-gray-700">Guides</Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="text-gray-900">{guide.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {guide.category}
                  </span>
                  <span className="text-gray-500 text-sm">{guide.readTime}</span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {guide.title}
                </h1>
                
                <div className="text-gray-600 mb-6">
                  <span>By {siteName} Team</span>
                  <span className="mx-2">•</span>
                  <span>Updated {guide.lastUpdated}</span>
                </div>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  {guide.description}
                </p>
              </div>

              {/* Table of Contents */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
                <ul className="space-y-2">
                  {guide.tableOfContents.map((item) => (
                    <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                      <a 
                        href={`#${item.id}`}
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-a:text-green-600 hover:prose-a:text-green-700"
                dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, '<br>') }}
              />

              {/* Related Guides */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {guide.relatedGuides.map((relatedGuide) => (
                    <div key={relatedGuide.slug} className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        <Link href={`/guides/${relatedGuide.slug}`} className="hover:text-green-600 transition-colors">
                          {relatedGuide.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4">{relatedGuide.description}</p>
                      <Link 
                        href={`/guides/${relatedGuide.slug}`}
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        Read Guide →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Find Your Property?</h2>
                <p className="text-lg mb-6 opacity-90">
                  Browse verified listings from trusted agents and verified owners
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/properties/buy"
                    className="inline-flex items-center bg-white text-green-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    🏠 Browse Properties
                  </Link>
                  <a
                    href="https://wa.me/5927629797?text=Hi%20Guyana%20Home%20Hub!%20I%20read%20your%20guides%20and%20need%20help%20finding%20property%20in%20Guyana."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-green-700 transition-all duration-200"
                  >
                    💬 Get Expert Help
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Browse Properties CTA */}
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Ready to Browse?</h3>
                  <p className="text-green-700 text-sm mb-4">
                    Find verified properties that match your needs
                  </p>
                  <Link
                    href="/properties/buy"
                    className="block w-full bg-green-600 text-white text-center font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Properties
                  </Link>
                </div>

                {/* Contact Agent CTA */}
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Need Expert Help?</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Get personalized assistance from our verified agents
                  </p>
                  <a
                    href="https://wa.me/5927629797"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white text-center font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Contact Agent
                  </a>
                </div>

                {/* Share */}
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Share This Guide</h3>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                      Facebook
                    </button>
                    <button className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors">
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}