"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import BrowsePropertiesCards from "../components/BrowsePropertiesCards";
import ListYourPropertyCards from "../components/ListYourPropertyCards";
import Image from "next/image";

export default function HomePage() {
  const [showBrowseCards, setShowBrowseCards] = useState(false);
  const [showListCards, setShowListCards] = useState(false);

  return (
    <div>
      <Navbar />

      <main className="min-h-screen bg-green-700 flex flex-col items-center justify-start pt-12 pb-24 px-4">
        <div className="relative z-10 flex flex-col items-center text-center text-white max-w-4xl drop-shadow-xl">
          {/* Logo */}
          <Image
            src="/images/ghh-logo.png"
            alt="Guyana Home Hub Logo"
            width={150}
            height={150}
            className="object-contain mb-4 w-36 h-36"
          />

          {/* Hero Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Welcome to <span className="text-yellow-400">The Real Guyana Hub</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl mb-8">
            Your gateway to Guyana real estate. Connecting properties across Georgetown, East Coast Demerara, and beyond with buyers worldwide.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setShowBrowseCards(true);
                setShowListCards(false);
              }}
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition"
            >
              Browse Properties
            </button>

            <button
              onClick={() => {
                setShowListCards(true);
                setShowBrowseCards(false);
              }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-700 transition"
            >
              List Your Property
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-yellow-400">500+</h3>
              <p className="text-lg">Properties Listed</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-yellow-400">50+</h3>
              <p className="text-lg">Professional Agents</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-yellow-400">1000+</h3>
              <p className="text-lg">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Card Sections */}
        <section className="mt-12 w-full max-w-6xl">
          {showBrowseCards && <BrowsePropertiesCards />}
          {showListCards && <ListYourPropertyCards />}
        </section>
      </main>
    </div>
  );
}
