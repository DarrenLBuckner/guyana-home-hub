"use client";

import { useState } from "react";
import HeroWithSearch from "../components/HeroWithSearch";
import BrowsePropertiesCards from "../components/BrowsePropertiesCards";
import ListYourPropertyCards from "../components/ListYourPropertyCards";

export default function HomePage() {
  const [showBrowseCards, setShowBrowseCards] = useState(false);
  const [showListCards, setShowListCards] = useState(false);

  return (
    <div>
      <HeroWithSearch />

      <main className="min-h-screen bg-white flex flex-col items-center justify-start pt-12 pb-24 px-4">
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setShowBrowseCards(true);
              setShowListCards(false);
            }}
            className="bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition"
          >
            Browse Properties
          </button>

          <button
            onClick={() => {
              setShowListCards(true);
              setShowBrowseCards(false);
            }}
            className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 hover:text-white transition"
          >
            List Your Property
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-gray-700 mb-12">
          <div>
            <h3 className="text-4xl font-bold text-green-700">500+</h3>
            <p className="text-lg">Properties Listed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-green-700">50+</h3>
            <p className="text-lg">Professional Agents</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-green-700">1000+</h3>
            <p className="text-lg">Happy Customers</p>
          </div>
        </div>

        {/* Card Sections */}
        <section className="w-full max-w-6xl">
          {showBrowseCards && <BrowsePropertiesCards />}
          {showListCards && <ListYourPropertyCards />}
        </section>
      </main>
    </div>
  );
}
