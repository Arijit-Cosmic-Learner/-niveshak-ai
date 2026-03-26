// supabase/functions/explain-recommendation/index.ts
// Deno Edge Function — AI picks instruments + returns bullet explanations.
// Priority: ANTHROPIC_API_KEY -> GROQ_API_KEY

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AvailableInstrument {
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
}

interface RequestPayload {
  riskScore: number;
  riskProfileLabel: string;
  userName: string;
  state: string;
  occupation: string;
  inHandIncome: number;
  monthlySurplus: number;
  experience: string;
  riskTolerance: string;
  goalType: string;
  goalCustom?: string;
  goalAmount: number;
  adjustedCorpus: number;
  yearsToGoal: number;
  timeline: string;
  monthlyInvestment: number;
  language: 'en' | 'hi';
  availableInstruments: AvailableInstrument[];
}

function readable(val: string): string {
  return val.replace(/_/g, ' ').toLowerCase();
}

function buildPrompt(p: RequestPayload): string {
  const instrLines = p.availableInstruments.map((inst, i) =>
    `${i + 1}. id="${inst.id}" | ${inst.nameEn} | ${inst.type} | Returns: ${inst.returnsLabel} | Risk: ${inst.riskLevel} | Tax: ${inst.taxBenefit ?? 'None'} | Lock-in: ${inst.lockInYears ? inst.lockInYears + ' yr' : 'None'} | Min Rs.${inst.minMonthly}/mo | Govt-backed: ${inst.isGovernmentBacked ? 'Yes' : 'No'} | Why: ${inst.whyEn}`
  ).join('\n');

  const langInstr = p.language === 'hi'
    ? 'Write reasonHi in simple Hindi (Devanagari). Write bullets in Hindi only. Still write reasonEn in English.'
    : 'Write all text in simple English. reasonHi can be a brief Hindi translation of reasonEn.';

  return `You are Niveshak AI -- an expert Indian financial advisor helping first-time investors.

USER PROFILE:
- Name: ${p.userName} | State: ${p.state || 'India'} | Occupation: ${readable(p.occupation)}
- Monthly income: Rs.${p.inHandIncome.toLocaleString('en-IN')} | Monthly surplus: Rs.${p.monthlySurplus.toLocaleString('en-IN')}
- Investment experience: ${readable(p.experience)} | Risk reaction: ${readable(p.riskTolerance)}
- Risk Score: ${p.riskScore}/100 -> ${p.riskProfileLabel}
- Goal: ${p.goalCustom ? `"${p.goalCustom}" (custom)` : readable(p.goalType)} | Timeline: ${readable(p.timeline)} | Years: ${p.yearsToGoal}
- Corpus needed: Rs.${p.adjustedCorpus.toLocaleString('en-IN')} | Monthly investment budget: Rs.${p.monthlyInvestment.toLocaleString('en-IN')}

ELIGIBLE INSTRUMENTS (choose 3 or 4 from this list -- do not invent new ones):
${instrLines}

TASK:
1. Pick the 3 or 4 instruments best suited for this specific user.
2. Assign allocationPercent values that sum to exactly 100.
3. Write a 1-sentence personalised reasonEn (English) and reasonHi (Hindi) per instrument explaining WHY it suits THIS user specifically.
4. Write 3-4 bullet points explaining the overall plan in simple language.

${langInstr}

CRITICAL: Return ONLY valid JSON -- no markdown fences, no explanation outside JSON:
{
  "instrumentAllocations": [
    {"id": "instrument_id", "allocationPercent": 40, "reasonEn": "...", "reasonHi": "..."},
    {"id": "instrument_id", "allocationPercent": 35, "reasonEn": "...", "reasonHi": "..."},
    {"id": "instrument_id", "allocationPercent": 25, "reasonEn": "...", "reasonHi": "..."}
  ],
  "bullets": [
    "First key point about why this plan suits this user",
    "Second key point",
    "Third key point"
  ]
}`;
}

// --- Anthropic Provider -----------------------------------------------
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
      max_tokens: 900,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.type === 'text' ? data.content[0].text : '';
}

// --- Groq Provider -------------------------------------------------------
async function callGroq(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 900,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// --- JSON extraction helper ----------------------------------------------
function extractJSON(raw: string): unknown {
  let text = raw.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) text = fenceMatch[1].trim();
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  return JSON.parse(text);
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  const groqKey      = Deno.env.get('GROQ_API_KEY');

  if (!anthropicKey && !groqKey) {
    return new Response(
      JSON.stringify({ error: 'No AI provider configured.' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const payload: RequestPayload = await req.json();
    const prompt = buildPrompt(payload);

    const rawText = anthropicKey
      ? await callAnthropic(prompt, anthropicKey)
      : await callGroq(prompt, groqKey!);

    const parsed = extractJSON(rawText) as {
      instrumentAllocations: Array<{ id: string; allocationPercent: number; reasonEn: string; reasonHi: string }>;
      bullets: string[];
    };

    if (!Array.isArray(parsed.instrumentAllocations) || !Array.isArray(parsed.bullets)) {
      throw new Error(`Invalid AI response structure: ${rawText.slice(0, 300)}`);
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[explain-recommendation] Error:', err);
    return new Response(
      JSON.stringify({ error: 'AI service unavailable', detail: String(err) }),
      { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
