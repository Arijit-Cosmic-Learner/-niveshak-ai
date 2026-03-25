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

// ─── Gemini Provider (free tier) ─────────────────────────────────
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
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
  const geminiKey = Deno.env.get('GEMINI_API_KEY');

  if (!anthropicKey && !geminiKey) {
    return new Response(
      JSON.stringify({ error: 'No AI provider configured. Set GEMINI_API_KEY or ANTHROPIC_API_KEY.' }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const payload: RequestPayload = await req.json();
    const prompt = buildPrompt(payload);

    // Prefer Anthropic if available, fall back to Gemini (free)
    let text: string;
    if (anthropicKey) {
      text = await callAnthropic(prompt, anthropicKey);
    } else {
      text = await callGemini(prompt, geminiKey!);
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
