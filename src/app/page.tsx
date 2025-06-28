// Trigger rebuild

import Image from 'next/image'
import Navbar from '../components/layout/Navbar'

export default function HomePage() {
  return (
    <div>
      <Navbar />

      <main className="min-h-screen bg-green-700 flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center text-center text-white px-4 max-w-4xl drop-shadow-xl">
          {/* Flag above headline */}
          <img 
  src="/images/flag-bg.png" 
  alt="Guyana Flag"
  width="96"
  height="48"
  className="object-contain mb-4 w-24 h-auto"
/>


          {/* Hero Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Welcome to <span className="text-yellow-400">Guyana Home Hub</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl mb-8">
            Your gateway to Guyana real estate. Connecting properties across Georgetown, East Coast Demerara, and beyond with buyers worldwide.
          </p>

          {/* Primary Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-700 transition">
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
      </main>
    </div>
  )
}
