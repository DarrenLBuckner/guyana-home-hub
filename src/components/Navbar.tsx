// src/components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600">
            Guyana Home Hub
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <Link href="/properties/buy" className="hover:text-green-600">
            Buy
          </Link>
          <Link href="/properties/rent" className="hover:text-green-600">
            Rent
          </Link>
          <Link
            href="/properties/developments"
            className="hover:text-green-600"
          >
            Developments
          </Link>

          {/* Desktop "List Property" Dropdown */}
          <div className="relative group">
            <button className="hover:text-green-600 font-medium">
              List Property ▼
            </button>
            <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href="/list-owner"
                className="block px-4 py-2 hover:bg-gray-50"
              >
                List My Home
              </Link>
              <Link
                href="/list-agent"
                className="block px-4 py-2 hover:bg-gray-50"
              >
                Agents Only
              </Link>
              <Link
                href="/list-rental"
                className="block px-4 py-2 hover:bg-gray-50"
              >
                List My Rental
              </Link>
            </div>
          </div>
          
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/signin" className="hover:text-green-600">
            Sign In
          </Link>
          <Link
            href="/advertise"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
          >
            Advertise
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2">
          <Link
            href="/"
            className="block text-green-700 hover:text-green-800"
          >
            Home
          </Link>
          <Link
            href="/properties/buy"
            className="block text-green-700 hover:text-green-800"
          >
            Buy
          </Link>
          <Link
            href="/properties/rent"
            className="block text-green-700 hover:text-green-800"
          >
            Rent
          </Link>
          <Link
            href="/properties/developments"
            className="block text-green-700 hover:text-green-800"
          >
            Developments
          </Link>

          <div className="pt-2 border-t border-gray-200">
            <span className="block font-semibold text-green-700">
              List Property
            </span>
            <Link
              href="/list-owner"
              className="block pl-4 text-green-700 hover:text-green-800"
            >
              List My Home
            </Link>
            <Link
              href="/list-agent"
              className="block pl-4 text-green-700 hover:text-green-800"
            >
              Agents Only
            </Link>
            <Link
              href="/list-rental"
              className="block pl-4 text-green-700 hover:text-green-800"
            >
              List My Rental
            </Link>
          </div>

          <Link
            href="/signin"
            className="block text-green-700 hover:text-green-800"
          >
            Sign In
          </Link>
          <Link
  href="/contact"
  className="block text-green-700 hover:text-green-800"
>  Contact Us
</Link>
          <Link href="/advertise" className="block">
            <button className="w-full bg-green-600 text-white py-2 rounded-md">
              Advertise
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
