// src/app/contact/page.tsx
"use client";

import Navbar from '../../components/Navbar';





export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Contact Us</h1>

        <form className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows={5}
              placeholder="Your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded"
            ></textarea>
          </div>

          <div className="text-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded">
              Send Message
            </button>
          </div>

          <div className="text-center pt-4">
            <a
              href="https://wa.me/5926231234"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
            >
              Message Us on WhatsApp
            </a>
          </div>
        </form>
      </main>
    </>
  );
}
