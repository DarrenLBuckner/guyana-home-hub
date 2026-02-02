import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Press & Media | Guyana HomeHub',
  description: 'Press resources, media kit, and contact information for journalists covering Guyana HomeHub.',
};

const quickFacts = [
  { label: 'Launched', value: 'January 7, 2026' },
  { label: 'Agents', value: '14' },
  { label: 'Properties Listed', value: '23' },
  { label: 'Website', value: 'guyanahomehub.com' },
];

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

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-700 mb-4">Press & Media</h1>
          <p className="text-lg text-gray-600">
            Resources for journalists and media covering Guyana HomeHub
          </p>
        </div>

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
