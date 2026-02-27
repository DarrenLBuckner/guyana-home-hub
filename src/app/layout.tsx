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

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#059669",
};

export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountryFromHeaders();
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const description = country === 'JM' 
    ? 'Find verified properties, trusted agents, and secure real estate transactions in Jamaica. Safe property buying for locals and diaspora.' 
    : 'Find verified properties, trusted agents, and secure real estate transactions in Guyana. Safe property buying for locals and diaspora.';
  
  const baseUrl = country === 'JM' ? 'https://jamaicahomehub.com' : 'https://guyanahomehub.com';
  
  return {
    title: siteName,
    description: description,
    keywords: `${countryName} real estate, property for sale ${countryName}, ${countryName} homes, diaspora property investment, verified agents ${countryName}, safe property buying`,
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
      title: siteName,
      description: description,
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: siteName,
      images: [
        {
          url: `${baseUrl}/images/social-share-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${siteName} - Your Gateway to ${countryName} Real Estate`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
      images: [`${baseUrl}/images/social-share-default.jpg`],
      creator: `@${siteName.replace(' ', '').toLowerCase()}`,
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
  
  return (
    <html lang="en">
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
          </AppProviders>
        </CountryThemeProvider>
      </body>
    </html>
  );
}

