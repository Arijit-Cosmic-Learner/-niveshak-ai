import type { OnboardingAnswers } from '@t/onboarding';
import type { InstrumentRecommendation, RecommendationResult } from '@t/instruments';
import type { RiskScoreResult } from './riskScorer';
import type { InflationProjection } from '@t/onboarding';

export function buildRecommendationResult(
  answers: OnboardingAnswers,
  riskResult: RiskScoreResult,
  projection: InflationProjection,
  recommendations: InstrumentRecommendation[]
): RecommendationResult {
  const totalMonthlyAmount = recommendations.reduce(
    (sum, r) => sum + r.monthlyAmount,
    0
  );

  return {
    riskScore:           riskResult.score,
    riskProfile:         riskResult.profile,
    riskProfileLabelEn:  riskResult.labelEn,
    riskProfileLabelHi:  riskResult.labelHi,
    riskProfileDescEn:   riskResult.descEn,
    riskProfileDescHi:   riskResult.descHi,
    inflationProjection: projection,
    recommendations,
    totalMonthlyAmount,
    generatedAt: new Date(),
  };
}
