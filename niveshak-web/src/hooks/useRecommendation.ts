import { useCallback } from 'react';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useResultsStore } from '@store/useResultsStore';
import { scoreRisk } from '@engine/riskScorer';
import { projectInflation } from '@engine/inflationProjector';
import { matchInstruments, getEligibleInstruments } from '@engine/instrumentMatcher';
import { buildRecommendationResult } from '@engine/allocationBuilder';
import { getInstrumentById } from '@data/instruments';
import {
  fetchAIRecommendation,
  type AIRecommendationPayload,
  type AIInstrumentAllocation,
} from '@lib/anthropic';
import type { InstrumentRecommendation } from '@t/instruments';
import type { InflationProjection } from '@t/onboarding';

function buildRecommendationsFromAI(
  allocations: AIInstrumentAllocation[],
  monthlyBudget: number,
): InstrumentRecommendation[] {
  return allocations
    .map((alloc, i) => {
      const instrument = getInstrumentById(alloc.id);
      if (!instrument) return null;
      const monthly = Math.max(
        instrument.minMonthly,
        Math.round((alloc.allocationPercent / 100) * monthlyBudget)
      );
      return {
        instrument,
        allocationPercent: alloc.allocationPercent,
        monthlyAmount: monthly,
        rank: i + 1,
        reasonEn: alloc.reasonEn,
        reasonHi: alloc.reasonHi,
      } satisfies InstrumentRecommendation;
    })
    .filter((r): r is InstrumentRecommendation => r !== null);
}

// Runs the full recommendation pipeline — AI picks instruments when available,
// falls back to local algorithm if AI call fails.
export function useRecommendation() {
  const answers = useOnboardingStore(s => s.answers);
  const { results, isLoading, error, setResults, setLoading, setError, clearResults } =
    useResultsStore();

  const generate = useCallback(async () => {
    clearResults();
    setLoading(true);
    setError(null);

    try {
      const riskResult = scoreRisk(answers);
      const projection = projectInflation(answers);
      const monthlyBudget = answers.monthlyInvestment ?? answers.monthlySurplus ?? 1000;

      // Build AI payload with eligible instruments as candidates
      const eligible = getEligibleInstruments(answers, riskResult);
      const aiPayload: AIRecommendationPayload = {
        riskScore:        riskResult.score,
        riskProfile:      riskResult.profile,
        riskProfileLabel: riskResult.labelEn,
        userName:         answers.name ?? 'Friend',
        state:            answers.state ?? '',
        occupation:       answers.occupation ?? '',
        inHandIncome:     answers.inHandIncome ?? 0,
        monthlySurplus:   answers.monthlySurplus ?? 0,
        experience:       answers.experience ?? '',
        riskTolerance:    answers.riskTolerance ?? '',
        goalType:         answers.goal ?? 'GROW_WEALTH',
        goalAmount:       answers.goalAmount ?? 0,
        adjustedCorpus:   projection.adjustedCorpus,
        yearsToGoal:      projection.yearsToGoal,
        timeline:         answers.timeline ?? 'NOT_SURE',
        monthlyInvestment: monthlyBudget,
        language:         'en',
        instruments:      [],
        availableInstruments: eligible.map(inst => ({
          id:                inst.id,
          nameEn:            inst.nameEn,
          nameHi:            inst.nameHi,
          type:              inst.type,
          riskLevel:         inst.riskLevel,
          returnsLabel:      inst.returnsLabel,
          whyEn:             inst.whyEn,
          isGovernmentBacked: inst.isGovernmentBacked,
          lockInYears:       inst.lockInYears,
          taxBenefit:        inst.taxBenefit,
          minMonthly:        inst.minMonthly,
        })),
      };

      let recommendations: InstrumentRecommendation[];
      let bullets: string[];

      try {
        const aiResult = await fetchAIRecommendation(aiPayload);
        recommendations = buildRecommendationsFromAI(aiResult.instrumentAllocations, monthlyBudget);
        bullets = aiResult.bullets ?? [];
        // Validate AI returned usable instruments; fall back if empty
        if (recommendations.length === 0) throw new Error('AI returned no valid instruments');
      } catch (aiErr) {
        console.warn('AI instrument picking failed — using local engine:', aiErr);
        recommendations = matchInstruments(answers, riskResult, projection);
        bullets = [];
      }

      const result = buildRecommendationResult(
        answers, riskResult, projection, recommendations, bullets
      );
      setResults(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  return { results, isLoading, error, generate, clearResults };
}

