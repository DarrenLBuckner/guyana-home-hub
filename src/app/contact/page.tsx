// src/app/contact/page.tsx
"use client";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Contact Us</h1>
        
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Get in touch with us for all your real estate needs in Guyana
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-semibold mb-2">
              Email us directly: <a href="mailto:info@guyanahomehub.com" className="underline">info@guyanahomehub.com</a>
            </p>
            <p className="text-green-800 font-semibold">
              Call or text us: <a href="tel:+5927629797" className="underline">+592 762 9797</a>
            </p>
            <p className="text-green-700 text-sm mt-1">
              (WhatsApp available for faster response)
            </p>
          </div>
        </div>

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
              href="https://wa.me/5927629797"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
            >
              Message Us on WhatsApp
            </a>
          </div>
        </form>
      </main>
  );
}
