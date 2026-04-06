// supabase/functions/market-data/index.ts
// Deno Edge Function — fetches live Nifty 50, Gold (MCX ₹/10g) and USD/INR
// from Yahoo Finance and returns clean JSON for the Niveshak splash page.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// Cache for 5 minutes so we don't hammer Yahoo during peak usage
let cache: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

async function yahoo(symbol: string) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?interval=1d&range=2d`;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Yahoo ${symbol}: ${res.status}`);
  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No meta for ${symbol}`);
  const price: number = meta.regularMarketPrice ?? 0;
  const prev: number = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prev;
  const pct    = prev ? (change / prev) * 100 : 0;
  return { price, prev, change, pct };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    // Return cached data if fresh
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      return new Response(JSON.stringify(cache.data), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Parallel fetch — ^NSEI (Nifty 50), USDINR=X, GC=F (Gold futures USD/oz)
    const [nifty, fx, goldUsd] = await Promise.all([
      yahoo('^NSEI'),
      yahoo('USDINR=X'),
      yahoo('GC=F'),
    ]);

    // Convert gold: USD/troy-oz → INR/10g  (1 troy oz = 31.1035 g)
    const ozToTenG = 10 / 31.1035;
    const goldInr: number = goldUsd.price * fx.price * ozToTenG;
    const goldPrevInr: number = goldUsd.prev * fx.prev * ozToTenG;
    const goldChange = goldInr - goldPrevInr;
    const goldPct    = goldPrevInr ? (goldChange / goldPrevInr) * 100 : 0;

    const data = {
      nifty50: {
        price:  Math.round(nifty.price),
        change: parseFloat(nifty.change.toFixed(2)),
        pct:    parseFloat(nifty.pct.toFixed(2)),
      },
      usdinr: {
        price:  parseFloat(fx.price.toFixed(4)),
        change: parseFloat(fx.change.toFixed(4)),
        pct:    parseFloat(fx.pct.toFixed(2)),
      },
      gold: {
        price:  Math.round(goldInr),
        change: Math.round(goldChange),
        pct:    parseFloat(goldPct.toFixed(2)),
      },
    };

    cache = { data, ts: Date.now() };

    return new Response(JSON.stringify(data), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
