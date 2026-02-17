"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Home, ChevronDown, Filter, Building2, Users, Star } from 'lucide-react';

interface ApiDevelopment {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  developer_name: string | null;
  notable_partners: string | null;
  location_area: string | null;
  city: string | null;
  development_type: string | null;
  total_units: number | null;
  price_from: number | null;
  price_to: number | null;
  currency: string | null;
  status: string | null;
  hero_image: string | null;
  hero_image_mobile: string | null;
  featured: boolean;
}

interface Development {
  id: string;
  title: string;
  tagline: string;
  developerName: string;
  notablePartners: string | null;
  location: string;
  city: string;
  developmentType: string;
  totalUnits: number;
  priceFrom: number;
  priceTo: number;
  currency: string;
  status: string;
  statusLabel: string;
  image: string | null;
  imageMobile: string | null;
  featured: boolean;
  slug: string;
}

const STATUS_MAP: Record<string, string> = {
  pre_construction: 'Pre-Construction',
  under_construction: 'Under Construction',
  selling: 'Now Selling',
  sold_out: 'Sold Out',
  completed: 'Completed',
};

const STATUS_STYLES: Record<string, string> = {
  pre_construction: 'bg-blue-100 text-blue-800',
  under_construction: 'bg-yellow-100 text-yellow-800',
  selling: 'bg-green-100 text-green-800',
  sold_out: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

function mapDevelopment(d: ApiDevelopment): Development {
  const location = [d.location_area, d.city].filter(Boolean).join(', ');
  return {
    id: d.id,
    title: d.name,
    tagline: d.tagline || '',
    developerName: d.developer_name || 'Unknown Developer',
    notablePartners: d.notable_partners,
    location: location || 'Guyana',
    city: d.city || '',
    developmentType: d.development_type || 'Residential',
    totalUnits: d.total_units || 0,
    priceFrom: d.price_from || 0,
    priceTo: d.price_to || 0,
    currency: d.currency || 'USD',
    status: d.status || 'pre_construction',
    statusLabel: STATUS_MAP[d.status || ''] || d.status || 'Coming Soon',
    image: d.hero_image,
    imageMobile: d.hero_image_mobile,
    featured: d.featured,
    slug: d.slug,
  };
}

export default function DevelopmentsPage() {
  const [developmentType, setDevelopmentType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [allDevelopments, setAllDevelopments] = useState<Development[]>([]);
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);

  const developmentTypes = [
    'condominium',
    'townhouse',
    'single_family',
    'mixed_use',
    'gated_community',
    'commercial',
  ];

  const typeLabels: Record<string, string> = {
    condominium: 'Condominium',
    townhouse: 'Townhouse',
    single_family: 'Single Family',
    mixed_use: 'Mixed Use',
    gated_community: 'Gated Community',
    commercial: 'Commercial',
  };

  const statuses = Object.keys(STATUS_MAP);

  const priceRanges = [
    { value: '50000', label: '$50K' },
    { value: '100000', label: '$100K' },
    { value: '150000', label: '$150K' },
    { value: '200000', label: '$200K' },
    { value: '300000', label: '$300K' },
    { value: '500000', label: '$500K' },
    { value: '1000000', label: '$1M+' },
  ];

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Contact for price';
    if (currency === 'GYD') {
      return `GYD ${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const applyFilters = useCallback((devs: Development[]) => {
    let filtered = devs;

    if (developmentType) {
      filtered = filtered.filter(d => d.developmentType === developmentType);
    }
    if (statusFilter) {
      filtered = filtered.filter(d => d.status === statusFilter);
    }
    if (minPrice) {
      filtered = filtered.filter(d => d.priceTo >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(d => d.priceFrom <= Number(maxPrice));
    }

    setDevelopments(filtered);
  }, [developmentType, statusFilter, minPrice, maxPrice]);

  // Fetch all developments on page load
  useEffect(() => {
    async function fetchDevelopments() {
      setLoading(true);
      try {
        const response = await fetch('/api/developments');
        const data = await response.json();

        if (data.success) {
          const mapped = data.developments.map(mapDevelopment);
          setAllDevelopments(mapped);
          setDevelopments(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch developments:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDevelopments();
  }, []);

  // Re-apply filters when filter values change
  useEffect(() => {
    applyFilters(allDevelopments);
  }, [allDevelopments, applyFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(allDevelopments);
  };

  const clearFilters = () => {
    setDevelopmentType('');
    setStatusFilter('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Explore New <span className="text-green-600">Developments</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover premium residential developments across Guyana. From luxury gated communities
              to modern eco-friendly projects, find your perfect new home.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Primary Search Bar */}
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Development Type */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Home className="inline w-4 h-4 mr-1" />
                      Development Type
                    </label>
                    <select
                      value={developmentType}
                      onChange={(e) => setDevelopmentType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                      <option value="">All Types</option>
                      {developmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {typeLabels[type] || type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 className="inline w-4 h-4 mr-1" />
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                      <option value="">All Statuses</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_MAP[status]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range (USD)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                      >
                        <option value="">Min</option>
                        {priceRanges.map((price) => (
                          <option key={price.value} value={price.value}>
                            {price.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                      >
                        <option value="">Max</option>
                        {priceRanges.map((price) => (
                          <option key={price.value} value={price.value}>
                            {price.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                    >
                      <Search className="w-5 h-5" />
                      <span>{loading ? 'Loading...' : 'Search'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                >
                  <Filter className="w-4 h-4" />
                  <span>Advanced Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                {(developmentType || statusFilter || minPrice || maxPrice) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Advanced Filters (placeholder for future fields) */}
              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <p className="text-sm text-gray-500 text-center">
                    More filters coming soon — bedrooms, amenities, and completion date.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading developments...</p>
            </div>
          )}

          {!loading && developments.length === 0 && (
            <div className="text-center text-gray-600 py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No developments found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters to find more developments.
              </p>
            </div>
          )}

          {!loading && developments.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {developments.length} Development{developments.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {developments.map((dev) => (
                  <div key={dev.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Development Image */}
                    <div className="h-48 bg-gray-200 relative">
                      {dev.image || dev.imageMobile ? (
                        <picture>
                          {dev.imageMobile && (
                            <source media="(max-width: 767px)" srcSet={dev.imageMobile} />
                          )}
                          <img
                            src={dev.image || dev.imageMobile || ''}
                            alt={dev.title}
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                          <Building2 className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_STYLES[dev.status] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {dev.statusLabel}
                        </span>
                      </div>
                      {/* Featured Badge */}
                      {dev.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Development Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{dev.title}</h3>
                      {dev.tagline && (
                        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{dev.tagline}</p>
                      )}

                      {/* Notable Partners Badge */}
                      {dev.notablePartners && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            {dev.notablePartners}
                          </span>
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          {dev.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                          {typeLabels[dev.developmentType] || dev.developmentType}
                        </div>
                        {dev.totalUnits > 0 && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                            {dev.totalUnits.toLocaleString()} total units
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          by {dev.developerName}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="font-bold text-green-600">
                            {dev.priceFrom > 0 && dev.priceTo > 0
                              ? `${formatPrice(dev.priceFrom, dev.currency)} - ${formatPrice(dev.priceTo, dev.currency)}`
                              : formatPrice(dev.priceFrom, dev.currency)}
                          </p>
                        </div>
                        <a
                          href={`/properties/developments/${dev.slug}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
