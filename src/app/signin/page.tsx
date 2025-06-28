"use client";

import Navbar from '@components/layout/Navbar';

import { FaGoogle, FaFacebookF } from "react-icons/fa";

export default function SignInPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-gray-100 py-20 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-green-700">Sign In to Guyana Home Hub</h1>

          <div className="space-y-4">
            {/* Google Sign-In */}
            <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition">
              <FaGoogle />
              Continue with Google
            </button>

            {/* Facebook Sign-In */}
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">
              <FaFacebookF />
              Continue with Facebook
            </button>

            {/* Placeholder for Caribbean login method */}
            <button className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold py-2 rounded hover:bg-gray-900 transition">
              📱 Continue with WhatsApp
            </button>
          </div>

          <div className="text-center text-sm mt-6 text-gray-500">
            Don’t have an account? <a href="#" className="text-green-600 hover:underline">Register</a>
          </div>
        </div>
      </main>
    </div>
  );
}
