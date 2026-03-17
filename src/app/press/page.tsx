import { Metadata } from 'next';
import Image from 'next/image';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const revalidate = 300; // refresh every 5 minutes

export const metadata: Metadata = {
  title: 'Press & Media | Guyana HomeHub',
  description: 'Guyana HomeHub press coverage, media kit, and contact information. Featured on NewsSource Guyana Morning Live with Gordon Moseley.',
};

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getQuickFacts() {
  const supabase = createServiceClient();

  const [{ count: agentCount }, { count: propertyCount }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('user_type', 'agent'),
    supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .in('status', ['active', 'under_contract', 'off_market']),
  ]);

  return [
    { label: 'Launched', value: 'January 7, 2026' },
    { label: 'Agents', value: String(agentCount ?? 0) },
    { label: 'Properties Listed', value: String(propertyCount ?? 0) },
    { label: 'Website', value: 'guyanahomehub.com' },
  ];
}

const pressDownloads = [
  {
    title: 'Press Release',
    path: '/press/GuyanaHomeHub_Press_Release.pdf',
    description: 'Official launch announcement',
  },
  {
    title: 'Fact Sheet',
    path: '/press/GuyanaHomeHub_Fact_Sheet.pdf',
    description: 'Key facts and figures',
  },
  {
    title: 'Logo',
    path: '/images/ghh-logo.png',
    description: 'High-resolution PNG',
  },
  {
    title: 'Platform Screenshots',
    path: '/press/guyanahomehub-screenshots.zip',
    description: 'Collection of platform images',
  },
];

const newsArticleSchema = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Guyana HomeHub Featured on NewsSource Guyana's Morning Live",
  "datePublished": "2026-02-11",
  "dateModified": "2026-03-17",
  "author": {
    "@type": "Person",
    "name": "Gordon Moseley"
  },
  "publisher": {
    "@type": "Organization",
    "name": "NewsSource Guyana"
  },
  "about": {
    "@type": "Organization",
    "name": "Guyana Home Hub",
    "url": "https://www.guyanahomehub.com"
  },
  "url": "https://www.guyanahomehub.com/press",
  "description": "Guyana HomeHub CEO Darren Buckner discusses the platform, Guyana's oil boom, and the diaspora investment opportunity on Morning Live with Gordon Moseley."
};

export default async function PressPage() {
  const quickFacts = await getQuickFacts();

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-700 mb-4">Press & Media</h1>
          <p className="text-lg text-gray-600">
            Resources for journalists and media covering Guyana HomeHub
          </p>
        </div>

        {/* Featured Press Coverage */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="bg-emerald-600 px-6 py-3">
            <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">Featured Coverage</span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span>NewsSource Guyana — Morning Live</span>
              <span className="text-gray-300">|</span>
              <time dateTime="2026-02-11">February 11, 2026</time>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Guyana HomeHub Featured on NewsSource Guyana&apos;s Morning Live
            </h2>
            <p className="text-gray-600 mb-6">
              CEO Darren Buckner discusses the platform, the oil boom, and what it means for diaspora buyers looking to invest back home
            </p>

            {/* YouTube Embed */}
            <div className="rounded-lg overflow-hidden mb-8">
              <iframe
                width="100%"
                style={{ aspectRatio: '16/9' }}
                src="https://www.youtube.com/embed/KP196IvQCfY"
                title="Guyana HomeHub Featured on NewsSource Guyana Morning Live"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Article Body */}
            <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
              <p>
                Guyana HomeHub founder and CEO Darren Buckner appeared live on Morning Live with Gordon Moseley
                on NewsSource Guyana on February 11, 2026 — his first major media appearance since launching
                the platform.
              </p>
              <p>
                In the interview, Buckner explained what brought an American entrepreneur to build a real estate
                platform for Guyana. The answer is personal. His wife Rochelle is Guyanese — daughter of former
                national cricketer Milton Pydana, known across Guyana as &quot;Golden Glove.&quot; The couple
                had been trying to buy land in Guyana to build a retirement home and found the experience
                frustrating — scattered Facebook groups, unverified WhatsApp listings, and no central trusted source.
              </p>

              <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-6 bg-emerald-50 rounded-r-lg">
                <p className="text-gray-800 italic">
                  &quot;We were trying to look through Facebook and a bunch of WhatsApp groups and I mean, you
                  just got lost. When we go to the United States, we just go to one website. So we built that
                  for Guyana.&quot;
                </p>
              </blockquote>

              <p>
                Buckner described Guyana HomeHub as a platform where buyers, sellers, renters, and agents all
                come together in one place — with verified agent profiles, photo requirements, and clear property
                descriptions that eliminate the guesswork diaspora buyers face when transacting from abroad.
              </p>

              <p className="font-semibold text-gray-900">
                On Guyana&apos;s oil boom and what it means for real estate:
              </p>

              <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-6 bg-emerald-50 rounded-r-lg">
                <p className="text-gray-800 italic">
                  &quot;Properties that maybe in 2010, 2012 were going for $20 million Guyana are now going for
                  $100, $200 million Guyana in certain areas. The supply and demand game is being played — and
                  it&apos;s actually good for the people of Guyana because if you own something, you&apos;ve
                  seen the value go up.&quot;
                </p>
              </blockquote>

              <p className="font-semibold text-gray-900">
                On the diaspora opportunity:
              </p>

              <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-6 bg-emerald-50 rounded-r-lg">
                <p className="text-gray-800 italic">
                  &quot;The Guyanese in New York, in Toronto, in London — they&apos;re looking for opportunities
                  to invest back home. They want to make sure they&apos;re working with a trusted source, a
                  reliable agent. That&apos;s what Guyana HomeHub provides.&quot;
                </p>
              </blockquote>

              <p>
                Buckner also addressed the trust problem head-on — referencing a personal connection to someone
                who had been a victim of real estate fraud in Guyana, and explaining why the platform requires
                minimum photo counts, full property descriptions, and agent verification before listings go live.
              </p>

              <p className="text-gray-600 text-sm">
                The full interview is available above and on the NewsSource Guyana YouTube channel and Facebook page.
              </p>
            </div>

            {/* About Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">About Guyana HomeHub</h3>
                <p className="text-sm text-gray-600">
                  Guyana HomeHub (guyanahomehub.com) is Guyana&apos;s dedicated real estate search platform —
                  built for buyers, sellers, renters, and agents. It is operated by Caribbean HomeHub LLC, a
                  US-based company headquartered in Missouri. The platform connects the Guyanese diaspora in
                  North America, the UK, and beyond with verified agents and real listings across Guyana.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">About NewsSource Guyana</h3>
                <p className="text-sm text-gray-600">
                  NewsSource Guyana is one of Guyana&apos;s leading independent media outlets, founded by
                  journalist Gordon Moseley. Morning Live is the platform&apos;s flagship morning program
                  covering news, business, and community affairs across Guyana.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{fact.label}</div>
                <div className="text-lg font-semibold text-green-700">{fact.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Guyana HomeHub</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Guyana HomeHub is a professional real estate listing platform built specifically for the
              Guyanese market. We provide one central place to search properties across all regions -
              Georgetown, East Coast, West Coast, Berbice, and beyond.
            </p>
            <p>
              For buyers, especially those in the diaspora, Guyana HomeHub offers a searchable database
              where you can filter by price, location, and property type, save listings, and return
              anytime. No more losing listings in social media feeds.
            </p>
            <p>
              For agents, we provide a dashboard to manage all listings in one place - upload, edit,
              and organize by status: available, rented, or sold.
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Founder</h2>
          <div className="md:flex md:gap-6">
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <Image
                src="/images/founder-headshot.png"
                alt="Darren Buckner, Founder & CEO"
                width={128}
                height={128}
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>
            <div className="text-gray-700">
              <p>
                Darren Buckner is a serial entrepreneur based in St. Louis, Missouri with experience
                in construction, real estate development, property renovation, and web development.
                Married for 16 years to Rochelle Pydana - daughter of the late Guyanese cricket legend
                Milton Pydana - Buckner built Guyana HomeHub after experiencing firsthand the challenges
                of purchasing property in Guyana from overseas.
              </p>
            </div>
          </div>
        </section>

        {/* Downloads Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Press Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pressDownloads.map((item) => (
              <a
                key={item.path}
                href={item.path}
                download
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Media Contact Section */}
        <section className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Media Contact</h2>
          <div className="text-gray-700">
            <p className="font-semibold text-lg">Darren Buckner</p>
            <p className="text-gray-600 mb-4">Founder & CEO</p>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a
                  href="mailto:darren@portalhomehub.com"
                  className="text-green-700 hover:text-green-800 underline"
                >
                  darren@portalhomehub.com
                </a>
              </p>
              <p>
                <span className="font-medium">WhatsApp:</span>{' '}
                <a
                  href="https://wa.me/14045125139"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-800 underline"
                >
                  +1 404-512-5139
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
