import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecommendationResult } from '@t/instruments';

interface ResultsState {
  results: RecommendationResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setResults: (results: RecommendationResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResults: () => void;
}

export const useResultsStore = create<ResultsState>()(
  persist(
    set => ({
      results: null,
      isLoading: false,
      error: null,

      setResults: (results: RecommendationResult) =>
        set({ results, isLoading: false, error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) =>
        set({ error, isLoading: false }),

      clearResults: () =>
        set({ results: null, isLoading: false, error: null }),
    }),
    {
      name: 'niveshak-results',
      partialize: state => ({ results: state.results }),
    }
  )
);
