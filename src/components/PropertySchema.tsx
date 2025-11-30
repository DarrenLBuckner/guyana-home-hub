import { getCountryFromHeaders } from '@/lib/country-detection';

interface PropertySchemaProps {
  property: {
    id: string;
    title: string;
    description?: string;
    price?: number;
    currency?: string;
    propertyType: 'sale' | 'rent' | 'commercial';
    category?: string;
    location?: string;
    address?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    images?: string[];
    agent?: {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
    };
    features?: string[];
    yearBuilt?: number;
    listingDate?: string;
    listedByType?: 'agent' | 'owner' | 'developer';
  };
}

export default async function PropertySchema({ property }: PropertySchemaProps) {
  const country = await getCountryFromHeaders();
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const baseUrl = country === 'JM' ? 'https://jamaicahomehub.com' : 'https://guyanahomehub.com';
  
  // Determine property schema type based on listing type
  const getSchemaType = () => {
    if (property.propertyType === 'rent') {
      return 'RentAction';
    } else if (property.propertyType === 'commercial') {
      return 'RealEstateListing';
    } else {
      return 'RealEstateListing';
    }
  };

  // Generate comprehensive property schema
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${baseUrl}/properties/${property.id}`,
    "url": `${baseUrl}/properties/${property.id}`,
    "name": property.title,
    "description": property.description,
    "image": property.images || [],
    "datePosted": property.listingDate,
    
    // Price and offer information
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency || (country === 'JM' ? 'JMD' : 'GYD'),
      "availability": "https://schema.org/InStock",
      "validFrom": property.listingDate,
      "seller": {
        "@type": property.agent?.company ? "RealEstateAgent" : "Person",
        "name": property.agent?.name || "Property Owner",
        "email": property.agent?.email,
        "telephone": property.agent?.phone,
        ...(property.agent?.company && { "affiliation": property.agent.company })
      }
    },

    // Property details
    "floorSize": property.area ? {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitText": "square feet"
    } : undefined,

    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "yearBuilt": property.yearBuilt,

    // Location information
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.location,
      "addressCountry": countryName
    },

    // Property category and type
    "category": property.category,
    "additionalType": property.propertyType === 'sale' ? 'PropertyForSale' : 
                     property.propertyType === 'rent' ? 'PropertyForRent' : 
                     'CommercialProperty',

    // Property features
    "amenityFeature": property.features?.map(feature => ({
      "@type": "LocationFeatureSpecification",
      "name": feature
    })),

    // Provider information
    "provider": {
      "@type": "Organization",
      "name": siteName,
      "url": baseUrl,
      "logo": `${baseUrl}/images/logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+592-762-9797",
        "contactType": "Customer Service",
        "availableLanguage": ["English"]
      }
    },

    // Listing agent/owner
    "agent": {
      "@type": property.listedByType === 'agent' ? "RealEstateAgent" : "Person",
      "name": property.agent?.name || "Property Owner",
      "email": property.agent?.email,
      "telephone": property.agent?.phone,
      ...(property.agent?.company && { "affiliation": property.agent.company })
    }
  };

  // Organization schema for the platform
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "alternateName": `${countryName} Home Hub`,
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo.png`,
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+592-762-9797",
        "contactType": "Customer Service",
        "availableLanguage": ["English"],
        "serviceType": "Real Estate Services"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": countryName
    },
    "sameAs": [
      `https://facebook.com/${siteName.replace(' ', '').toLowerCase()}`,
      `https://instagram.com/${siteName.replace(' ', '').toLowerCase()}`,
      `https://twitter.com/${siteName.replace(' ', '').toLowerCase()}`
    ],
    "areaServed": {
      "@type": "Country",
      "name": countryName
    },
    "serviceType": [
      "Real Estate Listings",
      "Property Search",
      "Agent Directory",
      "Property Verification",
      "Real Estate Investment"
    ]
  };

  // Local business schema (if agent has company)
  const localBusinessSchema = property.agent?.company ? {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": property.agent.company,
    "employee": {
      "@type": "Person",
      "name": property.agent.name,
      "email": property.agent.email,
      "telephone": property.agent.phone
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": countryName
    },
    "serviceArea": {
      "@type": "Country",
      "name": countryName
    }
  } : null;

  // Breadcrumb navigation schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Properties",
        "item": `${baseUrl}/properties`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": property.propertyType === 'sale' ? 'For Sale' : 
               property.propertyType === 'rent' ? 'For Rent' : 'Commercial',
        "item": `${baseUrl}/properties/${property.propertyType}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": property.title,
        "item": `${baseUrl}/properties/${property.id}`
      }
    ]
  };

  return (
    <>
      {/* Property Listing Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(propertySchema)
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />

      {/* Local Business Schema (if applicable) */}
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema)
          }}
        />
      )}

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  );
}

// Schema for property search/listing pages
export async function PropertyListingPageSchema({ 
  properties, 
  pageTitle, 
  pageDescription,
  propertyType 
}: { 
  properties: any[],
  pageTitle: string,
  pageDescription: string,
  propertyType: string
}) {
  const country = await getCountryFromHeaders();
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const baseUrl = country === 'JM' ? 'https://jamaicahomehub.com' : 'https://guyanahomehub.com';
  
  const listingPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": `${baseUrl}/properties/${propertyType}`,
    
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": properties.length,
      "itemListElement": properties.map((property, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "RealEstateListing",
          "@id": `${baseUrl}/properties/${property.id}`,
          "url": `${baseUrl}/properties/${property.id}`,
          "name": property.title,
          "offers": {
            "@type": "Offer",
            "price": property.price,
            "priceCurrency": property.currency || (country === 'JM' ? 'JMD' : 'GYD')
          }
        }
      }))
    },

    "provider": {
      "@type": "Organization",
      "name": siteName,
      "url": baseUrl
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(listingPageSchema)
      }}
    />
  );
}

// Schema for agent profile pages
export async function AgentSchema({ agent }: { agent: any }) {
  const country = await getCountryFromHeaders();
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  const baseUrl = country === 'JM' ? 'https://jamaicahomehub.com' : 'https://guyanahomehub.com';
  
  const agentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": agent.name,
    "email": agent.email,
    "telephone": agent.phone,
    "url": `${baseUrl}/agents/${agent.id}`,
    "image": agent.profileImage,
    
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Real Estate Agent",
      "occupationalCategory": "Real Estate"
    },

    "worksFor": agent.company ? {
      "@type": "Organization",
      "name": agent.company,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": countryName
      }
    } : undefined,

    "areaServed": {
      "@type": "Country",
      "name": countryName
    },

    "knowsAbout": [
      "Real Estate",
      `${countryName} Property Market`,
      "Property Investment",
      "Property Valuation"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(agentSchema)
      }}
    />
  );
}