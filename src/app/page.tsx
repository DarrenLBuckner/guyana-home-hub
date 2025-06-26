"use client";

import Navbar from "../components/layout/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />

      <main className="min-h-screen bg-green-700 flex items-center justify-center relative">
        {/* Small flag image in corner */}
        <img
          src="/images/flag-bg.svg"
          alt="Guyana Flag"
          className="absolute top-4 right-4 w-20 h-auto z-10"
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl drop-shadow-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Welcome to <span className="text-yellow-400">Guyana Home Hub</span>
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Your gateway to Guyana real estate. Connecting properties across Georgetown,
            East Coast Demerara, and beyond with buyers worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-700 transition">
              List Your Property
            </button>
          </div>

          <p className="mt-4 text-sm text-white">
            List your property as you have it — no seller fees.
          </p>

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
      </main>
    </div>
  );
}
