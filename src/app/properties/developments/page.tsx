"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Home, Calendar, ChevronDown, Filter, Building2, Users, Clock } from 'lucide-react';

interface Development {
  id: string;
  title: string;
  description: string;
  location: string;
  region: string;
  developmentName: string;
  developmentType: string;
  developerName: string;
  completionStatus: string;
  totalUnits: number;
  availableUnits: number;
  expectedCompletion: string;
  amenities: string[];
  priceRange: {
    min: number;
    max: number;
  };
  images: string[];
  bedrooms: number;
  bathrooms: number;
  features: string[];
  createdAt: string;
}

export default function DevelopmentsPage() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [developmentType, setDevelopmentType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [completionStatus, setCompletionStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const regions = [
    'Region 1 (Barima-Waini)',
    'Region 2 (Pomeroon-Supenaam)',
    'Region 3 (Essequibo Islands-West Demerara)',
    'Region 4 (Demerara-Mahaica)',
    'Region 5 (Mahaica-Berbice)',
    'Region 6 (East Berbice-Corentyne)',
    'Region 7 (Cuyuni-Mazaruni)',
    'Region 8 (Potaro-Siparuni)',
    'Region 9 (Upper Takutu-Upper Essequibo)',
    'Region 10 (Upper Demerara-Berbice)'
  ];

  const developmentTypes = [
    'Gated Community',
    'Luxury Villas',
    'Townhouses',
    'Condominiums',
    'Mixed-Use Development',
    'Waterfront Development',
    'Golf Course Community',
    'Eco-Friendly Development'
  ];

  const completionStatuses = [
    'planning',
    'pre-launch',
    'under-construction',
    'ready-to-move',
    'completed'
  ];

  const priceRanges = [
    { value: '5000000', label: 'GYD 5M' },
    { value: '10000000', label: 'GYD 10M' },
    { value: '20000000', label: 'GYD 20M' },
    { value: '50000000', label: 'GYD 50M' },
    { value: '100000000', label: 'GYD 100M' },
    { value: '200000000', label: 'GYD 200M' },
    { value: '500000000', label: 'GYD 500M+' }
  ];

  const searchDevelopments = async () => {
    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const params = new URLSearchParams();
      if (selectedRegion) params.append('region', selectedRegion);
      if (developmentType) params.append('development_type', developmentType);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      if (bedrooms) params.append('bedrooms', bedrooms);
      if (bathrooms) params.append('bathrooms', bathrooms);
      if (completionStatus) params.append('completion_status', completionStatus);

      const response = await fetch(`/api/developments?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setDevelopments(data.developments);
      } else {
        console.error('Search failed:', data.error);
        setDevelopments([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setDevelopments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDevelopments();
  };

  const formatPrice = (price: number) => {
    return `GYD ${(price / 1000000).toFixed(1)}M`;
  };

  const formatCompletionStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Load initial developments on page load
  useEffect(() => {
    searchDevelopments();
  }, []);

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
                  {/* Region Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Region or Area
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                      <option value="">All Regions</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

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
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                      >
                        <option value="">Min Price</option>
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
                        <option value="">Max Price</option>
                        {priceRanges.map((price) => (
                          <option key={price.value} value={price.value}>
                            {price.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                    >
                      <Search className="w-5 h-5" />
                      <span>{loading ? 'Searching...' : 'Search'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                >
                  <Filter className="w-4 h-4" />
                  <span>Advanced Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      >
                        <option value="">Any</option>
                        <option value="1">1+ Bedroom</option>
                        <option value="2">2+ Bedrooms</option>
                        <option value="3">3+ Bedrooms</option>
                        <option value="4">4+ Bedrooms</option>
                        <option value="5">5+ Bedrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <select
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      >
                        <option value="">Any</option>
                        <option value="1">1+ Bathroom</option>
                        <option value="2">2+ Bathrooms</option>
                        <option value="3">3+ Bathrooms</option>
                        <option value="4">4+ Bathrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        Completion Status
                      </label>
                      <select 
                        value={completionStatus}
                        onChange={(e) => setCompletionStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      >
                        <option value="">All Projects</option>
                        {completionStatuses.map((status) => (
                          <option key={status} value={status}>
                            {formatCompletionStatus(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
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
              <p className="text-gray-600">Searching developments...</p>
            </div>
          )}

          {!loading && searchPerformed && developments.length === 0 && (
            <div className="text-center text-gray-600 py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No developments found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search filters to find more developments.
              </p>
            </div>
          )}

          {!loading && !searchPerformed && (
            <div className="text-center text-gray-600">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Start Your Search
              </h3>
              <p className="text-gray-600">
                Use the filters above to discover amazing new developments in your preferred region.
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
                      {dev.images && dev.images.length > 0 ? (
                        <img
                          src={dev.images[0]}
                          alt={dev.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          dev.completionStatus === 'ready-to-move' ? 'bg-green-100 text-green-800' :
                          dev.completionStatus === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                          dev.completionStatus === 'pre-launch' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {formatCompletionStatus(dev.completionStatus)}
                        </span>
                      </div>
                    </div>

                    {/* Development Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{dev.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{dev.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {dev.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="w-4 h-4 mr-2" />
                          {dev.developmentType}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          {dev.availableUnits} of {dev.totalUnits} units available
                        </div>
                        {dev.expectedCompletion && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            Expected: {new Date(dev.expectedCompletion).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Price Range</p>
                          <p className="font-bold text-green-600">
                            {formatPrice(dev.priceRange.min)} - {formatPrice(dev.priceRange.max)}
                          </p>
                        </div>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
                          View Details
                        </button>
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

