/**
 * anthropic.ts — Stub for future AI-powered plan explanation.
 *
 * When VITE_ANTHROPIC_API_KEY is set, this client can generate
 * a natural-language summary of the recommendation result.
 *
 * NOTE: Calling Anthropic directly from the browser leaks your API key.
 * Wire this through a Supabase Edge Function or Vercel serverless route
 * before enabling in production.
 */

export const ANTHROPIC_AVAILABLE =
  Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY) &&
  import.meta.env.PROD === false; // Only allow in dev for now

/**
 * Placeholder — replace body with an Edge Function call when ready.
 * Returns null if Anthropic is not yet configured.
 */
export async function explainPlan(_planSummary: string): Promise<string | null> {
  if (!ANTHROPIC_AVAILABLE) return null;

  // TODO: call /api/explain-plan (Supabase Edge Function) with planSummary
  return null;
}
