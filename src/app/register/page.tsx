// src/app/register/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const [userType, setUserType] = useState<string[]>([]);

  const handleUserTypeChange = (value: string) => {
    setUserType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen py-20 px-4 bg-gradient-to-b from-[#c0f0ff] via-[#e5fce0] to-white">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Register with Email
          </h1>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />

            <input
              type="text"
              placeholder="Company Name (Optional)"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />

            <div>
              <p className="font-medium mb-2 text-green-700">What best describes you?</p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Licensed Agent",
                  "For Sale By Owner",
                  "Buyer",
                  "Renter",
                  "Developer",
                  "Just Looking",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      value={label}
                      checked={userType.includes(label)}
                      onChange={() => handleUserTypeChange(label)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional Fields */}
            {userType.includes("Buyer") && (
              <input
                type="text"
                placeholder="Your buying budget (GYD)"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            )}

            {userType.includes("Renter") && (
              <input
                type="text"
                placeholder="Your rental budget (GYD)"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
            >
              Complete Registration
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
