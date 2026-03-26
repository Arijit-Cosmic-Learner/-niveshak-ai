// supabase/functions/explain-recommendation/index.ts
// Deno Edge Function — proxies AI explanation requests.
// Priority: ANTHROPIC_API_KEY (paid) → GEMINI_API_KEY (free)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RequestPayload {
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

function readable(val: string): string {
  return val.replace(/_/g, ' ').toLowerCase();
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
      ? 'Reply ONLY in simple Hindi (Devanagari script). Use very short sentences. Write like you are talking to a daily-wage worker.'
      : 'Reply ONLY in simple English. Write like a trusted friend giving advice. No jargon.';

  return `You are Niveshak AI \u2014 a warm, knowledgeable Indian financial advisor helping first-time investors.

USER PROFILE:
- Name: ${p.userName}
- State: ${p.state || 'India'}
- Occupation: ${readable(p.occupation)}
- Monthly take-home income: \u20B9${p.inHandIncome.toLocaleString('en-IN')}
- Monthly surplus available to invest: \u20B9${p.monthlySurplus.toLocaleString('en-IN')}
- Past investment experience: ${readable(p.experience)}
- Reaction to a 15% market drop: ${readable(p.riskTolerance)}
- Risk Score: ${p.riskScore}/100 \u2192 ${p.riskProfileLabel}

FINANCIAL GOAL:
- Goal: ${readable(p.goalType)}
- Amount needed in today's value: \u20B9${p.goalAmount.toLocaleString('en-IN')}
- Inflation-adjusted target in ${p.yearsToGoal} years: \u20B9${p.adjustedCorpus.toLocaleString('en-IN')}
- Timeline: ${readable(p.timeline)}
- Committed monthly investment: \u20B9${p.monthlyInvestment.toLocaleString('en-IN')}

RECOMMENDED INVESTMENT PLAN:
${instrumentLines}

YOUR TASK:
Write a personalised advisory note of exactly 3\u20134 sentences for ${p.userName}.
- Sentence 1: Acknowledge their specific life situation (occupation, income level, experience).
- Sentence 2: Explain why THIS specific combination of instruments suits their goal and timeline.
- Sentence 3: Highlight ONE concrete advantage of the top instrument for their exact situation.
- Sentence 4: End with a warm, encouraging statement about their financial future.

${lang}

Do NOT list instruments. Do NOT use bullet points. Write flowing prose only. Do NOT include a greeting or sign-off.`;
}

// ─── Anthropic Provider ──────────────────────────────────────────
async function callAnthropic(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
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

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.content?.[0]?.type === 'text' ? data.content[0].text : '';
}

// ─── Groq Provider (free tier — llama-3.1-8b-instant) ───────────
async function callGroq(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 600,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
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

  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  const groqKey = Deno.env.get('GROQ_API_KEY');

  if (!anthropicKey && !groqKey) {
    return new Response(
      JSON.stringify({ error: 'No AI provider configured. Set GROQ_API_KEY or ANTHROPIC_API_KEY.' }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const payload: RequestPayload = await req.json();
    const prompt = buildPrompt(payload);

    // Prefer Anthropic if available, fall back to Groq (free)
    let text: string;
    if (anthropicKey) {
      text = await callAnthropic(prompt, anthropicKey);
    } else {
      text = await callGroq(prompt, groqKey!);
    }

    return new Response(JSON.stringify({ explanation: text }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[explain-recommendation] Error:', err);
    return new Response(
      JSON.stringify({ error: 'AI service unavailable', detail: String(err) }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});
