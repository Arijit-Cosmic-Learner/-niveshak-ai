import { RiskProfile, TimelineType, type OnboardingAnswers } from '@t/onboarding';
import type { Instrument, InstrumentRecommendation } from '@t/instruments';
import { instruments } from '@data/instruments';
import type { RiskScoreResult } from './riskScorer';
import type { InflationProjection } from '@t/onboarding';

// Timeline rank order - higher = longer timeline
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

export function getEligibleInstruments(
  answers: OnboardingAnswers,
  riskResult: RiskScoreResult
): Instrument[] {
  const monthlyBudget    = answers.monthlyInvestment ?? answers.monthlySurplus ?? 1000;
  const userTimelineRank = answers.timeline ? TIMELINE_RANK[answers.timeline] : 3;
  const userRiskRank     = RISK_PROFILE_RANK[riskResult.profile];

  const applyFilters = (timelineRank: number, enforceGoal: boolean): Instrument[] =>
    instruments.filter(inst => {
      const instTimelineRank = TIMELINE_RANK[inst.minTimeline];
      const instRiskRank     = RISK_PROFILE_RANK[inst.maxRiskProfile];
      const timelineOk = instTimelineRank <= timelineRank;
      const riskOk     = instRiskRank >= userRiskRank || instRiskRank >= 1;
      const goalOk     = !enforceGoal || !answers.goal || inst.suitableGoals.includes(answers.goal);
      const affordOk   = inst.minMonthly <= monthlyBudget;
      return timelineOk && riskOk && goalOk && affordOk;
    });

  // Pass 1: exact timeline + goal match
  let result = applyFilters(userTimelineRank, true);
  if (result.length >= 3) return result;

  // Pass 2: relax timeline to maximum (show all timeline-appropriate instruments)
  result = applyFilters(5, true);
  if (result.length >= 3) return result;

  // Pass 3: also relax goal filter — always guarantee at least some options
  result = applyFilters(5, false);
  if (result.length >= 2) return result;

  // Pass 4: last resort — just return affordable instruments sorted by risk fit
  return instruments
    .filter(inst => inst.minMonthly <= monthlyBudget)
    .sort((a, b) => RISK_PROFILE_RANK[b.maxRiskProfile] - RISK_PROFILE_RANK[a.maxRiskProfile])
    .slice(0, 4);
}

export function matchInstruments(
  answers: OnboardingAnswers,
  riskResult: RiskScoreResult,
  projection: InflationProjection
): InstrumentRecommendation[] {
  const monthlyBudget    = answers.monthlyInvestment ?? answers.monthlySurplus ?? 1000;
  const eligible = getEligibleInstruments(answers, riskResult);

  // Sort: govt-backed first for conservative users; by timeline fit
  const sorted = eligible.sort((a, b) => {
    if (riskResult.profile === RiskProfile.CONSERVATIVE) {
      if (a.isGovernmentBacked !== b.isGovernmentBacked) {
        return a.isGovernmentBacked ? -1 : 1;
      }
    }
    return TIMELINE_RANK[b.minTimeline] - TIMELINE_RANK[a.minTimeline];
  });

  const topInstruments = sorted.slice(0, 4);

  return buildRecommendations(topInstruments, monthlyBudget, riskResult.profile, projection);
}

function buildRecommendations(
  instruments: Instrument[],
  monthlyBudget: number,
  profile: RiskProfile,
  projection: InflationProjection
): InstrumentRecommendation[] {
  if (instruments.length === 0) return [];

  const weightSets: Record<RiskProfile, number[]> = {
    [RiskProfile.CONSERVATIVE]: [50, 30, 15, 5],
    [RiskProfile.BALANCED]:     [40, 30, 20, 10],
    [RiskProfile.GROWTH]:       [40, 25, 20, 15],
  };

  const weights     = weightSets[profile].slice(0, instruments.length);
  const totalWeight = weights.reduce((s, w) => s + w, 0);

  return instruments.map((inst, i) => {
    const pct     = Math.round((weights[i] / totalWeight) * 100);
    const monthly = Math.max(inst.minMonthly, Math.round((pct / 100) * monthlyBudget));

    return {
      instrument: inst,
      allocationPercent: pct,
      monthlyAmount: monthly,
      rank: i + 1,
      reasonEn: `Suitable for your ${projection.yearsToGoal}-year goal \u2014 ${inst.returnsLabel} expected returns.`,
      reasonHi: `\u0906\u092A\u0915\u0947 ${projection.yearsToGoal} \u0938\u093E\u0932 \u0915\u0947 \u0932\u0915\u094D\u0937\u094D\u092F \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u2014 \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0930\u093F\u091F\u0930\u094D\u0928: ${inst.returnsLabel}`,
    };
  });
}