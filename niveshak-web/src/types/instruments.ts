import { GoalType, TimelineType, RiskProfile } from './onboarding';

export enum InstrumentType {
	GOVERNMENT_SCHEME = 'Government Scheme',
	MUTUAL_FUND       = 'Mutual Fund',
	GOLD              = 'Gold',
	BANK_SCHEME       = 'Bank Scheme',
	NPS               = 'NPS',
}

export enum RiskLevel {
	VERY_LOW     = 'Very Low',
	LOW          = 'Low',
	LOW_MEDIUM   = 'Low–Medium',
	MEDIUM       = 'Medium',
	MEDIUM_HIGH  = 'Medium–High',
	HIGH         = 'High',
}

export interface Instrument {
	id:               string;
	nameEn:           string;
	nameHi:           string;
	type:             InstrumentType;
	riskLevel:        RiskLevel;
	returnsLabel:     string;
	whyEn:            string;
	whyHi:            string;
	platform:         string;
	ctaLabelEn:       string;
	ctaLabelHi:       string;
	minMonthly:       number;
	lockInYears?:     number;
	taxBenefit?:      string;
	isGovernmentBacked: boolean;
	suitableGoals:    GoalType[];
	minTimeline:      TimelineType;
	maxRiskProfile:   RiskProfile;
}

export interface InstrumentRecommendation {
	instrument:       Instrument;
	allocationPercent: number;
	monthlyAmount:    number;
	rank:             number;
	reasonEn:         string;
	reasonHi:         string;
}

import type { InflationProjection } from './onboarding';

export interface RecommendationResult {
	riskScore:            number;
	riskProfile:          RiskProfile;
	riskProfileLabelEn:   string;
	riskProfileLabelHi:   string;
	riskProfileDescEn:    string;
	riskProfileDescHi:    string;
	inflationProjection:  InflationProjection;
	recommendations:      InstrumentRecommendation[];
	bullets:              string[];
	totalMonthlyAmount:   number;
	generatedAt:          Date;
}
// placeholder — instruments.ts — implementation coming