import { useCallback } from 'react';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useResultsStore } from '@store/useResultsStore';
import { scoreRisk } from '@engine/riskScorer';
import { projectInflation } from '@engine/inflationProjector';
import { matchInstruments } from '@engine/instrumentMatcher';
import { buildRecommendationResult } from '@engine/allocationBuilder';

/**
 * useRecommendation — runs the full recommendation engine.
 *
 * Call generate() after onboarding is complete.
 * Results are stored in useResultsStore and persisted to localStorage.
 */
export function useRecommendation() {
  const answers = useOnboardingStore(s => s.answers);
  const { results, isLoading, error, setResults, setLoading, setError, clearResults } =
    useResultsStore();

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Score risk profile
      const riskResult = scoreRisk(answers);

      // 2. Project inflation-adjusted corpus
      const projection = projectInflation(answers);

      // 3. Match instruments to profile
      const recommendations = matchInstruments(answers, riskResult, projection);

      // 4. Build final result object
      const result = buildRecommendationResult(
        answers,
        riskResult,
        projection,
        recommendations
      );

      setResults(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      return null;
    }
  }, [answers, setResults, setLoading, setError]);

  return {
    results,
    isLoading,
    error,
    generate,
    clearResults,
  };
}
