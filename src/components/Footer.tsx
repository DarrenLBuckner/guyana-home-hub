"use client";

import Link from "next/link";
import { useCountryTheme } from "@/components/CountryThemeProvider";

export default function Footer() {
  const { theme, country } = useCountryTheme();
  const countryName = country === 'JM' ? 'Jamaica' : 'Guyana';
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ───────── Column 1 – About ───────── */}
        <div>
          <h4 className="font-bold mb-2" style={{ color: theme.colors.primary }}>{theme.name}</h4>
          <p className="mb-3">
            Your trusted platform for buying, selling, and renting property in
            {countryName}.
          </p>
          <div className="text-sm space-y-1">
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+5927629797" style={{ color: theme.colors.primary }} className="hover:opacity-80">
                +592 762 9797
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@guyanahomehub.com" style={{ color: theme.colors.primary }} className="hover:opacity-80">
                info@guyanahomehub.com
              </a>
            </p>
            <p>
              <a
                href="https://wa.me/5927629797"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-600 hover:text-green-700"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.101"/>
                </svg>
                WhatsApp us for faster response
              </a>
            </p>
          </div>
        </div>

        {/* ───────── Column 2 – Explore ───────── */}
        <div>
          <h4 className="font-bold mb-2 text-green-700">Explore</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/properties/buy" className="hover:text-green-700">
                Buy
              </Link>
            </li>
            <li>
              <Link href="/properties/rent" className="hover:text-green-700">
                Rent
              </Link>
            </li>
            <li>
              <Link
                href="/properties/developments"
                className="hover:text-green-700"
              >
                Developments
              </Link>
            </li>
            <li>
              <Link href="/advertise" className="hover:text-green-700">
                Advertise
              </Link>
            </li>
          </ul>
        </div>

        {/* ───────── Column 3 – Tools ───────── */}
        <div>
          <h4 className="font-bold mb-2 text-green-700">Tools</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/tools/currency-converter" className="hover:text-green-700">
                Currency Converter
              </Link>
              <div className="text-xs text-gray-500 mt-1">
                Convert between GYD, USD, and more
              </div>
            </li>
            <li className="mt-2">
              <Link href="/mortgage-calculator" className="hover:text-green-700">
                Mortgage Calculator
              </Link>
              <div className="text-xs text-gray-500 mt-1">
                Estimate your monthly payments
              </div>
            </li>
          </ul>
        </div>

        {/* ───────── Column 4 – Help / Auth ───────── */}
        <div>
          <h4 className="font-bold mb-2 text-green-700">Help</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/contact" className="hover:text-green-700">
                Contact&nbsp;Us
              </Link>
            </li>
            <li>
              <Link href="/safety-tips" className="hover:text-green-700">
                Safety Tips
              </Link>
            </li>
            <li>
              <a 
                href="https://portalhomehub.com/franchise" 
                className="hover:text-green-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Franchise Opportunities
              </a>
            </li>
            <li>
              <Link href="/register" className="hover:text-green-700">
                Customer Email Registration
              </Link>
              <div className="text-xs text-gray-500 mt-1">
                Register your email for a personalized experience.
              </div>
            </li>
            <li className="mt-2 pt-2 border-t border-gray-300">
              <div className="text-xs font-semibold text-green-700 mb-1">
                For Agents
              </div>
              <Link
                href="/advertise#agents"
                className="text-sm hover:text-green-700 block"
              >
                Agent Registration
              </Link>
              <a
                href="https://portalhomehub.com/login"
                className="text-sm text-gray-500 hover:text-green-700 block mt-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Agent Login (Portal)
              </a>
            </li>
            <li className="mt-4">
              <Link href="/press" className="hover:text-green-700">
                Press & Media
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-green-700">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-green-700">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/acceptable-use" className="hover:text-green-700">
                Acceptable Use Policy
              </Link>
            </li>
            <li>
              <Link href="/professional-services" className="hover:text-green-700">
                Service Agreement
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-green-700">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} {theme.name}. All rights reserved.
        <br />
        A subsidiary of <strong>Caribbean Home Hub LLC</strong>, a registered company in Missouri, USA.{" "}
        <a 
          href="https://portalhomehub.com/admin-login" 
          className="text-gray-400 hover:text-gray-500 text-xs"
          title="Corporate Access"
          target="_blank"
          rel="noopener noreferrer"
        >
          [CHH-SYS]
        </a>
      </div>
    </footer>
  );
}
