import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppProviders } from "@/providers/AppProviders";
import { CountryThemeProvider } from "@/components/CountryThemeProvider";
import { getCountryFromHeaders } from "@/lib/country-detection";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountryFromHeaders();
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  const siteName = country === 'JM' ? 'Jamaica Home Hub' : 'Guyana Home Hub';
  const description = country === 'JM' 
    ? 'Your Gateway to Jamaica Real Estate' 
    : 'Your Gateway to Guyana Real Estate';
  
  return {
    title: siteName,
    description: description,
    icons: {
      icon: "/favicon.ico",
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
    },
    openGraph: {
      title: siteName,
      description: description,
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const country = await getCountryFromHeaders();
  
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <CountryThemeProvider initialCountry={country}>
          <AppProviders>
            <Navbar />
            {children}
            <Footer />
          </AppProviders>
        </CountryThemeProvider>
      </body>
    </html>
  );
}

