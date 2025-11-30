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
    description: 'Everything diaspora buyers need to know about purchasing property in Guyana from the US, Canada, or UK. Legal requirements, step-by-step process, and how to avoid scams.',
    readTime: '15 min read',
    category: 'Diaspora',
    lastUpdated: 'December 1, 2024',
    content: `
# The Complete Guide to Buying Property in Guyana from Abroad

*By Darren Buckner, Founder of Guyana HomeHub*

If you're part of the Guyanese diaspora living in the United States, Canada, the UK, or anywhere else in the world, you've probably thought about buying property back home. Maybe it's a house for your parents. Maybe it's land you want to build on when you retire. Maybe you've heard about the oil boom and want to invest before prices go even higher.

Whatever your reason, you're not alone. Thousands of Guyanese abroad are looking at property back home right now. But most of them have the same questions — and the same fears.

*Can I actually buy property if I don't live there?*

*How do I know if the property is legitimate?*

*What if I get scammed?*

I get it. My wife is Guyanese, and I've spent a lot of time in Guyana over the years. I've seen how the real estate market works — and I've heard the horror stories. That's actually why I built Guyana HomeHub. Too many people were getting burned buying property through Facebook groups or relying on friends and family who meant well but didn't know what they were doing.

This guide is everything I wish someone had handed me the first time I looked at property in Guyana. It covers the legal requirements, the step-by-step process, the costs involved, and how to protect yourself from fraud. Whether you're serious about buying soon or just starting to explore, this will give you the foundation you need.

Let's get into it.

## Can Foreigners and Diaspora Actually Buy Property in Guyana?

Yes. Let me be clear about this because there's a lot of confusion.

Guyana's constitution protects the right of foreigners to own property. The Investment Act of 2004 specifically says there should be no discrimination between foreign and domestic investors. If you're a Guyanese citizen who now holds American, Canadian, or British citizenship, you absolutely can buy property. And even if you were never Guyanese — if you're a complete foreigner — you can still buy property in most cases.

There are only two restrictions worth knowing about:

**1. Land near the border:** You cannot own land within 40 miles of Guyana's borders with Venezuela, Brazil, or Suriname without special government permission. This is for national security reasons and doesn't affect most property buyers.

**2. Large land purchases:** If you want to buy more than 3 acres, you may need something called an Alien Landholding License. This adds some paperwork but isn't a dealbreaker.

For the typical diaspora buyer looking at a house in Georgetown, a plot in a housing scheme, or land on the East Bank — there are no restrictions. You have the same rights as someone living in Guyana.

## Understanding How Property Ownership Works in Guyana

Before you start looking at listings, you need to understand something unique about Guyana's property system. There are two main types of ownership, and they work differently.

### Transport (The Traditional System)

Most properties in Guyana, especially in Georgetown and established areas, are held under what's called a "Transport." This comes from the old Roman-Dutch legal system. When you have Transport, you have full and absolute ownership of the property — similar to what Americans call "fee simple" ownership. You can sell it, rent it, pass it to your children, or do whatever you want with it.

The document itself is literally called a Transport, and it's filed at the Deeds Registry.

### Certificate of Title (The Newer System)

Some newer developments and housing schemes use a different system managed by the Land Registry. Instead of a Transport, you get a Certificate of Title. This also gives you full ownership rights, just under a different legal framework.

**Why does this matter?**

When you're buying property, you need to know which system applies because the verification process is slightly different. Your attorney will handle this, but you should ask upfront: "Is this property under Transport or Certificate of Title?"

## The Step-by-Step Process for Buying Property from Abroad

Here's how the process typically works when you're buying from outside Guyana.

### Step 1: Find the Property

This is where most diaspora buyers run into trouble. They scroll through Facebook Marketplace, see something that looks good, and send money to someone they've never met. Don't do this.

Instead, work with a licensed real estate agent or use a verified platform like Guyana HomeHub where listings are connected to real agents. You want to see multiple options, compare prices, and know that there's a professional accountable for the information you're getting.

### Step 2: Do Your Initial Research

Before you get serious about any property, find out:

- What's the asking price? (And is it negotiable?)
- What type of ownership is it? (Transport or Certificate of Title?)
- What's the exact location and boundaries?
- Are there any existing structures?
- What's the history of the property?

A good agent can answer these questions. If they can't, that's a red flag.

### Step 3: Hire a Guyanese Attorney

This is non-negotiable. You need a local attorney who specializes in property transactions. Do not skip this step, no matter how much you trust the seller or the agent.

Your attorney will:

- Conduct a title search at the Deeds Registry
- Verify the seller actually owns the property
- Check for any liens, mortgages, or encumbrances (debts attached to the property)
- Review and prepare all legal documents
- Represent you at the final transfer

If you don't have an attorney in Guyana, ask your agent for recommendations or reach out to the Guyana Bar Association. Expect to pay legal fees — this is money well spent.

### Step 4: Title Verification (The Most Important Step)

Your attorney will go to the Deeds Registry or Land Registry and conduct a thorough search. They're looking to confirm:

- The seller is listed as the legal owner
- The property boundaries match what you're being sold
- There are no outstanding mortgages or liens
- There are no legal disputes or claims against the property

This step has saved countless buyers from fraud. In Guyana, there are cases of people selling property they don't own, or selling the same property to multiple buyers. A proper title search catches this before you hand over money.

### Step 5: Negotiate and Sign the Agreement of Sale

Once you're satisfied the property is legitimate, you'll negotiate the final price and terms. Your attorney will prepare an Agreement of Sale — a legal contract between you and the seller.

This document outlines:

- The purchase price
- The deposit amount (usually 10%)
- The timeline for completing the sale
- Conditions that must be met before closing
- What happens if either party backs out

Read this carefully. Ask questions. Don't sign anything you don't understand.

### Step 6: Pay the Deposit

Once the Agreement of Sale is signed, you'll pay a deposit to secure the property. This is typically held by the attorney until the transaction completes.

**Important:** Only send money through verified channels. Use wire transfers with a clear paper trail. Never send cash or use informal money transfer services for large amounts.

### Step 7: Passing of Transport (The Official Transfer)

Here's where Guyana's system is different from what you might be used to.

If the property is under Transport, the transfer must be publicly advertised in a Guyanese newspaper for three consecutive weeks. This gives anyone with a legitimate claim against the property a chance to come forward.

After the advertising period, there's a 10-day window for objections. If no valid objections are filed, the buyer and seller (or their attorneys with Power of Attorney) appear before a judge of the Supreme Court to officially pass the Transport to the new owner.

Yes, this involves the Supreme Court. It's more formal than property transfers in the US or Canada, but it's designed to provide legal certainty.

For properties under Certificate of Title, the process is handled through the Land Registry and is somewhat simpler, but still involves official registration.

### Step 8: Pay the Balance and Finalize

At closing, you'll pay the remaining balance of the purchase price, along with taxes and fees. Once the Transport is passed or the Title is transferred, you're the official owner.

## What It Costs (Taxes and Fees)

Budget for these expenses beyond the purchase price:

### Legal Fees
Attorney fees vary, but expect to pay 1-2% of the property value for a straightforward transaction. Complex deals may cost more.

### Stamp Duty
This is a tax on the transfer document, typically around 2% of the property value.

### Property Tax
Guyana has property tax based on the value of the property. Your attorney can estimate this for you.

### Registration Fees
Small fees for filing documents with the Deeds Registry or Land Registry.

### Capital Gains Tax (If You Sell Later)
If you buy property and sell it at a profit, you may owe capital gains tax at 25%. However, properties held for more than 25 years are exempt.

**Tip:** Ask your attorney for a full breakdown of expected costs before you commit. No surprises.

## Financing Your Purchase

Here's the reality: Financing property in Guyana from abroad is difficult.

Most local banks require you to be a resident or have significant local income to qualify for a mortgage. Some banks will work with non-residents, but the terms are often less favorable — higher down payments, higher interest rates.

Your options:

**1. Cash Purchase:** Most diaspora buyers pay cash, often saved up over years or pooled with family members. This is the simplest route.

**2. Financing in Your Home Country:** Some buyers take out a home equity loan or personal loan in the US, Canada, or UK and use those funds to purchase in Guyana. Talk to your bank about this option.

**3. Local Financing (Limited):** If you have a strong relationship with a Guyanese bank or significant local assets, you may be able to get a mortgage. But expect hurdles.

**4. Seller Financing:** Some sellers will let you pay in installments. This is rare and should be documented carefully by attorneys on both sides.

For large investments, foreign borrowers applying for loans over GYD $2 million (about USD $10,000) need permission from Guyana's Minister of Finance. The government prefers that foreign investors bring capital into the country rather than borrow locally.

## How to Protect Yourself from Fraud

I'm going to be straight with you. Property fraud happens in Guyana. People have lost money to fake sellers, forged documents, and properties sold multiple times to different buyers.

Here's how to protect yourself:

### Always Use an Attorney
Never buy property without a licensed attorney conducting a title search. This is your primary protection.

### Verify Everything
Don't take anyone's word for ownership. The Deeds Registry exists for a reason — use it.

### Don't Send Money Casually
Never wire money to an individual's personal account. Payments should go through your attorney's escrow or a verifiable business account.

### Be Skeptical of Facebook Deals
If someone is selling property through Facebook Marketplace with prices that seem too good to be true, they probably are. Work with licensed agents and verified platforms.

### Visit If Possible
If you can travel to Guyana before buying, do it. Walk the property. Meet the seller. Get a feel for the neighborhood. If you can't travel, have someone you trust absolutely do this for you — and not just a friend of a friend.

### Check the Agent
Real estate agents in Guyana should have a license from the Guyana Revenue Authority. The industry is becoming more regulated, with the Real Estate Agents and Brokers Act passed in 2023 creating new standards. Ask to see credentials.

We have a full guide on [avoiding property scams](/guides/avoid-property-scams) if you want to go deeper on this topic.

## Managing Property from Abroad

Once you own property in Guyana, you have a few options for managing it:

**Vacant Land:** If you're holding land as an investment, you may not need active management. Just make sure property taxes are paid and check in periodically to ensure no one has encroached on your land.

**Rental Property:** If you want to rent out your property, you'll need someone local to manage it — collecting rent, handling repairs, dealing with tenants. This can be a family member, a property management company, or your real estate agent if they offer this service.

**Family Use:** Many diaspora buyers purchase homes for family members to live in. This avoids management hassles but comes with its own family dynamics.

Whatever your plan, make sure you have a trusted person or professional on the ground who can handle issues when they arise.

## Why Now Is a Good Time to Buy

Guyana's economy is transforming. The discovery of massive oil reserves has made it one of the fastest-growing economies in the world. Foreign investment is pouring in. Infrastructure is improving. Property prices in desirable areas are climbing.

For diaspora buyers, this creates both opportunity and urgency. Properties that seem expensive today may look like bargains in five years. At the same time, more development means more options and more professional standards in how real estate is conducted.

The government is also actively courting diaspora investment, recognizing that Guyanese abroad are a major source of capital and expertise. The regulatory environment is improving, with the Real Estate Agents and Brokers Act bringing more accountability to the industry.

If you've been thinking about buying, don't wait forever. Do your research, work with professionals, protect yourself from fraud — and take advantage of the opportunity while it's still accessible.

## Ready to Start Looking?

Guyana HomeHub was built specifically for buyers like you — diaspora members who want to invest back home but need a trustworthy way to do it.

Every listing on our platform is connected to a licensed agent. You can browse properties, compare prices, and reach out directly to professionals who can guide you through the process.

If you're ready to start your search, [browse our verified listings](/properties/buy). If you have questions, [contact one of our agents](https://wa.me/5927629797). We're here to help you buy property in Guyana the right way.

## Quick Reference: Your Buying Checklist

Before you buy, make sure you've done the following:

- ☐ Confirmed you can legally purchase (no border restrictions, no large-land issues)
- ☐ Found properties through licensed agents or verified platforms
- ☐ Hired a Guyanese attorney specializing in property
- ☐ Completed a title search at the Deeds Registry or Land Registry
- ☐ Verified the seller is the legal owner with no encumbrances
- ☐ Reviewed and signed an Agreement of Sale
- ☐ Paid deposit through proper legal channels
- ☐ Waited for advertising period and objection window
- ☐ Attended (or had attorney attend) the passing of Transport
- ☐ Paid remaining balance, taxes, and fees
- ☐ Received your Transport or Certificate of Title

Congratulations — you're a property owner in Guyana.

*Have questions about buying property in Guyana? Browse our [property guides](/guides) or [contact a licensed agent](https://wa.me/5927629797) through Guyana HomeHub.*
`,
    tableOfContents: [
      { id: 'can-foreigners-and-diaspora-actually-buy-property-in-guyana', title: 'Can Foreigners and Diaspora Actually Buy Property?', level: 2 },
      { id: 'understanding-how-property-ownership-works-in-guyana', title: 'Understanding How Property Ownership Works', level: 2 },
      { id: 'the-step-by-step-process-for-buying-property-from-abroad', title: 'The Step-by-Step Process', level: 2 },
      { id: 'what-it-costs-taxes-and-fees', title: 'What It Costs (Taxes and Fees)', level: 2 },
      { id: 'financing-your-purchase', title: 'Financing Your Purchase', level: 2 },
      { id: 'how-to-protect-yourself-from-fraud', title: 'How to Protect Yourself from Fraud', level: 2 },
      { id: 'managing-property-from-abroad', title: 'Managing Property from Abroad', level: 2 },
      { id: 'why-now-is-a-good-time-to-buy', title: 'Why Now Is a Good Time to Buy', level: 2 },
      { id: 'ready-to-start-looking', title: 'Ready to Start Looking?', level: 2 },
      { id: 'quick-reference-your-buying-checklist', title: 'Quick Reference: Your Buying Checklist', level: 2 }
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