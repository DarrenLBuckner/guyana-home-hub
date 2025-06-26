// src/components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-green-600 flex items-center">
            <img src="/images/flag-icon.png" alt="Guyana Flag" className="w-6 h-6 mr-2" />
            Guyana Home Hub
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <Link href="/properties/buy" className="hover:text-green-600">Buy</Link>
            <Link href="/properties/rent" className="hover:text-green-600">Rent</Link>
            <Link href="/properties/developments" className="hover:text-green-600">Developments</Link>

            {/* Dropdown */}
            <div className="relative group">
              <button className="hover:text-green-600 focus:outline-none">List Property ▾</button>
              <div className="absolute left-0 mt-2 w-56 bg-white shadow-md rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 ease-in-out">
                <Link href="/list-owner" className="block px-4 py-2 hover:bg-gray-100">List My Home</Link>
                <Link href="/list-agent" className="block px-4 py-2 hover:bg-gray-100">Agents Only</Link>
                <Link href="/list-rental" className="block px-4 py-2 hover:bg-gray-100">List My Rental</Link>
              </div>
            </div>

            <Link href="/signin" className="hover:text-green-600">Sign In</Link>
            <Link href="/contact" className="hover:text-green-600">Contact Us</Link>
            <Link href="/advertise">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md">
                Advertise
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 bg-white px-4 pb-4">
            <Link href="/" className="block">Home</Link>
            <Link href="/properties/buy" className="block">Buy</Link>
            <Link href="/properties/rent" className="block">Rent</Link>
            <Link href="/properties/developments" className="block">Developments</Link>
            <div>
              <span className="block font-semibold">List Property</span>
              <Link href="/list-owner" className="block pl-4">List My Home</Link>
              <Link href="/list-agent" className="block pl-4">Agents Only</Link>
              <Link href="/list-rental" className="block pl-4">List My Rental</Link>
            </div>
            <Link href="/signin" className="block">Sign In</Link>
            <Link href="/contact" className="block">Contact Us</Link>
            <Link href="/advertise">
              <button className="w-full bg-green-600 text-white py-2 rounded-md mt-2">
                Advertise
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
