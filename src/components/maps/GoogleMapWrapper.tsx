'use client';

import { useCallback, useMemo, useState } from 'react';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsProvider';

interface GoogleMapWrapperProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
}

const mapContainerStyle = {
  width: '100%',
  borderRadius: '0.5rem',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const circleOptions: google.maps.CircleOptions = {
  strokeColor: '#059669',
  strokeOpacity: 0.3,
  strokeWeight: 2,
  fillColor: '#059669',
  fillOpacity: 0.1,
  radius: 500, // 500 meters
};

/**
 * Privacy-safe offset: shifts the pin by 0.002-0.005 degrees (~200-500m)
 * in a random direction so the exact address is never revealed.
 */
function offsetCoordinates(lat: number, lng: number): { lat: number; lng: number } {
  const offsetRange = 0.003; // ~300m base
  const jitter = 0.002; // additional random 0-200m
  const angle = Math.random() * 2 * Math.PI;
  const distance = offsetRange + Math.random() * jitter;
  return {
    lat: lat + distance * Math.cos(angle),
    lng: lng + distance * Math.sin(angle),
  };
}

export default function GoogleMapWrapper({
  latitude,
  longitude,
  zoom = 14,
  height = '400px',
}: GoogleMapWrapperProps) {
  const { isLoaded, loadError } = useGoogleMaps();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Offset pin for privacy — memoized so it doesn't jump on re-render
  const offsetPos = useMemo(
    () => offsetCoordinates(latitude, longitude),
    [latitude, longitude]
  );

  const center = useMemo(
    () => ({ lat: offsetPos.lat, lng: offsetPos.lng }),
    [offsetPos]
  );

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(void 0 as unknown as google.maps.Map | null);
  }, []);

  if (loadError) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-sm"
        style={{ height }}
      >
        Unable to load map
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg animate-pulse"
        style={{ height }}
      >
        <div className="text-gray-400 text-sm">Loading map...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ ...mapContainerStyle, height }}
      center={center}
      zoom={zoom}
      options={mapOptions}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={center} />
      <Circle center={center} options={circleOptions} />
    </GoogleMap>
  );
}
