import { getCountryFromHeaders } from '@/lib/country-detection';

interface SocialMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article' | 'property' | 'agent_profile';
  propertyPrice?: string;
  propertyLocation?: string;
  propertyType?: string;
  agentName?: string;
  publishedTime?: string;
}

export default async function SocialMetaTags({
  title,
  description,
  image,
  imageAlt,
  url,
  type = 'website',
  propertyPrice,
  propertyLocation,
  propertyType,
  agentName,
  publishedTime
}: SocialMetaTagsProps) {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  const baseUrl = country === 'JM' ? 'https://jamaicahomehub.com' : 'https://guyanahomehub.com';
  
  // Default values
  const defaultTitle = `${siteName} - Your Gateway to ${countryName} Real Estate`;
  const defaultDescription = `Find verified properties, trusted agents, and secure real estate transactions in ${countryName}. Safe property buying for locals and diaspora.`;
  const defaultImage = `${baseUrl}/images/social-share-default.jpg`;
  
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalUrl = url || baseUrl;

  return (
    <>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={imageAlt || `${finalTitle} - ${siteName}`} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:locale" content="en_US" />
      
      {/* Enhanced property-specific Open Graph */}
      {type === 'property' && (
        <>
          <meta property="property:price:amount" content={propertyPrice} />
          <meta property="property:price:currency" content={country === 'JM' ? 'JMD' : 'GYD'} />
          <meta property="property:location" content={propertyLocation} />
          <meta property="property:type" content={propertyType} />
          <meta property="property:agent" content={agentName} />
        </>
      )}

      {/* Article-specific Open Graph */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:author" content={siteName} />
          <meta property="article:section" content="Real Estate" />
          <meta property="article:tag" content={`${countryName} Real Estate`} />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={`@${siteName.replace(' ', '').toLowerCase()}`} />
      <meta name="twitter:creator" content={`@${siteName.replace(' ', '').toLowerCase()}`} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={imageAlt || `${finalTitle} - ${siteName}`} />

      {/* WhatsApp-specific optimization */}
      <meta property="whatsapp:title" content={finalTitle} />
      <meta property="whatsapp:description" content={finalDescription} />
      <meta property="whatsapp:image" content={finalImage} />
      
      {/* Additional social platforms */}
      <meta property="linkedin:title" content={finalTitle} />
      <meta property="linkedin:description" content={finalDescription} />
      <meta property="linkedin:image" content={finalImage} />
      
      {/* Rich link preview for messaging apps */}
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="image" content={finalImage} />
      
      {/* Telegram optimization */}
      <meta property="telegram:channel" content={`@${siteName.replace(' ', '').toLowerCase()}`} />
      
      {/* Additional SEO and social signals */}
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="theme-color" content="#15803d" />
      <meta name="msapplication-TileColor" content="#15803d" />
      
      {/* Structured data for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === 'property' ? 'RealEstateListing' : 'WebPage',
            "name": finalTitle,
            "description": finalDescription,
            "image": finalImage,
            "url": finalUrl,
            "provider": {
              "@type": "Organization",
              "name": siteName,
              "url": baseUrl,
              "logo": `${baseUrl}/images/logo.png`,
              "sameAs": [
                `https://facebook.com/${siteName.replace(' ', '').toLowerCase()}`,
                `https://instagram.com/${siteName.replace(' ', '').toLowerCase()}`,
                `https://twitter.com/${siteName.replace(' ', '').toLowerCase()}`
              ]
            },
            ...(type === 'property' && {
              "offers": {
                "@type": "Offer",
                "price": propertyPrice,
                "priceCurrency": country === 'JM' ? 'JMD' : 'GYD'
              },
              "geo": {
                "@type": "GeoCoordinates",
                "addressCountry": countryName
              }
            })
          })
        }}
      />
    </>
  );
}