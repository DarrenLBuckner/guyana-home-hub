"use client";

import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-emerald-100 to-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-6">Sign In</h1>

        <div className="space-y-4">
          <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">
            Continue with Google
          </button>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Continue with Facebook
          </button>
          <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
            Continue with WhatsApp
          </button>
        </div>

        {/* Optional: Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Register with Email */}
        <Link href="/register">
          <button className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition">
            Register with Email
          </button>
        </Link>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link href="/signin" className="text-green-700 underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
