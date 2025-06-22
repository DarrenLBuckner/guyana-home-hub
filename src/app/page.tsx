import { Navbar } from '@/components/layout/navbar'

export default function HomePage() {
  return (
    <div>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-400">Guyana Home Hub</span>
          </h1>
          <p className="text-xl mb-8">
            Your gateway to Guyana real estate. Connecting properties across Georgetown,
            East Coast Demerara, and beyond with buyers worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600">
              List Your Property
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
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