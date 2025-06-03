// src/state/useRouteStore.ts
import { create } from 'zustand';

type LatLng = { lat: number; lng: number };

interface RouteState {
  anchor: LatLng;
  destination: LatLng | null;
  path: LatLng[];
  recent: LatLng[];
  setAnchor: (pos: LatLng) => void;
  setDestination: (dest: LatLng) => void;
  clearRoute: () => void;
  setPath: (p: LatLng[]) => void;
  stopNavigation: () => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  // Default anchor: Stony Brook University (or whatever)
  anchor: { lat: 40.91207, lng: -73.12345 },
  destination: null,
  path: [],
  recent: [],
  setAnchor: (pos) =>
    set((state) => ({
      anchor: pos,
      recent: [pos, ...state.recent.slice(0, 4)],
    })),
  setDestination: (dest) =>
    set((state) => ({
      destination: dest,
      recent: [dest, ...state.recent.slice(0, 4)],
    })),
  clearRoute: () =>
    set(() => ({
      path: [],
      destination: null,
    })),
  setPath: (p) => set(() => ({ path: p })),
  stopNavigation: () =>
    set(() => ({
      destination: null,
      path: [],
    })),
}));
