import { RiskProfile, TimelineType, type OnboardingAnswers } from '@t/onboarding';
import type { Instrument, InstrumentRecommendation } from '@t/instruments';
import { instruments } from '@data/instruments';
import type { RiskScoreResult } from './riskScorer';
import type { InflationProjection } from '@t/onboarding';

// Timeline rank order — higher = longer timeline
const TIMELINE_RANK: Record<TimelineType, number> = {
  [TimelineType.UNDER_1_YEAR]:   1,
  [TimelineType.ONE_TO_3_YEARS]: 2,
  [TimelineType.THREE_TO_7]:     3,
  [TimelineType.SEVEN_TO_15]:    4,
  [TimelineType.ABOVE_15]:       5,
  [TimelineType.NOT_SURE]:       3,
};

const RISK_PROFILE_RANK: Record<RiskProfile, number> = {
  [RiskProfile.CONSERVATIVE]: 1,
  [RiskProfile.BALANCED]:     2,
  [RiskProfile.GROWTH]:       3,
};

export function matchInstruments(
  answers: OnboardingAnswers,
  riskResult: RiskScoreResult,
  projection: InflationProjection
): InstrumentRecommendation[] {
  const monthlyBudget = answers.monthlyInvestment ?? answers.monthlySurplus ?? 1000;
  const userTimelineRank  = answers.timeline ? TIMELINE_RANK[answers.timeline] : 3;
  const userRiskRank      = RISK_PROFILE_RANK[riskResult.profile];

  // Filter: instrument timeline must be <= user's timeline
  // and instrument max risk profile must be >= user's profile (can go lower)
  const eligible: Instrument[] = instruments.filter(inst => {
    const instTimelineRank = TIMELINE_RANK[inst.minTimeline];
    const instRiskRank     = RISK_PROFILE_RANK[inst.maxRiskProfile];

    const timelineOk = instTimelineRank <= userTimelineRank;
    const riskOk     = instRiskRank >= userRiskRank || instRiskRank >= 1;
    const goalOk     = !answers.goal || inst.suitableGoals.includes(answers.goal);
    const affordOk   = inst.minMonthly <= monthlyBudget;

    return timelineOk && riskOk && goalOk && affordOk;
  });

  // Sort: govt-backed first for conservative users; by timeline fit
  const sorted = eligible.sort((a, b) => {
    if (riskResult.profile === RiskProfile.CONSERVATIVE) {
      if (a.isGovernmentBacked !== b.isGovernmentBacked) {
        return a.isGovernmentBacked ? -1 : 1;
      }
    }
    return TIMELINE_RANK[b.minTimeline] - TIMELINE_RANK[a.minTimeline];
  });

  // Take top 4 instruments
  const topInstruments = sorted.slice(0, 4);

  // Build allocations — weight by inverse risk and priority
  return buildRecommendations(topInstruments, monthlyBudget, riskResult.profile, projection);
}

function buildRecommendations(
  instruments: Instrument[],
  monthlyBudget: number,
  profile: RiskProfile,
  projection: InflationProjection
): InstrumentRecommendation[] {
  if (instruments.length === 0) return [];

  // Allocation weights by profile — [primary, secondary, tertiary, quaternary]
  const weightSets: Record<RiskProfile, number[]> = {
    [RiskProfile.CONSERVATIVE]: [50, 30, 15, 5],
    [RiskProfile.BALANCED]:     [40, 30, 20, 10],
    [RiskProfile.GROWTH]:       [40, 25, 20, 15],
  };

  const weights = weightSets[profile].slice(0, instruments.length);
  // Renormalize if fewer than 4 instruments
  const totalWeight = weights.reduce((s, w) => s + w, 0);

  return instruments.map((inst, i) => {
    const pct = Math.round((weights[i] / totalWeight) * 100);
    const monthly = Math.max(inst.minMonthly, Math.round((pct / 100) * monthlyBudget));

    const yearsLabel = `${projection.yearsToGoal} years`;
    return {
      instrument: inst,
      allocationPercent: pct,
      monthlyAmount: monthly,
      rank: i + 1,
      reasonEn: `Suitable for your ${yearsLabel} goal — ${inst.returnsLabel} expected returns.`,
      reasonHi: `???? ${projection.yearsToGoal}-?????? ?????? ?? ??? ??????? — ???????? ??????: ${inst.returnsLabel}?`,
    };
  });
}
