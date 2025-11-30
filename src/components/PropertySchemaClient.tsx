'use client'

import { useEffect } from 'react'

interface PropertySchemaClientProps {
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

export default function PropertySchemaClient({ property }: PropertySchemaClientProps) {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const siteName = 'Guyana Home Hub';
    const countryName = 'Guyana';
    const baseUrl = 'https://guyanahomehub.com';
    
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
        "priceCurrency": property.currency || 'GYD',
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

    // Function to add script to head
    const addSchemaScript = (schema: any, id: string) => {
      // Remove existing script if present
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }

      // Add new script
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    // Add all schemas
    addSchemaScript(propertySchema, 'property-schema');
    addSchemaScript(organizationSchema, 'organization-schema');
    addSchemaScript(breadcrumbSchema, 'breadcrumb-schema');

    // Cleanup on unmount
    return () => {
      const propertyScript = document.getElementById('property-schema');
      const orgScript = document.getElementById('organization-schema');
      const breadcrumbScript = document.getElementById('breadcrumb-schema');
      
      if (propertyScript) propertyScript.remove();
      if (orgScript) orgScript.remove();
      if (breadcrumbScript) breadcrumbScript.remove();
    };
  }, [property]);

  // This component doesn't render anything visible
  return null;
}