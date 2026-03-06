import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppProviders } from "@/providers/AppProviders";
import { CountryThemeProvider } from "@/components/CountryThemeProvider";
import { getCountryFromHeaders } from "@/lib/country-detection";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FacebookPixel from "@/components/FacebookPixel";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { ScrollRestoration } from "@/components/ScrollRestoration";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#059669",
};

export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountryFromHeaders();
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const baseUrl = country === 'JM' ? 'https://www.jamaicahomehub.com' : 'https://www.guyanahomehub.com';

  const description = country === 'JM'
    ? 'Browse verified properties for sale and rent in Jamaica. Trusted agents, real listings, secure transactions. Serving locals and Jamaican diaspora worldwide.'
    : 'Browse verified properties for sale and rent in Guyana. Trusted agents, real listings, secure transactions. Serving locals and Guyanese diaspora worldwide.';

  return {
    title: {
      default: country === 'JM'
        ? 'Jamaica Real Estate | Buy, Sell & Rent Property | Jamaica Home Hub'
        : 'Guyana Real Estate | Buy, Sell & Rent Property | Guyana Home Hub',
      template: `%s | ${siteName}`,
    },
    description: description,
    keywords: `${countryName} real estate, property for sale ${countryName}, ${countryName} homes, diaspora property investment, verified agents ${countryName}, safe property buying, buy property ${countryName}, rent property ${countryName}`,
    icons: {
      icon: "/favicon.ico",
      apple: "/icons/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "GY HomeHub",
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    other: {
      "facebook-domain-verification": "f6dqrciz798c8xtuauxdmdquuq1g0y",
      // Help prevent unwanted Google fragment navigation
      "fragment-redirect": "top",
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    openGraph: {
      title: country === 'JM'
        ? 'Jamaica Real Estate | Buy, Sell & Rent Property | Jamaica Home Hub'
        : 'Guyana Real Estate | Buy, Sell & Rent Property | Guyana Home Hub',
      description: description,
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
      creator: `@${siteName.replace(/ /g, '').toLowerCase()}`,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      other: {
        "facebook-domain-verification": "f6dqrciz798c8xtuauxdmdquuq1g0y",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const country = await getCountryFromHeaders();
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const baseUrl = country === 'JM' ? 'https://www.jamaicahomehub.com' : 'https://www.guyanahomehub.com';

  // Organization schema (RealEstateAgent type for rich results)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": siteName,
    "alternateName": `${countryName} Home Hub`,
    "url": baseUrl,
    "logo": `${baseUrl}/images/ghh-logo.png`,
    "description": `${siteName} is ${countryName}'s trusted online real estate platform. Browse verified properties for sale and rent from professional agents.`,
    "parentOrganization": {
      "@type": "Organization",
      "name": "Caribbean Home Hub, LLC",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Missouri",
        "addressCountry": "US"
      }
    },
    "telephone": "+592-762-9797",
    "email": "info@guyanahomehub.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+592-762-9797",
      "contactType": "Customer Service",
      "availableLanguage": ["English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": countryName
    },
    "areaServed": {
      "@type": "Country",
      "name": countryName
    },
    "sameAs": [
      "https://facebook.com/guyanahomehub",
      "https://instagram.com/guyanahomehub",
    ],
  };

  // WebSite schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/properties?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <Script id="service-worker-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
        {GA_ID && <GoogleAnalytics GA_TRACKING_ID={GA_ID} />}
        {FB_PIXEL_ID && <FacebookPixel pixelId={FB_PIXEL_ID} />}
        <CountryThemeProvider initialCountry={country}>
          <AppProviders>
            <Navbar />
            {children}
            <Footer />
            <FloatingWhatsAppButton />
            <ExitIntentPopup />
            <ScrollRestoration />
          </AppProviders>
        </CountryThemeProvider>
      </body>
    </html>
  );
}
