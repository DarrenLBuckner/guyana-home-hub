'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Free Business Listing Submission Form
 * Simple form for businesses to submit FREE basic text listings
 * Emphasizes the freemium model - free basic listing with upgrade options
 */

interface FreeListingData {
  businessName: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  website?: string;
}

export default function FreeListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FreeListingData>({
    businessName: '',
    category: 'renovations',
    phone: '',
    email: '',
    address: '',
    description: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { value: 'renovations', label: 'Renovations & Repairs' },
    { value: 'electrical', label: 'Electrical & Plumbing' },
    { value: 'interior', label: 'Interior & Furniture' },
    { value: 'landscaping', label: 'Landscaping & Garden' },
    { value: 'building-materials', label: 'Building Materials & Hardware' },
    { value: 'moving-storage', label: 'Moving & Storage' },
    { value: 'cleaning', label: 'Cleaning Services' },
    { value: 'security', label: 'Security & Safety' },
    { value: 'legal-financial', label: 'Legal & Financial' },
    { value: 'insurance', label: 'Insurance & Banking' },
    { value: 'automotive', label: 'Automotive Services' },
    { value: 'health-beauty', label: 'Health & Beauty' },
    { value: 'food-catering', label: 'Food & Catering' },
    { value: 'education', label: 'Education & Training' },
    { value: 'technology', label: 'Technology & IT' },
    { value: 'transportation', label: 'Transportation Services' },
    { value: 'entertainment', label: 'Entertainment & Events' },
    { value: 'other', label: 'Other Services' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/public/services/submit-free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceType: 'free',
          countryCode: 'GY' // Default to Guyana, can be expanded later
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        throw new Error(data.error || 'Failed to submit listing');
      }
    } catch (error) {
      console.error('Error submitting free listing:', error);
      alert('Error submitting your listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎉</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You!
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                Your FREE business listing has been submitted successfully! 
                We'll review it and have it live within 24 hours.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Want More Visibility? 🚀
                </h3>
                <p className="text-blue-700 mb-4">
                  Upgrade to our premium listings for maximum exposure:
                </p>
                <div className="space-y-2 text-sm text-blue-600">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-xs">💳</span>
                    Property-style cards with photos & detailed descriptions
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2 text-xs">⭐</span>
                    Premium banner placement at the top of your category
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push('/advertise')}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Learn About Premium Options
                </button>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => router.push('/business-directory')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  View Business Directory
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              🆓 100% FREE - No Payment Required
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              List Your Business for FREE
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Get your business discovered by thousands of customers in Guyana. 
              Basic listings are completely free - just fill out the form below!
            </p>
            
            {/* Benefits */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">What you get with a FREE listing:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Business name & contact info
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Category listing
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic description
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  placeholder="e.g., ABC Construction Services"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    placeholder="(592) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    placeholder="contact@yourbusiness.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  placeholder="123 Main Street, Georgetown, Guyana"
                />
              </div>

              {/* Website (Optional) */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://www.yourbusiness.com"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  placeholder="Describe your business, services, and what makes you unique..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be your business description that customers see.
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                >
                  {isSubmitting ? 'Submitting...' : '🆓 Submit FREE Listing'}
                </button>
                
                <p className="text-sm text-gray-500 text-center mt-3">
                  No payment required • Live within 24 hours • Upgrade options available later
                </p>
              </div>
            </form>
          </div>

          {/* Upgrade Teaser */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🚀 Want maximum visibility?
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade to premium listings with photos, extended descriptions, and top placement. 
              Perfect for businesses that want to stand out from the competition.
            </p>
            <button 
              onClick={() => router.push('/advertise')}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Learn about premium options →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}