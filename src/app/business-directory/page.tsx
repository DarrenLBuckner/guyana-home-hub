'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemandCaptureForm from '@/components/DemandCaptureForm';
import { useCountryTheme } from '@/components/CountryThemeProvider';

/**
 * Business Directory Page
 * A comprehensive directory of real estate-related businesses in Guyana
 * Features tiered advertising: Premium Banners → Property Cards → Listings
 */

interface BusinessListing {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  website?: string;
  address?: string;
  image?: string;
  adType: 'premium-banner' | 'property-card' | 'listing';
  featured: boolean;
  verified: boolean;
}

interface DirectoryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  businessCount: number;
}

const directoryCategories: DirectoryCategory[] = [
  {
    id: 'real-estate-agents',
    name: 'Real Estate Agents',
    icon: '🏠',
    description: 'Licensed real estate agents and property brokers',
    businessCount: 0
  },
  {
    id: 'renovations',
    name: 'Renovations & Repairs',
    icon: '🔨',
    description: 'Home renovations, repairs, and general contracting services',
    businessCount: 0
  },
  {
    id: 'electrical',
    name: 'Electrical & Plumbing',
    icon: '⚡',
    description: 'Licensed electricians, plumbers, and utility services',
    businessCount: 0
  },
  {
    id: 'interior',
    name: 'Interior & Furniture',
    icon: '🛋️',
    description: 'Interior design, furniture, and home decor specialists',
    businessCount: 0
  },
  {
    id: 'landscaping',
    name: 'Landscaping & Garden',
    icon: '🌿',
    description: 'Landscaping, gardening, and outdoor design services',
    businessCount: 0
  },
  {
    id: 'building-materials',
    name: 'Building Materials & Hardware',
    icon: '🧱',
    description: 'Construction materials, hardware stores, and supplies',
    businessCount: 0
  },
  {
    id: 'moving-storage',
    name: 'Moving & Storage',
    icon: '📦',
    description: 'Moving services, storage facilities, and logistics',
    businessCount: 0
  },
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    icon: '🧽',
    description: 'House cleaning, commercial cleaning, and maintenance',
    businessCount: 0
  },
  {
    id: 'security',
    name: 'Security & Safety',
    icon: '🔐',
    description: 'Security systems, alarm services, and safety equipment',
    businessCount: 0
  },
  {
    id: 'legal-financial',
    name: 'Legal & Financial',
    icon: '⚖️',
    description: 'Real estate lawyers, notaries, and financial advisors',
    businessCount: 0
  },
  {
    id: 'insurance',
    name: 'Insurance & Banking',
    icon: '🏛️',
    description: 'Insurance providers, mortgage brokers, and banking services',
    businessCount: 0
  },
  {
    id: 'inspection',
    name: 'Inspection Services',
    icon: '🔍',
    description: 'Property inspections, surveying, and assessment services',
    businessCount: 0
  },
  {
    id: 'general-contractors',
    name: 'General Contractors',
    icon: '👷',
    description: 'Licensed general contractors and construction companies',
    businessCount: 0
  }
];

export default function BusinessDirectoryPage() {
  const { country } = useCountryTheme();
  const [businesses, setBusinesses] = useState<BusinessListing[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, [selectedCategory, country]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      
      // Get Portal Home Hub base URL (use www to avoid redirect stripping CORS)
      const portalBaseUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.portalhomehub.com'
        : (process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://www.portalhomehub.com');
      
      // Fetch business directory listings (use dynamic country code)
      const url = selectedCategory === 'all'
        ? `${portalBaseUrl}/api/public/services/${country}?type=directory`
        : `${portalBaseUrl}/api/public/services/${country}?type=directory&category=${selectedCategory}`;
        
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
        // Update category counts from API response
        if (data.categories) {
          const counts: Record<string, number> = {};
          for (const cat of data.categories) {
            counts[cat.id] = cat.count;
          }
          setCategoryCounts(counts);
        }
      } else {
        // For now, show empty state
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const premiumBanners = filteredBusinesses.filter(b => b.adType === 'premium-banner');
  const propertyCards = filteredBusinesses.filter(b => b.adType === 'property-card');
  const listings = filteredBusinesses.filter(b => b.adType === 'listing');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-green-600 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold sm:text-5xl lg:text-6xl"
            >
              Find Trusted Professionals in Guyana
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xl text-blue-100 sm:text-2xl"
            >
              Connect with verified contractors, lawyers, and service providers — whether you're local or abroad.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <p className="text-blue-100 mb-2">Own a business?</p>
              <Link
                href="/business-directory/list-your-business"
                className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
              >
                List Your Business - Free
                <span>&rarr;</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
              >
                <option value="all">All Categories</option>
                {directoryCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
          <p className="mt-4 text-xl text-gray-600">
            Find trusted professionals for every real estate need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {directoryCategories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`cursor-pointer rounded-xl p-6 text-center transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-900 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className={`text-sm ${
                selectedCategory === category.id ? 'text-blue-100' : 'text-gray-600'
              }`}>
                {category.description}
              </p>
              <div className={`mt-2 text-sm font-medium ${
                selectedCategory === category.id ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {categoryCounts[category.id] || 0} businesses
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Banners */}
        {premiumBanners.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-3">
                ⭐ Featured
              </span>
              Premium Partners
            </h3>
            <div className="space-y-4">
              {premiumBanners.map((business) => (
                <div key={business.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    {business.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src={business.image}
                          alt={business.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{business.name}</h4>
                      <p className="text-gray-600 mb-4">{business.description}</p>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <span className="text-blue-600 font-medium">📞 {business.phone}</span>
                        <span className="text-blue-600 font-medium">✉️ {business.email}</span>
                        {business.website && (
                          <a href={business.website} className="text-blue-600 font-medium hover:underline">
                            🌐 Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property-Style Cards */}
        {propertyCards.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Businesses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyCards.map((business) => (
                <div key={business.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {business.image && (
                    <div className="h-48 relative">
                      <Image
                        src={business.image}
                        alt={business.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{business.name}</h4>
                      {business.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{business.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">📞</span>
                        <span>{business.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">✉️</span>
                        <span className="truncate">{business.email}</span>
                      </div>
                      {business.address && (
                        <div className="flex items-center text-gray-700">
                          <span className="mr-2">📍</span>
                          <span>{business.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simple Listings */}
        {listings.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Listings</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {listings.map((business) => (
                  <div key={business.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold text-gray-900">{business.name}</h4>
                          {business.verified && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{business.description}</p>
                      </div>
                      <div className="flex flex-col sm:text-right mt-2 sm:mt-0 text-sm">
                        <span className="text-blue-600 font-medium">📞 {business.phone}</span>
                        <span className="text-gray-500">{business.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBusinesses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedCategory !== 'all'
                ? `No ${directoryCategories.find(c => c.id === selectedCategory)?.name} businesses listed yet`
                : 'No businesses listed yet'
              }
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Be one of the first! Property buyers and diaspora are actively searching.
            </p>
            <div className="mb-12">
              <Link
                href="/business-directory/list-your-business"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
              >
                List Your Business - Free
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-8 max-w-xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-2">
                Looking for a {selectedCategory !== 'all'
                  ? directoryCategories.find(c => c.id === selectedCategory)?.name
                  : 'service provider'}?
              </h4>
              <p className="text-gray-600 mb-4">
                We'll notify you when businesses join.
              </p>
              <DemandCaptureForm
                preselectedCategory={
                  selectedCategory !== 'all'
                    ? directoryCategories.find(c => c.id === selectedCategory)?.name
                    : undefined
                }
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-solid border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading businesses...</p>
          </div>
        )}
      </div>
    </div>
  );
}