import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountryFromHeaders } from '@/lib/country-detection';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  readTime: string;
  category: string;
  author: string;
  publishedDate: string;
  relatedPosts: Array<{
    slug: string;
    title: string;
    excerpt: string;
  }>;
}

// Blog posts data - in production this would come from a CMS
const blogPostsData: Record<string, BlogPost> = {
  'diaspora-buyer-mistakes': {
    slug: 'diaspora-buyer-mistakes',
    title: 'Top 5 Mistakes Diaspora Buyers Make When Buying Property in Guyana',
    description: 'Learn from the common pitfalls that overseas Guyanese buyers encounter and how to avoid them.',
    readTime: '6 min read',
    category: 'Diaspora Tips',
    author: 'Guyana Home Hub Team',
    publishedDate: 'November 30, 2024',
    content: `
<h1>Top 5 Mistakes Diaspora Buyers Make When Buying Property in Guyana</h1>

<p><em>By Guyana Home Hub Team</em></p>

<p>If you're part of the Guyanese diaspora looking to buy property back home, you're not alone. Thousands of overseas Guyanese are exploring real estate opportunities as the country's economy booms. But without proper guidance, it's easy to make costly mistakes.</p>

<p>Here are the top 5 mistakes we see diaspora buyers make — and how to avoid them.</p>

<h2>1. Sending Money Before Verifying the Property</h2>

<p>This is the biggest mistake, and unfortunately, the most common. Someone sees a listing on Facebook, gets excited about the price, and sends money to a "seller" or "agent" they've never met.</p>

<p><strong>The reality:</strong> In Guyana's informal real estate market, there are people who post listings for properties they don't own. Some collect deposits from multiple buyers for the same property. Others simply disappear with your money.</p>

<p><strong>How to avoid it:</strong> Never send money until you've verified the property exists, the seller actually owns it, and you have a signed Agreement of Sale reviewed by a Guyanese attorney. If you can't visit in person, hire a local attorney to conduct a title search and verify everything before any money changes hands.</p>

<h2>2. Not Hiring a Local Attorney</h2>

<p>Many diaspora buyers try to save money by skipping legal representation. They figure if they trust the agent or the seller is "family," they don't need a lawyer.</p>

<p><strong>The reality:</strong> Property transactions in Guyana require navigating the Deeds Registry, understanding Transport vs. Certificate of Title, checking for liens and encumbrances, and ensuring proper transfer documentation. Without an attorney, you won't know if there are problems until it's too late.</p>

<p><strong>How to avoid it:</strong> Always hire a Guyanese attorney who specializes in property transactions. Yes, it costs money. But compared to losing your entire investment to fraud or title disputes, it's the best money you'll ever spend.</p>

<h2>3. Relying Only on Facebook and WhatsApp Groups</h2>

<p>Social media is where most diaspora buyers start their property search. And while there are legitimate listings on Facebook Marketplace and in WhatsApp groups, there's no verification system. Anyone can post anything.</p>

<p><strong>The reality:</strong> You have no way to verify if the person posting is a real agent, if the property exists, if the photos are current, or if the price is accurate. You're essentially gambling.</p>

<p><strong>How to avoid it:</strong> Use platforms like Guyana HomeHub where agents are verified and listings are connected to real professionals. You can still browse social media for ideas, but don't make decisions or send money based solely on what you see there.</p>

<h2>4. Not Understanding the Two Types of Property Ownership</h2>

<p>Guyana has two property ownership systems: Transport (the traditional Roman-Dutch system) and Certificate of Title (the newer Land Registry system). Many buyers don't understand the difference — or even know there is one.</p>

<p><strong>The reality:</strong> The verification process is different for each system. If you don't know which one applies to the property you're buying, you might miss important steps in due diligence.</p>

<p><strong>How to avoid it:</strong> Ask upfront whether the property is under Transport or Certificate of Title. Your attorney will know how to verify ownership under either system, but you should understand the basics yourself.</p>

<h2>5. Making Decisions Based Solely on Price</h2>

<p>When you're shopping from abroad, it's tempting to jump on what looks like a great deal. "Land for only $5 million GYD? That's so cheap!"</p>

<p><strong>The reality:</strong> There's usually a reason something is priced well below market. The land might have title issues. It might be in a flood zone. There might be boundary disputes with neighbors. Or the "seller" might not actually own it.</p>

<p><strong>How to avoid it:</strong> If a deal looks too good to be true, it probably is. Compare prices across multiple listings. Ask your agent or attorney why a particular property is priced the way it is. Do your due diligence before getting excited about a "bargain."</p>

<h2>The Bottom Line</h2>

<p>Buying property in Guyana from abroad is absolutely possible — and it can be a great investment. But you need to approach it with caution, work with verified professionals, and never skip the legal steps that protect your investment.</p>

<p>At Guyana HomeHub, we're building the infrastructure to make this process safer and more transparent for diaspora buyers. Browse our verified listings, connect with professional agents, and start your property search the right way.</p>
    `,
    relatedPosts: [
      {
        slug: 'real-estate-chaos-costing-millions',
        title: 'The Real Estate Chaos Costing Diaspora Buyers Millions',
        excerpt: 'The exposed underbelly of an emerging real estate market and how to navigate it safely.'
      }
    ]
  },
  'real-estate-chaos-costing-millions': {
    slug: 'real-estate-chaos-costing-millions',
    title: 'The Real Estate Chaos Costing Diaspora Buyers Millions — And How to Avoid It',
    description: 'The exposed underbelly of Guyana\'s emerging real estate market — and what diaspora buyers can do to protect themselves.',
    readTime: '7 min read',
    category: 'Diaspora Buyers',
    author: 'Darren B. (Founder) & Guyana Home Hub Team',
    publishedDate: 'January 21, 2025',
    content: `
<h1>The Real Estate Chaos Costing Diaspora Buyers Millions — And How to Avoid It</h1>

<p>If you're part of the Guyanese diaspora trying to buy property or build back home, you already know the frustration.</p>

<p>You scroll through Facebook Marketplace hoping to find land or a house. You screenshot a listing and send it to a cousin. They make some calls. Someone knows someone. Now you're in a WhatsApp group with a guy who says he's an agent, but you have no way to verify anything — not his credentials, not the property title, not whether the listing is even real.</p>

<p>This is how most diaspora buyers navigate the Guyanese real estate market. And it's costing people money, time, and trust.</p>

<h2>The Pattern of Chaos</h2>

<p>The stories are painfully similar.</p>

<p>Someone finds a "deal" through an informal connection. Money gets sent. Paperwork is vague or missing. Months later, the land has a title dispute. Or the seller wasn't the actual owner. Or the agent disappears. There's no recourse, no accountability, no system.</p>

<p>The same chaos shows up in construction. A diaspora buyer hires someone to build a house for $15 million Guyanese dollars. The money gets sent in chunks. A year later, the foundation is done but the walls aren't finished. The builder says materials cost more than expected. More money gets sent. The project stalls anyway. What was supposed to be a $15 million house is now a $40 million unfinished shell sitting on family land.</p>

<p>This isn't a story about one unlucky person. It's the exposed underbelly of an emerging real estate market that hasn't had the infrastructure to support diaspora buyers — until now.</p>

<h2>Why Guyana HomeHub Exists</h2>

<p>Guyana is booming. Oil money is flowing. Property values are climbing. Diaspora families who left decades ago are looking to come back, invest, or build something for the next generation.</p>

<p>But the market hasn't kept pace. There's no MLS. No centralized listing database. No way to verify agents. No platform where a buyer in Brooklyn or Brampton can search properties, compare options, and connect with vetted professionals — all in one place.</p>

<p>That's the gap Guyana HomeHub was built to fill.</p>

<p>We're creating the infrastructure the market has been missing. A platform where agents are verified. Where listings are real. Where diaspora buyers can search properties from anywhere in the world and connect with professionals who operate with transparency and accountability.</p>

<p>No more scrolling Facebook. No more random WhatsApp groups. No more hoping the person you're sending money to is legitimate.</p>

<h2>Structure Over Chaos</h2>

<p>The common thread when these deals go wrong is the same: lack of structure.</p>

<p>No fixed pricing. No documentation. No clear process. No accountability when things go wrong.</p>

<p>Whether you're buying land, purchasing a home, or building from scratch — the solution is the same. Work with people and platforms that operate professionally.</p>

<p>For those looking to build rather than buy, builders like Quacy Barry's BackHome Developments are raising the standard in Guyana's construction industry. Barry, who spent two decades building high-end homes in Canada before returning to Guyana, offers fixed-price contracts, documented timelines, and a client portal that lets diaspora buyers track their project from anywhere in the world. His free guide, <em>"The Ultimate Guide to Building a Luxury Home in Guyana,"</em> is a solid resource for anyone considering construction — available at <a href="https://backhomedevelopments.com" target="_blank" rel="noopener noreferrer">backhomedevelopments.com</a>.</p>

<p>For those looking to buy property, that's where we come in.</p>

<h2>Your Next Step</h2>

<p>Guyana HomeHub is building the real estate platform the diaspora deserves. Verified agents. Real listings. A professional experience that matches what you'd expect in New York, Toronto, or London — but focused entirely on the Guyanese market.</p>

<p>We're not here to replace the relationships and local knowledge that make Guyana's market unique. We're here to bring structure to it.</p>

<p>If you're a licensed agent ready to operate with that same standard of professionalism, we want to hear from you.</p>

<p>Browse listings. Connect with agents. Start your property search the right way.</p>

<p><strong><a href="https://www.guyanahomehub.com">Visit GuyanaHomeHub.com</a></strong></p>
    `,
    relatedPosts: [
      {
        slug: 'diaspora-buyer-mistakes',
        title: 'Top 5 Mistakes Diaspora Buyers Make When Buying Property in Guyana',
        excerpt: 'Learn from the common pitfalls that overseas Guyanese buyers encounter and how to avoid them.'
      }
    ]
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';

  const post = blogPostsData[params.slug];

  if (!post) {
    return {
      title: `Article Not Found - ${siteName}`,
    };
  }

  return {
    title: `${post.title} | ${siteName} Blog`,
    description: post.description,
    keywords: `${post.category.toLowerCase()}, ${country === 'JM' ? 'Jamaica' : 'Guyana'} real estate, diaspora property buyers`,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';

  const post = blogPostsData[params.slug];

  if (!post) {
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
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": siteName,
              "logo": {
                "@type": "ImageObject",
                "url": `${country === 'JM' ? 'https://jamaicahomehub.com' : 'https://guyanahomehub.com'}/images/logo.png`
              }
            },
            "datePublished": post.publishedDate,
            "dateModified": post.publishedDate
          })
        }}
      />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-4xl mx-auto px-6">
            <nav className="text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="mx-2 text-gray-400">›</span>
              <Link href="/blog" className="text-gray-500 hover:text-gray-700">Blog</Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="text-gray-900 truncate">{post.title}</span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm">{post.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="text-gray-600 mb-6">
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.publishedDate}</span>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed border-l-4 border-green-500 pl-4 italic">
              {post.description}
            </p>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-a:text-green-600 hover:prose-a:text-green-700 prose-p:text-gray-700 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Share this article</h3>
                <p className="text-sm text-gray-500">Help other diaspora buyers avoid these pitfalls</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - ' + 'https://guyanahomehub.com/blog/' + post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://guyanahomehub.com/blog/' + post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {post.relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {post.relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.slug} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-green-600 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{relatedPost.excerpt}</p>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Read Article →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Find Your Property?</h2>
            <p className="text-lg mb-6 opacity-90">
              Browse verified listings from trusted agents and verified owners
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties/buy"
                className="inline-flex items-center justify-center bg-white text-green-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                Browse Properties
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center justify-center border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-green-700 transition-all duration-200"
              >
                Read Our Guides
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
