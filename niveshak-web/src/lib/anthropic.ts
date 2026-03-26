/**
 * anthropic.ts — Calls the Supabase Edge Function to get an AI
 * explanation of the user's personalised investment plan.
 *
 * The Edge Function holds the ANTHROPIC_API_KEY server-side.
 * The browser only sends user profile data + receives the explanation.
 */

import type { RecommendationResult } from '@t/instruments';
import type { OnboardingAnswers } from '@t/onboarding';

export interface AIExplanationPayload {
  // Risk
  riskScore: number;
  riskProfile: string;
  riskProfileLabel: string;
  // User profile
  userName: string;
  state: string;
  occupation: string;
  inHandIncome: number;
  monthlySurplus: number;
  experience: string;
  riskTolerance: string;
  // Goal
  goalType: string;
  goalCustom?: string;   // free-text custom goal when user didn't pick a preset
  goalAmount: number;
  adjustedCorpus: number;
  yearsToGoal: number;
  timeline: string;
  monthlyInvestment: number;
  // Instruments
  instruments: Array<{
    name: string;
    allocationPercent: number;
    monthlyAmount: number;
    returnsLabel: string;
    isGovernmentBacked: boolean;
  }>;
  language: 'en' | 'hi';
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const EDGE_FN_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/explain-recommendation`
  : '';

/**
 * Builds the payload from the recommendation result + onboarding answers.
 */
export function buildExplanationPayload(
  result: RecommendationResult,
  answers: OnboardingAnswers,
  language: 'en' | 'hi'
): AIExplanationPayload {
  return {
    riskScore: result.riskScore,
    riskProfile: result.riskProfile,
    riskProfileLabel:
      language === 'hi' ? result.riskProfileLabelHi : result.riskProfileLabelEn,
    userName: answers.name ?? 'Friend',
    state: answers.state ?? '',
    occupation: answers.occupation ?? '',
    inHandIncome: answers.inHandIncome ?? 0,
    monthlySurplus: answers.monthlySurplus ?? 0,
    experience: answers.experience ?? '',
    riskTolerance: answers.riskTolerance ?? '',
    goalType: answers.goal ?? 'GROW_WEALTH',
    goalCustom: answers.goalCustom,
    goalAmount: answers.goalAmount ?? 0,
    adjustedCorpus: result.inflationProjection.adjustedCorpus,
    yearsToGoal: result.inflationProjection.yearsToGoal,
    timeline: answers.timeline ?? 'NOT_SURE',
    monthlyInvestment: answers.monthlyInvestment ?? 0,
    instruments: result.recommendations.map((rec) => ({
      name:
        language === 'hi' ? rec.instrument.nameHi : rec.instrument.nameEn,
      allocationPercent: rec.allocationPercent,
      monthlyAmount: rec.monthlyAmount,
      returnsLabel: rec.instrument.returnsLabel,
      isGovernmentBacked: rec.instrument.isGovernmentBacked,
    })),
    language,
  };
}

/**
 * Calls the explain-recommendation Edge Function.
 * Returns the explanation text, or throws on failure.
 */
export async function fetchAIExplanation(
  payload: AIExplanationPayload,
  signal?: AbortSignal
): Promise<string> {
  if (!EDGE_FN_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase not configured');
  }

  const res = await fetch(EDGE_FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AI explanation failed (${res.status}): ${body}`);
  }

  const data: { explanation: string } = await res.json();
  return data.explanation;
}

// ─── AI Recommendation (instruments + bullets) ────────────────────

export interface AIInstrumentAllocation {
  id: string;
  allocationPercent: number;
  reasonEn: string;
  reasonHi: string;
}

export interface AIRecommendationResponse {
  instrumentAllocations: AIInstrumentAllocation[];
  bullets: string[];
}

export interface AIRecommendationPayload extends AIExplanationPayload {
  availableInstruments: Array<{
    id: string;
    nameEn: string;
    nameHi: string;
    type: string;
    riskLevel: string;
    returnsLabel: string;
    whyEn: string;
    isGovernmentBacked: boolean;
    lockInYears?: number;
    taxBenefit?: string;
    minMonthly: number;
  }>;
}

export async function fetchAIRecommendation(
  payload: AIRecommendationPayload,
  signal?: AbortSignal
): Promise<AIRecommendationResponse> {
  if (!EDGE_FN_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase not configured');
  }

  // Abort after 15s so we can fall back to local engine promptly
  const timeout = setTimeout(() => controller.abort(), 15_000);
  const controller = new AbortController();
  const combined = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
      signal: combined,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`AI recommendation failed (${res.status}): ${body}`);
    }

    const data = await res.json();
    if (data.error) throw new Error(data.detail ?? data.error);
    return data as AIRecommendationResponse;
  } finally {
    clearTimeout(timeout);
  }
}
