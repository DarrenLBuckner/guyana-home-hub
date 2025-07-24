// src/components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to close mobile menu when a link is clicked
  const closeMenu = () => {
    setMenuOpen(false);
  };

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
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            href="/properties/buy"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Buy
          </Link>
          <Link
            href="/properties/rent"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Rent
          </Link>
          <Link
            href="/properties/developments"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Developments
          </Link>

          <Link
            href="/signin"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Sign In
          </Link>
          
          {/* Agent Section in Mobile */}
          <div className="pt-2 border-t border-gray-200 mt-2">
            <div className="text-xs font-semibold text-green-700 mb-1">
              For Agents
            </div>
            <Link
              href="/agent-register"
              className="block text-sm text-green-700 hover:text-green-800 pl-2"
              onClick={closeMenu}
            >
              Agent Registration
            </Link>
            <Link
              href="/agent-login"
              className="block text-sm text-gray-500 hover:text-green-800 pl-2 mt-1"
              onClick={closeMenu}
            >
              Agent Login
            </Link>
          </div>
          
          <Link
            href="/contact"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Contact Us
          </Link>
          <Link href="/advertise" className="block" onClick={closeMenu}>
            <button className="w-full bg-green-600 text-white py-2 rounded-md">
              Advertise
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
