import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppProviders } from "@/providers/AppProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });



export const metadata: Metadata = {
  title: "Guyana Home Hub",
  description: "Your Gateway to Guyana Real Estate",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "facebook-domain-verification": "f6dqrciz798c8xtuauxdmdquuq1g0y",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <AppProviders>
          <Navbar />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}

