// src/components/MapView.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { useRouteStore } from '../state/useRouteStore';

// Use your actual “anchor” (e.g., Stony Brook University) instead of NYC
const ANCHOR: google.maps.LatLngLiteral = { lat: 40.91207, lng: -73.12345 };
// (Example: SUNY Stony Brook Main Gate.)

interface Props {
  currentLocation: { lat: number; lng: number };
  destination: any;
  isNavigating: boolean;
  pathProgress: number;
}

export const MapView: React.FC<Props> = ({
  currentLocation,
  destination,
  isNavigating,
  pathProgress,
}) => {
  const setDest = useRouteStore((s) => s.setDestination);
  const clearPath = useRouteStore((s) => s.clearRoute);
  const setPath = useRouteStore((s) => s.setPath);
  const path = useRouteStore((s) => s.path);
  const dest = useRouteStore((s) => s.recent[0] ?? null);

  const [error, setError] = useState<string | null>(null);
  const [routeId, setRouteId] = useState<number>(0);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      streetViewControl: false,
      fullscreenControl: false,
    }),
    []
  );

  // Fetch walking route from ANCHOR → target
  async function fetchRoute(
    origin: google.maps.LatLngLiteral,
    destPoint: google.maps.LatLngLiteral
  ): Promise<google.maps.LatLngLiteral[]> {
    const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${API_KEY}`;
    const payload = {
      origin: {
        location: { latLng: { latitude: origin.lat, longitude: origin.lng } },
      },
      destination: {
        location: {
          latLng: { latitude: destPoint.lat, longitude: destPoint.lng },
        },
      },
      travelMode: 'WALK',
    };
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Routes API error ${res.status}: ${text}`);
    }

    type RoutesResponse = {
      routes?: Array<{ polyline?: { encodedPolyline?: string } }>;
    };
    const json: RoutesResponse = await res.json();
    const encoded = json.routes?.[0]?.polyline?.encodedPolyline;
    if (!encoded) throw new Error('No routes returned');

    const decoded = google.maps.geometry.encoding.decodePath(encoded);
    return decoded.map((p) => ({ lat: p.lat(), lng: p.lng() }));
  }

  // When the map is clicked
  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const target = { lat: e.latLng.lat(), lng: e.latLng.lng() };

      clearPath();
      setRouteId(0);
      setError(null);
      setDest({ ...target, ts: Date.now() });

      try {
        const newPath = await fetchRoute(ANCHOR, target);
        console.log('New route points:', newPath); // Debug log
        setPath(newPath);
        setRouteId(Date.now());
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Route error');
      }
    },
    [clearPath, setDest, setPath]
  );

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={ANCHOR}
        zoom={15}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {/* “You Are Here” label at anchor */}
        <Marker
          position={ANCHOR}
          label={{
            text: '📍 You Are Here',
            className: 'text-sm font-semibold text-blue-600',
          }}
        />

        {/* Only show “Destination” marker after a click */}
        {dest && (
          <Marker
            position={dest}
            label={{
              text: '📍 Going Here',
              className: 'text-sm font-semibold text-green-600',
            }}
          />
        )}

        {/* Re-use routeId as key so old polylines unmount immediately */}
        {routeId && path.length > 0 && (
          <Polyline
            key={routeId}
            path={path}
            options={{
              strokeColor: '#4285F4',
              strokeOpacity: 0.9,
              strokeWeight: 5,
            }}
          />
        )}

        {/* Error box */}
        {error && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              background: 'rgba(255,0,0,0.8)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}
      </GoogleMap>
    </div>
  );
};
