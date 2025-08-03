import { create } from 'zustand';
import OpenSeadragon from 'openseadragon';
import type { OpenSeadragonAnnotator } from '@annotorious/openseadragon';

interface ViewerStore {
  // Refs
  osdRef: OpenSeadragon.Viewer | null;
  annotatorRef: OpenSeadragonAnnotator | null;

  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  setOsdRef: (ref: OpenSeadragon.Viewer | null) => void;
  setAnnotatorRef: (ref: OpenSeadragonAnnotator | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Cleanup
  cleanup: () => void;
}

export const useViewerStore = create<ViewerStore>((set, get) => ({
  // Initial state
  osdRef: null,
  annotatorRef: null,
  isLoading: true,
  error: null,

  // Actions
  setOsdRef: (ref) => set({ osdRef: ref }),
  setAnnotatorRef: (ref) => set({ annotatorRef: ref }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Cleanup function
  cleanup: () => {
    const { osdRef, annotatorRef } = get();
    if (osdRef) {
      osdRef.destroy();
    }
    if (annotatorRef) {
      annotatorRef.destroy();
    }
    set({
      osdRef: null,
      annotatorRef: null,
      isLoading: true,
      error: null
    });
  },
}));
