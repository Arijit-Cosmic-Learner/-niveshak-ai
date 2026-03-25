// supabase/functions/explain-recommendation/index.ts
// Deno Edge Function — proxies AI explanation requests to Anthropic Claude.
// Reads ANTHROPIC_API_KEY from Supabase secrets (Deno.env).

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RequestPayload {
  riskScore: number;
  riskProfile: string;
  riskProfileLabel: string;
  goalType: string;
  goalAmount: number;
  adjustedCorpus: number;
  timeline: string;
  monthlyInvestment: number;
  instruments: Array<{
    name: string;
    allocationPercent: number;
    monthlyAmount: number;
    returnsLabel: string;
    isGovernmentBacked: boolean;
  }>;
  language: 'en' | 'hi';
  userName: string;
}

function buildPrompt(p: RequestPayload): string {
  const instrumentLines = p.instruments
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.name} \u2014 ${i.allocationPercent}% (\u20B9${i.monthlyAmount}/mo, ${i.returnsLabel} returns${i.isGovernmentBacked ? ', government-backed' : ''})`
    )
    .join('\n');

  const lang =
    p.language === 'hi'
      ? 'Reply ONLY in simple Hindi (Devanagari script). Use short sentences a daily-wage worker would understand.'
      : 'Reply ONLY in simple English. Use short sentences a first-time investor with basic education would understand.';

  return `You are Niveshak.AI, a friendly Indian financial advisor for first-time investors.

A user named ${p.userName} just completed their risk assessment.

PROFILE:
- Risk Score: ${p.riskScore}/100 (${p.riskProfileLabel} investor)
- Goal: ${p.goalType.replace(/_/g, ' ').toLowerCase()}
- Target amount today: \u20B9${p.goalAmount.toLocaleString('en-IN')}
- Inflation-adjusted target: \u20B9${p.adjustedCorpus.toLocaleString('en-IN')}
- Timeline: ${p.timeline.replace(/_/g, ' ').toLowerCase()}
- Monthly investment capacity: \u20B9${p.monthlyInvestment.toLocaleString('en-IN')}

RECOMMENDED INSTRUMENTS:
${instrumentLines}

TASK:
Write a 2\u20133 sentence personalised explanation of WHY these specific instruments were chosen for this person. Mention their risk profile and goal. Be warm and encouraging. Do NOT use jargon. Do NOT list the instruments again.

${lang}

Do NOT include any greeting or sign-off. Just the explanation.`;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const payload: RequestPayload = await req.json();

    const prompt = buildPrompt(payload);

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      console.error('[explain-recommendation] Anthropic error:', errBody);
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', detail: errBody }),
        {
          status: 502,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await anthropicRes.json();
    const text =
      data.content?.[0]?.type === 'text' ? data.content[0].text : '';

    return new Response(JSON.stringify({ explanation: text }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[explain-recommendation] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});
