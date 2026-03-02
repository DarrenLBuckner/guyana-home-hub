'use client';

import { useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

interface NearbyPlacesProps {
  latitude: number;
  longitude: number;
}

interface PlaceResult {
  name: string;
  distance: number; // km
  icon: string;
  category: string;
}

const CATEGORIES = [
  { type: 'school', label: 'Schools', icon: '🏫' },
  { type: 'hospital', label: 'Hospitals & Clinics', icon: '🏥' },
  { type: 'supermarket', label: 'Supermarkets & Grocery', icon: '🛒' },
  { type: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  { type: 'bank', label: 'Banks', icon: '🏦' },
];

const LIBRARIES: ('places')[] = ['places'];

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearbyPlaces({ latitude, longitude }: NearbyPlacesProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  });

  const [placesByCategory, setPlacesByCategory] = useState<Record<string, PlaceResult[]>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded || loaded) return;

    // Create a hidden div for PlacesService (it requires a map or div element)
    const div = document.createElement('div');
    const service = new google.maps.places.PlacesService(div);
    const location = new google.maps.LatLng(latitude, longitude);
    const results: Record<string, PlaceResult[]> = {};
    let completed = 0;

    CATEGORIES.forEach(({ type, icon, label }) => {
      service.nearbySearch(
        { location, radius: 1000, type },
        (places, status) => {
          completed++;

          if (status === google.maps.places.PlacesServiceStatus.OK && places) {
            results[type] = places
              .slice(0, 3)
              .map((place) => {
                const placeLat = place.geometry?.location?.lat() || 0;
                const placeLng = place.geometry?.location?.lng() || 0;
                const dist = haversineDistance(latitude, longitude, placeLat, placeLng);
                return {
                  name: place.name || 'Unknown',
                  distance: Math.round(dist * 10) / 10,
                  icon,
                  category: label,
                };
              })
              .sort((a, b) => a.distance - b.distance);
          }

          if (completed === CATEGORIES.length) {
            setPlacesByCategory({ ...results });
            setLoaded(true);
          }
        },
      );
    });
  }, [isLoaded, latitude, longitude, loaded]);

  const hasAnyResults = Object.values(placesByCategory).some((arr) => arr.length > 0);

  if (!isLoaded || (!loaded && !hasAnyResults)) return null;
  if (!hasAnyResults) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">What&apos;s Nearby</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map(({ type, label, icon }) => {
          const places = placesByCategory[type];
          if (!places || places.length === 0) return null;
          return (
            <div key={type} className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                {icon} {label}
              </h4>
              <ul className="space-y-1">
                {places.map((place, i) => (
                  <li key={i} className="text-sm text-gray-600 flex justify-between">
                    <span className="truncate mr-2">{place.name}</span>
                    <span className="text-gray-400 whitespace-nowrap">{place.distance} km</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
