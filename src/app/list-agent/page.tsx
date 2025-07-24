// src/app/list-agent/page.tsx
"use client";

import { Check, Star, Zap, Crown } from 'lucide-react';
import { CurrencyFormatter } from '@/lib/currency';

export default function ListAgentPage() {
  const plans = [
    {
      name: "Basic Agent",
      price: 6000,
      period: "/ month",
      description: "Perfect for new agents getting started",
      icon: <Star className="h-8 w-8 text-blue-600" />,
      color: "blue",
      features: [
        "Up to 5 listings",
        "8 photos per listing",
        "30 days per listing",
        "Basic support (email only)",
        "Standard listing placement",
        "Basic agent profile"
      ],
      buttonText: "Start Basic Plan",
      popular: false
    },
    {
      name: "Pro Agent",
      price: 11000,
      period: "/ month",
      description: "Best value for growing agents",
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      color: "yellow",
      features: [
        "Up to 20 listings",
        "15 photos per listing",
        "90 days per listing at no extra cost",
        "Priority support",
        "Highlighted listings",
        "Enhanced agent profile",
        "Lead notifications",
        "Basic analytics"
      ],
      buttonText: "Choose Pro Plan",
      popular: true
    },
    {
      name: "Elite Agent",
      price: 25000,
      period: "/ month",
      description: "Premium features for top performers",
      icon: <Crown className="h-8 w-8 text-purple-600" />,
      color: "purple",
      features: [
        "Unlimited active listings*",
        "Up to 20 photos per listing",
        "180 days per listing",
        "Premium top visibility placement",
        "Enhanced analytics & insights",
        "Exclusive lead generation tools",
        "24/7 priority support",
        "Custom branding options",
        "Featured agent badge"
      ],
      buttonText: "Go Elite",
      popular: false
    }
  ];

  const getCardClasses = (plan: typeof plans[0]) => {
    const baseClasses = "relative p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl";
    
    if (plan.popular) {
      return `${baseClasses} border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 scale-105`;
    }
    
    return `${baseClasses} border border-gray-200 bg-white hover:border-gray-300`;
  };

  const getButtonClasses = (plan: typeof plans[0]) => {
    const baseClasses = "w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300";
    
    switch (plan.color) {
      case "blue":
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
      case "yellow":
        return `${baseClasses} bg-yellow-600 text-white hover:bg-yellow-700`;
      case "purple":
        return `${baseClasses} bg-purple-600 text-white hover:bg-purple-700`;
      default:
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700`;
    }
  };

  return (
    <div>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-20 px-4">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Join Our Premier Agent Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan to showcase your properties and grow your real estate business in Guyana. 
            Start with our 3-month free trial on any plan!
          </p>
          <div className="inline-block bg-green-100 border border-green-300 rounded-full px-6 py-2">
            <span className="text-green-800 font-semibold">🎉 Free for up to 3 months!</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={plan.name} className={getCardClasses(plan)}>
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    G${plan.price.toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-600">
                    {CurrencyFormatter.compact(plan.price).split(' ').slice(1).join(' ')}
                  </div>
                  <div className="text-gray-600 mt-1">{plan.period}</div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className={getButtonClasses(plan)}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Benefits Section */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Guyana Home Hub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Market Leader</h3>
              <p className="text-gray-600">
                The most trusted real estate platform connecting Guyanese locals and diaspora worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Lead Generation</h3>
              <p className="text-gray-600">
                Connect with qualified buyers and sellers actively looking for properties in your area.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Tools</h3>
              <p className="text-gray-600">
                Advanced analytics, marketing tools, and professional support to grow your business.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Grow Your Real Estate Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of successful agents already using Guyana Home Hub to close more deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition">
              Start Free Trial
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition">
              Schedule Demo
            </button>
          </div>
        </div>

        {/* Fair Use Policy */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-gray-800 mb-3">Fair Use Policy & Terms:</p>
            <p>
              <span className="font-medium">*Unlimited Active Listings:</span> Subject to our fair use policy. 
              We reserve the right to review accounts with excessive listings to ensure platform quality. 
              Typical active inventory ranges from 15-40 properties per agent.
            </p>
            <p>
              <span className="font-medium">No Duplicate Listings:</span> Each property can only be listed once on the platform. 
              Agents cannot repost existing listings from other agents or property owners to gain additional visibility. 
              All listings must be exclusive or properly authorized by the property owner.
            </p>
            <p>
              <span className="font-medium">Photo Quality:</span> All uploaded photos must meet our quality standards. 
              Blurry, duplicate, or inappropriate images may be removed.
            </p>
            <p>
              <span className="font-medium">Listing Standards:</span> All properties must be legitimate, available, 
              and accurately described. Agents must have proper authorization to list each property.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
