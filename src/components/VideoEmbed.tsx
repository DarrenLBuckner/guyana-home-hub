'use client';

import React from 'react';

interface VideoEmbedProps {
  videoUrl: string;
  className?: string;
}

// Function to extract video ID and determine platform
function getEmbedUrl(url: string): { embedUrl: string; platform: 'youtube' | 'vimeo' | 'unknown' } {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0&modestbranding=1`,
      platform: 'youtube'
    };
  }
  
  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/|groups\/[^/]*\/videos\/|album\/[^/]*\/video\/|video\/|))(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=0&title=0&byline=0&portrait=0`,
      platform: 'vimeo'
    };
  }
  
  return { embedUrl: '', platform: 'unknown' };
}

// Function to validate if URL is a supported video platform
export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;
  const { platform } = getEmbedUrl(url);
  return platform !== 'unknown';
}

export default function VideoEmbed({ videoUrl, className = '' }: VideoEmbedProps) {
  if (!videoUrl || !isValidVideoUrl(videoUrl)) {
    return null;
  }

  const { embedUrl, platform } = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-gray-100">
        <iframe
          src={embedUrl}
          title="Property Video"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1 capitalize">
        {platform} video
      </p>
    </div>
  );
}