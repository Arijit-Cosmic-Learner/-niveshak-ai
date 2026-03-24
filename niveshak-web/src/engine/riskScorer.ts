import {
  ExperienceType,
  RiskProfile,
  RiskToleranceType,
  OccupationType,
  TimelineType,
  type OnboardingAnswers,
} from '@t/onboarding';

// --- Scoring weights --------------------------------------------------------
// Total max score: 100
// - Experience:     0–25
// - Risk tolerance: 0–35
// - Timeline:       0–25
// - Occupation:     0–15

const EXPERIENCE_SCORES: Record<ExperienceType, number> = {
  [ExperienceType.NEVER]:                  0,
  [ExperienceType.ONLY_FD_SAVINGS]:        5,
  [ExperienceType.GOLD_REAL_ESTATE]:       12,
  [ExperienceType.MF_STOCKS_OCCASIONAL]:   20,
  [ExperienceType.REGULAR_INVESTOR]:       25,
};

const RISK_TOLERANCE_SCORES: Record<RiskToleranceType, number> = {
  [RiskToleranceType.WITHDRAW_IMMEDIATELY]: 0,
  [RiskToleranceType.WORRY_AND_WAIT]:       10,
  [RiskToleranceType.STAY_CALM]:            25,
  [RiskToleranceType.BUY_MORE]:             35,
};

const TIMELINE_SCORES: Record<TimelineType, number> = {
  [TimelineType.UNDER_1_YEAR]:   0,
  [TimelineType.ONE_TO_3_YEARS]: 5,
  [TimelineType.THREE_TO_7]:     12,
  [TimelineType.SEVEN_TO_15]:    20,
  [TimelineType.ABOVE_15]:       25,
  [TimelineType.NOT_SURE]:       8,
};

const OCCUPATION_SCORES: Record<OccupationType, number> = {
  [OccupationType.SALARIED_PRIVATE]: 12,
  [OccupationType.SALARIED_GOVT]:    8,
  [OccupationType.SELF_EMPLOYED]:    15,
  [OccupationType.DAILY_WAGE]:       3,
  [OccupationType.FARMER]:           3,
  [OccupationType.STUDENT]:          10,
  [OccupationType.HOMEMAKER]:        5,
  [OccupationType.RETIRED]:          2,
};

export interface RiskScoreResult {
  score: number;          // 0–100
  profile: RiskProfile;
  labelEn: string;
  labelHi: string;
  descEn: string;
  descHi: string;
}

const PROFILE_LABELS: Record<RiskProfile, { labelEn: string; labelHi: string; descEn: string; descHi: string }> = {
  [RiskProfile.CONSERVATIVE]: {
    labelEn: 'Conservative Investor',
    labelHi: '????????? ??????',
    descEn:  'Safety is your top priority. Government and bank-backed instruments with guaranteed returns suit you best.',
    descHi:  '??????? ???? ???????? ?????????? ??? ??????? ?????? ???? ?????? ?? ????-??????? ???? ???? ??? ???? ??????? ????',
  },
  [RiskProfile.BALANCED]: {
    labelEn: 'Balanced Investor',
    labelHi: '??????? ??????',
    descEn:  'You want steady growth with a safety net. A mix of guaranteed and market-linked instruments suits you.',
    descHi:  '?? ??????? ?? ??? ????? ????? ????? ???? ??????? ?? ??????-?????? ?????? ?? ?????? ???? ??? ??????? ???',
  },
  [RiskProfile.GROWTH]: {
    labelEn: 'Growth Investor',
    labelHi: '?????-?????? ??????',
    descEn:  'You can handle market swings for higher long-term returns. Equity-heavy instruments are your best bet.',
    descHi:  '?? ???? ?????????? ?????? ?? ??? ?????? ?? ????-????? ?? ???? ???? ???????-???? ???? ???? ??? ??? ????',
  },
};

export function scoreRisk(answers: OnboardingAnswers): RiskScoreResult {
  const expScore  = answers.experience     ? EXPERIENCE_SCORES[answers.experience]         : 0;
  const riskScore = answers.riskTolerance  ? RISK_TOLERANCE_SCORES[answers.riskTolerance]  : 0;
  const timeScore = answers.timeline       ? TIMELINE_SCORES[answers.timeline]              : 0;
  const occScore  = answers.occupation     ? OCCUPATION_SCORES[answers.occupation]          : 0;

  const total = expScore + riskScore + timeScore + occScore;

  let profile: RiskProfile;
  if (total <= 33) {
    profile = RiskProfile.CONSERVATIVE;
  } else if (total <= 66) {
    profile = RiskProfile.BALANCED;
  } else {
    profile = RiskProfile.GROWTH;
  }

  return {
    score: total,
    profile,
    ...PROFILE_LABELS[profile],
  };
}
