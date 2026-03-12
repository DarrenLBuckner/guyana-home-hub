"use client";

import Link from "next/link";
import { useCountryTheme } from "@/components/CountryThemeProvider";

export default function Footer() {
  const { theme, country } = useCountryTheme();
  const countryName = country === "JM" ? "Jamaica" : "Guyana";

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* ==================== MAIN FOOTER ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top: Brand + Contact */}
        <div className="mb-12 pb-8 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white mb-2">{theme.name}</h3>
          <p className="text-gray-400 text-sm max-w-md mb-4">
            Your trusted platform for buying, selling, and renting property in {countryName}.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="tel:+5927629797" className="text-gray-400 hover:text-white transition-colors">
              +592 762 9797
            </a>
            <a href="mailto:info@guyanahomehub.com" className="text-gray-400 hover:text-white transition-colors">
              info@guyanahomehub.com
            </a>
            <a
              href="https://wa.me/5927629797"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.101" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Properties */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Properties</h4>
            <ul className="space-y-2.5">
              <li><Link href="/properties/buy" className="text-sm text-gray-400 hover:text-white transition-colors">Buy</Link></li>
              <li><Link href="/properties/rent" className="text-sm text-gray-400 hover:text-white transition-colors">Rent</Link></li>
              <li><Link href="/properties/commercial" className="text-sm text-gray-400 hover:text-white transition-colors">Commercial</Link></li>
              <li><Link href="/properties/developments" className="text-sm text-gray-400 hover:text-white transition-colors">Developments</Link></li>
              <li><Link href="/advertise" className="text-sm text-gray-400 hover:text-white transition-colors">List Your Property</Link></li>
            </ul>
          </div>

          {/* Column 2: Services & Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Services &amp; Tools</h4>
            <ul className="space-y-2.5">
              <li><Link href="/business-directory" className="text-sm text-gray-400 hover:text-white transition-colors">Local Services</Link></li>
              <li><Link href="/mortgage-calculator" className="text-sm text-gray-400 hover:text-white transition-colors">Mortgage Calculator</Link></li>
              <li><Link href="/tools/currency-converter" className="text-sm text-gray-400 hover:text-white transition-colors">Currency Converter</Link></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Learn</h4>
            <ul className="space-y-2.5">
              <li><Link href="/guides" className="text-sm text-gray-400 hover:text-white transition-colors">Property Guides</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog &amp; News</Link></li>
              <li><Link href="/anti-scam-guide" className="text-sm text-gray-400 hover:text-white transition-colors">Anti-Scam Guide</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/safety-tips" className="text-sm text-gray-400 hover:text-white transition-colors">Safety Tips</Link></li>
              <li><Link href="/press" className="text-sm text-gray-400 hover:text-white transition-colors">Press &amp; Media</Link></li>
              <li><Link href="/advertise#agents" className="text-sm text-gray-400 hover:text-white transition-colors">Agent Registration</Link></li>
              <li>
                <a
                  href="https://portalhomehub.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Agent Login (Portal)
                </a>
              </li>
              <li>
                <a
                  href="https://portalhomehub.com/franchise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Franchise Opportunities
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ==================== BOTTOM BAR ==================== */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-xs text-gray-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} {theme.name}. All rights reserved.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> &middot; </span>
              A subsidiary of <strong className="text-gray-400">Caribbean Home Hub LLC</strong>, Missouri, USA.{" "}
              <a
                href="https://portalhomehub.com/admin-login"
                className="text-gray-600 hover:text-gray-500 text-[10px]"
                title="Corporate Access"
                target="_blank"
                rel="noopener noreferrer"
              >
                [CHH-SYS]
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-x-1 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <span>&middot;</span>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
              <span>&middot;</span>
              <Link href="/cookies" className="hover:text-gray-300 transition-colors">Cookies</Link>
              <span>&middot;</span>
              <Link href="/acceptable-use" className="hover:text-gray-300 transition-colors">Acceptable Use</Link>
              <span>&middot;</span>
              <Link href="/professional-services" className="hover:text-gray-300 transition-colors">Service Agreement</Link>
              <span>&middot;</span>
              <Link href="/privacy/delete-request" className="hover:text-gray-300 transition-colors">Delete My Data</Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a
                href="https://facebook.com/guyanahomehub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com/guyanahomehub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/5927629797"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.101" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
