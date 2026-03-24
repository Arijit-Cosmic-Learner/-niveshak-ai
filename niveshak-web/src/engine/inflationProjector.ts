import { TimelineType, type OnboardingAnswers, type InflationProjection } from '@t/onboarding';

const INFLATION_RATE = 0.06;

// Map TimelineType to median years for projection
const TIMELINE_YEARS: Record<TimelineType, number> = {
  [TimelineType.UNDER_1_YEAR]:   1,
  [TimelineType.ONE_TO_3_YEARS]: 2,
  [TimelineType.THREE_TO_7]:     5,
  [TimelineType.SEVEN_TO_15]:    10,
  [TimelineType.ABOVE_15]:       20,
  [TimelineType.NOT_SURE]:       7,
};

export function projectInflation(
  answers: OnboardingAnswers,
  inflationRate: number = INFLATION_RATE
): InflationProjection {
  const todayAmount = answers.goalAmount ?? 500000;
  const yearsToGoal = answers.timeline ? TIMELINE_YEARS[answers.timeline] : 7;
  const currentYear = new Date().getFullYear();
  const targetYear  = currentYear + yearsToGoal;

  // Compound inflation: FV = PV x (1 + r)^n
  const inflationMultiplier = Math.pow(1 + inflationRate, yearsToGoal);
  const adjustedCorpus      = Math.round(todayAmount * inflationMultiplier);

  return {
    todayAmount,
    targetYear,
    yearsToGoal,
    inflationRate,
    adjustedCorpus,
    inflationMultiplier,
  };
}

/** Format a rupee amount as compact string: \u20B91.2L, \u20B945K, \u20B91.5Cr */
export function formatRupee(amount: number): string {
  if (amount >= 10_000_000) {
    return `\u20B9${(amount / 10_000_000).toFixed(1)}Cr`;
  }
  if (amount >= 100_000) {
    return `\u20B9${(amount / 100_000).toFixed(1)}L`;
  }
  if (amount >= 1_000) {
    return `\u20B9${(amount / 1_000).toFixed(0)}K`;
  }
  return `\u20B9${amount}`;
}
