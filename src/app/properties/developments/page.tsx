"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Building2, Users, Star } from 'lucide-react';
import PropertySearchTabs from '@/components/PropertySearchTabs';

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

const typeLabels: Record<string, string> = {
  condominium: 'Condominium',
  townhouse: 'Townhouse',
  single_family: 'Single Family',
  mixed_use: 'Mixed Use',
  gated_community: 'Gated Community',
  commercial: 'Commercial',
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

function DevelopmentsContent() {
  const searchParams = useSearchParams();
  const [allDevelopments, setAllDevelopments] = useState<Development[]>([]);
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);

  // Read filter state from URL params (set by PropertySearchTabs)
  const devType = searchParams.get('devType') || '';
  const selectedTypes = searchParams.get('type')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const searchQuery = searchParams.get('q') || '';

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Contact for price';
    if (currency === 'GYD') {
      return `GYD ${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const applyFilters = useCallback((devs: Development[]) => {
    let filtered = devs;

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(d =>
        selectedTypes.some(t => d.developmentType.toLowerCase().includes(t.toLowerCase()))
      );
    }
    if (minPrice) {
      filtered = filtered.filter(d => d.priceTo >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(d => d.priceFrom <= Number(maxPrice));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.developerName.toLowerCase().includes(q)
      );
    }

    setDevelopments(filtered);
  }, [selectedTypes, minPrice, maxPrice, searchQuery]);

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
        }
      } catch (error) {
        console.error('Failed to fetch developments:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDevelopments();
  }, []);

  // Re-apply filters when URL params change
  useEffect(() => {
    applyFilters(allDevelopments);
  }, [allDevelopments, applyFilters]);

  return (
    <div>
      <main className="min-h-screen bg-white">
        {/* Tabbed Search */}
        <PropertySearchTabs variant="listing" defaultTab="developments" />

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
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_STYLES[dev.status] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {dev.statusLabel}
                        </span>
                      </div>
                      {dev.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{dev.title}</h3>
                      {dev.tagline && (
                        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{dev.tagline}</p>
                      )}
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

export default function DevelopmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading developments...</p>
        </div>
      </div>
    }>
      <DevelopmentsContent />
    </Suspense>
  );
}
