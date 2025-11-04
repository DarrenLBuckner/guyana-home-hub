'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Universal Ad Display Component for Guyana Home Hub
 * Fetches and displays ads from Portal Home Hub API
 */

interface Ad {
  id: string;
  campaign_id: string;
  creative_id: string;
  placement_id: string;
  
  // Ad content
  headline: string;
  description: string;
  call_to_action: string;
  destination_url: string;
  image_url: string | null;
  html_content: string | null;
  
  // Display specs
  width: number | null;
  height: number | null;
  creative_type: string;
  
  // Campaign info
  campaign_name: string;
  advertiser_company: string;
  
  // Tracking
  impression_url: string;
  click_url: string;
}

interface AdDisplayProps {
  placement: string; // Placement slug like 'gy-home-hero', 'gy-search-sidebar'
  pageType?: string; // home, search, property-detail, listings
  propertyType?: string; // residential, commercial, land, rental
  priceRange?: string; // min-max format
  city?: string;
  className?: string;
  maxAds?: number;
  fallbackContent?: React.ReactNode;
  
  // Display customization
  showAdvertiserName?: boolean;
  compactMode?: boolean;
}

export default function AdDisplay({
  placement,
  pageType,
  propertyType,
  priceRange,
  city,
  className = '',
  maxAds = 1,
  fallbackContent = null,
  showAdvertiserName = false,
  compactMode = false
}: AdDisplayProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAds();
  }, [placement, pageType, propertyType, priceRange, city, maxAds]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get Portal API URL from environment
      const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'http://localhost:3000';
      
      // Build query parameters
      const params = new URLSearchParams({
        placement,
        limit: maxAds.toString()
      });

      if (pageType) params.append('page_type', pageType);
      if (propertyType) params.append('property_type', propertyType);
      if (priceRange) params.append('price_range', priceRange);
      if (city) params.append('city', city);

      // Add current page info for tracking
      params.append('page_url', window.location.href);
      if (window.location.pathname.includes('/properties/')) {
        const propertyId = window.location.pathname.split('/').pop();
        if (propertyId) params.append('property_id', propertyId);
      }

      const response = await fetch(`${portalApiUrl}/api/public/ads/GY?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ads');
      }

      const data = await response.json();
      setAds(data.ads || []);

    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load ads');
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = (ad: Ad) => {
    // Track click by navigating to the Portal click tracking URL
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'http://localhost:3000';
    window.open(`${portalApiUrl}${ad.click_url}`, '_blank', 'noopener,noreferrer');
  };

  const renderImageAd = (ad: Ad) => (
    <div 
      className={`border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
        compactMode ? 'p-2 sm:p-3' : 'p-3 sm:p-4 md:p-6'
      }`}
      onClick={() => handleAdClick(ad)}
    >
      {ad.image_url && (
        <div className={`relative ${compactMode ? 'h-20 sm:h-24' : 'h-24 sm:h-32 md:h-40'} mb-3`}>
          <Image
            src={ad.image_url}
            alt={ad.headline}
            fill
            className="object-cover rounded"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="space-y-2">
        {ad.headline && (
          <h3 className={`font-semibold text-gray-900 ${
            compactMode ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'
          }`}>
            {ad.headline}
          </h3>
        )}
        
        {ad.description && !compactMode && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {ad.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {ad.call_to_action && (
            <span className={`bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium ${
              compactMode ? 'px-2 py-1' : 'px-3 py-2'
            }`}>
              {ad.call_to_action}
            </span>
          )}
          
          {showAdvertiserName && ad.advertiser_company && (
            <span className="text-xs text-gray-500">
              by {ad.advertiser_company}
            </span>
          )}
        </div>
        
        {/* Advertisement label */}
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          Advertisement
        </div>
      </div>
    </div>
  );

  const renderHtmlAd = (ad: Ad) => (
    <div 
      className={`border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        compactMode ? 'p-2' : 'p-3'
      }`}
      onClick={() => handleAdClick(ad)}
    >
      {ad.html_content && (
        <div 
          dangerouslySetInnerHTML={{ __html: ad.html_content }}
          className="w-full"
        />
      )}
      
      {/* Advertisement label */}
      <div className="text-xs text-gray-400 uppercase tracking-wide mt-2">
        Advertisement
      </div>
    </div>
  );

  const renderTextAd = (ad: Ad) => (
    <div 
      className={`border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        compactMode ? 'p-3' : 'p-4'
      }`}
      onClick={() => handleAdClick(ad)}
    >
      <div className="space-y-2">
        {ad.headline && (
          <h3 className={`font-semibold text-blue-900 ${compactMode ? 'text-sm' : 'text-lg'}`}>
            {ad.headline}
          </h3>
        )}
        
        {ad.description && (
          <p className={`text-gray-700 ${compactMode ? 'text-sm' : 'text-base'}`}>
            {ad.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {ad.call_to_action && (
            <span className="text-blue-600 font-medium text-sm hover:underline">
              {ad.call_to_action} →
            </span>
          )}
          
          {showAdvertiserName && ad.advertiser_company && (
            <span className="text-xs text-gray-500">
              {ad.advertiser_company}
            </span>
          )}
        </div>
        
        {/* Advertisement label */}
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          Advertisement
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className={`bg-gray-200 rounded-lg ${compactMode ? 'h-24' : 'h-32'}`}></div>
      </div>
    );
  }

  if (error || ads.length === 0) {
    return fallbackContent ? <>{fallbackContent}</> : null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {ads.map((ad) => {
        switch (ad.creative_type) {
          case 'image':
            return <div key={ad.id}>{renderImageAd(ad)}</div>;
          case 'html':
            return <div key={ad.id}>{renderHtmlAd(ad)}</div>;
          case 'text':
            return <div key={ad.id}>{renderTextAd(ad)}</div>;
          default:
            return <div key={ad.id}>{renderImageAd(ad)}</div>;
        }
      })}
    </div>
  );
}