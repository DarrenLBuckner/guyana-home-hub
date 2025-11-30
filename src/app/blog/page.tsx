import type { Metadata } from 'next';
import Link from 'next/link';
import { getCountryFromHeaders } from '@/lib/country-detection';

export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  
  return {
    title: `Real Estate Blog - ${siteName}`,
    description: `Latest news, market trends, and insights about ${countryName} real estate. Expert analysis for property buyers, sellers, and investors.`,
    keywords: `${countryName} real estate blog, property market news, real estate trends ${countryName}, property investment insights`,
    openGraph: {
      title: `Real Estate Blog - ${siteName}`,
      description: `Latest news and insights about ${countryName} real estate market`,
      type: 'website',
    },
  };
}

// Blog posts data structure - in production this would come from a CMS
const blogPosts = [
  {
    slug: 'diaspora-buyer-mistakes',
    title: 'Top 5 Mistakes Diaspora Buyers Make When Buying Property in Guyana',
    excerpt: 'Learn from the common pitfalls that overseas Guyanese buyers encounter and how to avoid them.',
    readTime: '6 min read',
    category: 'Diaspora Tips',
    publishedDate: 'November 30, 2024',
    featured: true,
    comingSoon: false
  },
  {
    slug: 'market-trends-december-2024',
    title: 'Guyana Property Market Trends - December 2024',
    excerpt: 'Monthly analysis of property prices, demand patterns, and investment opportunities across Guyana.',
    readTime: '8 min read',
    category: 'Market Analysis',
    publishedDate: 'December 1, 2024',
    featured: false,
    comingSoon: true
  },
  {
    slug: 'oil-boom-property-impact',
    title: 'How the Oil Boom is Reshaping Georgetown\'s Property Market',
    excerpt: 'Analysis of how oil industry growth is affecting property values and investment patterns in the capital.',
    readTime: '10 min read',
    category: 'Economic Analysis',
    publishedDate: 'November 25, 2024',
    featured: false,
    comingSoon: true
  }
];

export default async function BlogPage() {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {countryName} Real Estate Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Latest market insights, trends, and expert analysis for property buyers, sellers, and investors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guides"
                className="inline-flex items-center bg-white text-green-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                📚 Property Guides
              </Link>
              <Link
                href="/properties/buy"
                className="inline-flex items-center border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-green-700 transition-all duration-200"
              >
                🏠 Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    Featured
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-gray-500">{featuredPost.readTime}</span>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h3>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Published {featuredPost.publishedDate}
                  </span>
                  
                  {featuredPost.comingSoon ? (
                    <span className="inline-flex items-center text-gray-500 font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Coming Soon
                    </span>
                  ) : (
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Read Full Article
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {post.publishedDate}
                    </span>
                    
                    {post.comingSoon ? (
                      <span className="inline-flex items-center text-gray-500 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Coming Soon
                      </span>
                    ) : (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors text-sm"
                      >
                        Read More
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated on {countryName} Real Estate</h2>
          <p className="text-lg mb-6 opacity-90">
            Get the latest market insights, investment opportunities, and expert analysis delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-green-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm mt-3 opacity-75">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/guides"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Guides</h3>
              <p className="text-gray-600 text-sm">Complete guides for buying, selling, and investing in {countryName} real estate.</p>
            </Link>
            
            <Link
              href="/properties/buy"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Properties</h3>
              <p className="text-gray-600 text-sm">Explore verified property listings from trusted agents and owners.</p>
            </Link>
            
            <a
              href="https://wa.me/5927629797"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Expert Advice</h3>
              <p className="text-gray-600 text-sm">Connect with our real estate experts for personalized assistance.</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}