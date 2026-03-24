import {
  ExperienceType,
  RiskProfile,
  RiskToleranceType,
  OccupationType,
  TimelineType,
  type OnboardingAnswers,
} from '@t/onboarding';

// --- Scoring weights -------------------------------------------------------
// Total max score: 100
// - Experience:     0-25
// - Risk tolerance: 0-35
// - Timeline:       0-25
// - Occupation:     0-15

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
  score: number;        // 0-100
  profile: RiskProfile;
  labelEn: string;
  labelHi: string;
  descEn: string;
  descHi: string;
}

const PROFILE_LABELS: Record<RiskProfile, { labelEn: string; labelHi: string; descEn: string; descHi: string }> = {
  [RiskProfile.CONSERVATIVE]: {
    labelEn: 'Conservative Investor',
    labelHi: '\u0930\u0915\u094D\u0937\u093E\u0924\u094D\u092E\u0915 \u0928\u093F\u0935\u0947\u0936\u0915',
    descEn:  'Safety is your top priority. Government and bank-backed instruments with guaranteed returns suit you best.',
    descHi:  '\u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0906\u092A\u0915\u0940 \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E \u0939\u0948\u0964 \u0917\u093E\u0930\u0902\u091F\u0940\u0921 \u0930\u093F\u091F\u0930\u094D\u0928 \u0935\u093E\u0932\u0947 \u0938\u0930\u0915\u093E\u0930\u0940 \u0914\u0930 \u092C\u0948\u0902\u0915-\u0938\u092E\u0930\u094D\u0925\u093F\u0924 \u0938\u093E\u0927\u0928 \u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0938\u0930\u094D\u0935\u0936\u094D\u0930\u0947\u0937\u094D\u0920 \u0939\u0948\u0902\u0964',
  },
  [RiskProfile.BALANCED]: {
    labelEn: 'Balanced Investor',
    labelHi: '\u0938\u0902\u0924\u0941\u0932\u093F\u0924 \u0928\u093F\u0935\u0947\u0936\u0915',
    descEn:  'You want steady growth with a safety net. A mix of guaranteed and market-linked instruments suits you.',
    descHi:  '\u0906\u092A \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0915\u0947 \u0938\u093E\u0925 \u0938\u094D\u0925\u093F\u0930 \u0935\u093F\u0915\u093E\u0938 \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902\u0964 \u0917\u093E\u0930\u0902\u091F\u0940\u0921 \u0914\u0930 \u092C\u093E\u091C\u093C\u093E\u0930-\u091C\u0941\u095C\u0947 \u0938\u093E\u0927\u0928\u094B\u0902 \u0915\u093E \u092E\u093F\u0936\u094D\u0930\u0923 \u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u0939\u0948\u0964',
  },
  [RiskProfile.GROWTH]: {
    labelEn: 'Growth Investor',
    labelHi: '\u0935\u093F\u0915\u093E\u0938-\u0909\u0928\u094D\u092E\u0941\u0916 \u0928\u093F\u0935\u0947\u0936\u0915',
    descEn:  'You can handle market swings for higher long-term returns. Equity-heavy instruments are your best bet.',
    descHi:  '\u0906\u092A \u0909\u091A\u094D\u091A \u0926\u0940\u0930\u094D\u0918\u0915\u093E\u0932\u093F\u0915 \u0930\u093F\u091F\u0930\u094D\u0928 \u0915\u0947 \u0932\u093F\u090F \u092C\u093E\u091C\u093C\u093E\u0930 \u0909\u0924\u093E\u0930-\u091A\u095D\u093E\u0935 \u0938\u0939\u0928 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964 \u0907\u0915\u094D\u0935\u093F\u091F\u0940-\u092D\u093E\u0930\u0940 \u0938\u093E\u0927\u0928 \u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0938\u0930\u094D\u0935\u0936\u094D\u0930\u0947\u0937\u094D\u0920 \u0939\u0948\u0902\u0964',
  },
};

export function scoreRisk(answers: OnboardingAnswers): RiskScoreResult {
  const expScore  = answers.experience    ? EXPERIENCE_SCORES[answers.experience]        : 0;
  const riskScore = answers.riskTolerance ? RISK_TOLERANCE_SCORES[answers.riskTolerance] : 0;
  const timeScore = answers.timeline      ? TIMELINE_SCORES[answers.timeline]            : 0;
  const occScore  = answers.occupation    ? OCCUPATION_SCORES[answers.occupation]        : 0;

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