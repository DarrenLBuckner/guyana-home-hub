'use client';

import React from 'react';
import AdDisplay from './AdDisplay';

/**
 * Hero Banner Ad Component
 * Large banner ads for home page hero section
 */

interface HeroBannerAdProps {
  className?: string;
  fallbackContent?: React.ReactNode;
}

export default function HeroBannerAd({ 
  className = '',
  fallbackContent = null
}: HeroBannerAdProps) {
  return (
    <AdDisplay
      placement="gy-home-hero"
      pageType="home"
      className={`w-full ${className}`}
      maxAds={1}
      fallbackContent={fallbackContent}
      showAdvertiserName={false}
      compactMode={false}
    />
  );
}