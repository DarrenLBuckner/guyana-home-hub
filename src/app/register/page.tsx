// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [userType, setUserType] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    company: "",
    buyingBudget: "",
    rentalBudget: "",
    promoCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserTypeChange = (value: string) => {
    setUserType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check for elite promo code
      const ELITE_PROMO_CODE = "ELITE-ADMIN-2025-XYZ!@#";
      let agentTier = "basic";
      let promoCodeUsed = null;
      if (formData.promoCode.trim() === ELITE_PROMO_CODE) {
        agentTier = "elite";
        promoCodeUsed = ELITE_PROMO_CODE;
      }

      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_types: userType.join(", "),
            mobile: formData.mobile,
            company: formData.company,
            agent_tier: agentTier,
            promo_code_used: promoCodeUsed,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Success - redirect to signin or show success message
        alert("Registration successful! Please check your email to verify your account.");
        router.push("/signin");
      }
    } catch (err) {
      setError("An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      
      <main className="min-h-screen py-20 px-4 bg-gradient-to-b from-[#c0f0ff] via-[#e5fce0] to-white">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Register with Email
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <input
              type="text"
              name="promoCode"
              placeholder="Promo Code (optional)"
              value={formData.promoCode}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <p className="text-xs text-gray-500 mt-1 mb-2">
              <span className="font-semibold text-green-700">Note:</span> If you have a special promo code, enter it here for instant access to premium features.
            </p>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
              minLength={6}
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />

            <input
              type="text"
              name="company"
              placeholder="Company Name (Optional)"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <p className="text-xs text-gray-500 mt-1 mb-2">
              <span className="font-semibold text-green-700">Note:</span> Providing a business or company name and company email is optional, but applicants with business/company details may receive priority approval.
            </p>

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
                name="buyingBudget"
                placeholder="Your buying budget (GYD)"
                value={formData.buyingBudget}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            )}

            {userType.includes("Renter") && (
              <input
                type="text"
                name="rentalBudget"
                placeholder="Your rental budget (GYD)"
                value={formData.rentalBudget}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Complete Registration"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
