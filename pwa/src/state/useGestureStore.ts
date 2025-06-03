import { create } from 'zustand';

interface GestureState {
  current: string | null;
  set: (g: string | null) => void;
}

export const useGestureStore = create<GestureState>((set) => ({
  current: null,
  set: (g) => set({ current: g }),
}));
