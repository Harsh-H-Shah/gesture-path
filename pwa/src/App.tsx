// src/App.tsx
import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api'; // :contentReference[oaicite:0]{index=0}
import { KioskHeader } from './components/KioskHeader';
import { MapView } from './components/MapView';
import { StreetView } from './components/StreetView';
import { CameraFeed } from './components/CameraFeed';
import { PathProgress } from './components/PathProgress';
import { SearchPanel } from './components/SearchPanel';
import { LocationDetail } from './components/LocationDetail';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

// Define libraries once
const LIBRARIES = ['geometry'] as const;

export default function App() {
  const [activeView, setActiveView] = useState<'map' | 'street'>('map');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lng: -74.006,
  });
  const [destination, setDestination] = useState<any>(null);
  const [pathProgress, setPathProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Load Google Maps API once
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Simulate path progress
  useEffect(() => {
    let interval: number;
    if (isNavigating && pathProgress < 100) {
      interval = window.setInterval(() => {
        setPathProgress((prev) => Math.min(prev + 2, 100));
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isNavigating, pathProgress]);

  const handleGestureDetected = (gesture: string | null) => {
    // We now pull gestures from `useGestureStore` directly inside child components,
    // so you can remove this handler entirely if you want to centrally read from Zustand.
  };

  const startNavigation = (loc: any) => {
    setDestination(loc);
    setIsNavigating(true);
    setPathProgress(0);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setPathProgress(0);
    setDestination(null);
  };

  const handleSearch = (loc: any) => {
    setSelectedLocation(loc);
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error loading Google Maps API</p>
      </div>
    );
  }

  // Do not render map/street until API is loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading Maps API…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gray-50 overflow-hidden text-gray-900">
      <KioskHeader />
      <div className="flex flex-1 w-full">
        {/* Left panel – Search and Details */}
        <div className="w-1/4 bg-white shadow-lg z-10 border-r border-gray-100">
          <SearchPanel onSearch={handleSearch} />
          {selectedLocation && (
            <LocationDetail
              location={selectedLocation}
              onStartNavigation={startNavigation}
              isNavigating={isNavigating}
              onStopNavigation={stopNavigation}
            />
          )}
          {isNavigating && (
            <PathProgress
              progress={pathProgress}
              destination={destination}
              onCancel={stopNavigation}
            />
          )}
        </div>

        {/* Main content (Map vs. Street) */}
        <div className="flex flex-col w-3/4">
          {/* Toggle buttons */}
          <div className="flex justify-center p-2 bg-white border-b border-gray-100">
            <div className="bg-gray-100 p-1.5 rounded-xl shadow-sm">
              <button
                className={`px-8 py-4 text-lg rounded-lg transition-all duration-200 ${
                  activeView === 'map'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveView('map')}
              >
                Map View
              </button>
              <button
                className={`px-8 py-4 text-lg rounded-lg transition-all duration-200 ${
                  activeView === 'street'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveView('street')}
              >
                Street View
              </button>
            </div>
          </div>

          {/* Conditional rendering of MapView or StreetView */}
          <div className="flex-1 relative">
            {activeView === 'map' ? (
              <MapView
                currentLocation={currentLocation}
                destination={destination}
                isNavigating={isNavigating}
                pathProgress={pathProgress}
              />
            ) : (
              <StreetView
                currentLocation={currentLocation}
                destination={destination}
                isNavigating={isNavigating}
                pathProgress={pathProgress}
              />
            )}
          </div>

          {/* Gesture indicator (we’ll read from Zustand inside CameraFeed) */}
        </div>

        {/* Camera feed */}
        <div className="absolute bottom-6 right-6 w-64 h-48 rounded-xl overflow-hidden shadow-lg border-2 border-white">
          <CameraFeed />
        </div>
      </div>
    </div>
  );
}
