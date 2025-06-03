// src/components/StreetView.tsx
import React, { useEffect, useRef } from 'react';
import { StreetViewPanorama } from '@react-google-maps/api';
import { useRouteStore } from '../state/useRouteStore';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  RotateCcwIcon,
} from 'lucide-react';

export const StreetView: React.FC = () => {
  // Read anchor and destination from Zustand
  const anchor = useRouteStore((s) => s.anchor);
  const destination = useRouteStore((s) => s.destination);
  const clearDestination = useRouteStore((s) => s.clearDestination);

  // Hold a ref to the panorama instance
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  // When “destination” changes, move the panorama there
  useEffect(() => {
    if (!panoramaRef.current) return;
    if (destination) {
      panoramaRef.current.setPosition(destination);
      // Reset pitch to 0; keep the last known heading
      const pov = panoramaRef.current.getPov();
      panoramaRef.current.setPov({ heading: pov.heading, pitch: 0 });
    }
  }, [destination]);

  // If the Maps API isn’t ready, show a loader (though useJsApiLoader in App.tsx ensures it is)
  if (typeof window === 'undefined' || !window.google || !window.google.maps) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100">
        <p className="text-lg text-gray-600">Loading Maps API…</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <StreetViewPanorama
        options={{
          position: anchor,
          pov: { heading: 0, pitch: 0 },
          visible: true,
        }}
        onLoad={(pan) => {
          panoramaRef.current = pan;
        }}
        onUnmount={() => {
          panoramaRef.current = null;
        }}
      />

      {/* Arrow controls to rotate / tilt the view */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-3">
        <button
          className="bg-white p-4 rounded-xl shadow-lg hover:bg-gray-50 transition"
          onClick={() => {
            if (!panoramaRef.current) return;
            const pov = panoramaRef.current.getPov();
            panoramaRef.current.setPov({
              heading: pov.heading,
              pitch: Math.min(pov.pitch + 10, 90),
            });
          }}
        >
          <ChevronUpIcon size={32} />
        </button>
        <button
          className="bg-white p-4 rounded-xl shadow-lg hover:bg-gray-50 transition"
          onClick={() => {
            if (!panoramaRef.current) return;
            const pov = panoramaRef.current.getPov();
            panoramaRef.current.setPov({
              heading: (pov.heading - 10 + 360) % 360,
              pitch: pov.pitch,
            });
          }}
        >
          <ChevronLeftIcon size={32} />
        </button>
        <button
          className="bg-white p-4 rounded-xl shadow-lg hover:bg-gray-50 transition"
          onClick={() => {
            if (!panoramaRef.current) return;
            const pov = panoramaRef.current.getPov();
            panoramaRef.current.setPov({
              heading: (pov.heading + 10) % 360,
              pitch: pov.pitch,
            });
          }}
        >
          <ChevronRightIcon size={32} />
        </button>
        <button
          className="bg-white p-4 rounded-xl shadow-lg hover:bg-gray-50 transition"
          onClick={() => {
            if (!panoramaRef.current) return;
            const pov = panoramaRef.current.getPov();
            panoramaRef.current.setPov({
              heading: pov.heading,
              pitch: Math.max(pov.pitch - 10, -90),
            });
          }}
        >
          <ChevronDownIcon size={32} />
        </button>
        <button
          className="bg-white p-4 rounded-xl shadow-lg hover:bg-gray-50 transition"
          onClick={() => {
            if (!panoramaRef.current) return;
            const pov = panoramaRef.current.getPov();
            panoramaRef.current.setPov({
              heading: (pov.heading + 180) % 360,
              pitch: pov.pitch,
            });
          }}
        >
          <RotateCcwIcon size={32} />
        </button>
      </div>

      {/* “Cancel destination” button to go back to just the anchor view */}
      {destination && (
        <button
          className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full shadow hover:bg-gray-100 transition"
          onClick={() => {
            clearDestination();
            // Jump back to the anchor point
            if (panoramaRef.current) {
              panoramaRef.current.setPosition(anchor);
            }
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
