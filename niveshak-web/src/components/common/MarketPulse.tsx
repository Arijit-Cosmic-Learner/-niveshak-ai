import { useEffect, useState } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

interface LiveData {
  nifty50: { price: number; change: number; pct: number };
  usdinr:  { price: number; change: number; pct: number };
  gold:    { price: number; change: number; pct: number };
}

// RBI/GOI published figures — update periodically
const STATIC_METRICS = [
  {
    id: 'repo',
    label: 'RBI Repo Rate',
    value: '6.25%',
    sub: 'Policy rate · Apr 2025',
    hint: 'Drives FD & bond yields',
  },
  {
    id: 'cpi',
    label: 'CPI Inflation',
    value: '3.61%',
    sub: 'Feb 2026 · MoSPI',
    hint: 'Real return enemy',
  },
  {
    id: 'gsec',
    label: '10Y G-Sec Yield',
    value: '6.72%',
    sub: 'Mar 2026 · RBI',
    hint: 'Risk-free debt benchmark',
  },
];

function ChangeBadge({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold font-sora px-1.5 py-0.5 rounded-md ${
        up ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEE2E2] text-[#DC2626]'
      }`}
    >
      {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

function LiveCard({
  label,
  value,
  sub,
  hint,
  pct,
  loading,
}: {
  label: string;
  value: string;
  sub: string;
  hint: string;
  pct: number;
  loading: boolean;
}) {
  return (
    <div className="bg-card border border-line rounded-lg p-3 flex flex-col gap-1.5">
      <p className="text-[10px] uppercase tracking-wider text-hint font-sora font-semibold">
        {label}
      </p>
      {loading ? (
        <div className="flex flex-col gap-1.5">
          <div className="h-5 w-24 bg-input rounded animate-pulse" />
          <div className="h-3.5 w-16 bg-input rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-sora font-extrabold text-content text-lg leading-none">
              {value}
            </span>
            <ChangeBadge pct={pct} />
          </div>
          <p className="text-[10px] text-sub leading-snug">{sub}</p>
        </>
      )}
      <p className="text-[10px] text-hint mt-auto pt-1 border-t border-line/50">{hint}</p>
    </div>
  );
}

function StaticCard({
  label,
  value,
  sub,
  hint,
}: {
  label: string;
  value: string;
  sub: string;
  hint: string;
}) {
  return (
    <div className="bg-card border border-line rounded-lg p-3 flex flex-col gap-1.5">
      <p className="text-[10px] uppercase tracking-wider text-hint font-sora font-semibold">
        {label}
      </p>
      <span className="font-sora font-extrabold text-content text-lg leading-none">{value}</span>
      <p className="text-[10px] text-sub leading-snug">{sub}</p>
      <p className="text-[10px] text-hint mt-auto pt-1 border-t border-line/50">{hint}</p>
    </div>
  );
}

export function MarketPulse({ isHindi }: { isHindi: boolean }) {
  const [live, setLive] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const url = SUPABASE_URL
        ? `${SUPABASE_URL}/functions/v1/market-data`
        : '/api/market-data';
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const data: LiveData = await res.json();
      setLive(data);
      setLastUpdated(new Date());
    } catch {
      // silently fail — skeleton stays
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-hint font-sora uppercase tracking-widest">
          {isHindi ? 'लाइव बाज़ार' : 'Live Market Pulse'}
        </p>
        <button
          onClick={load}
          className="text-[10px] text-accent font-sora hover:underline"
          title="Refresh"
        >
          ↻ {lastUpdated
            ? lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : 'Refresh'}
        </button>
      </div>

      {/* 2-col grid of 6 cards */}
      <div className="grid grid-cols-2 gap-2.5 flex-1">
        <LiveCard
          label={isHindi ? 'निफ्टी 50' : 'Nifty 50'}
          value={loading || !live ? '—' : fmt(live.nifty50.price)}
          sub={loading || !live ? '' : `Δ ${live.nifty50.change >= 0 ? '+' : ''}${fmt(live.nifty50.change)} pts`}
          hint={isHindi ? 'भारतीय इक्विटी बेंचमार्क' : 'India equity benchmark'}
          pct={live?.nifty50.pct ?? 0}
          loading={loading}
        />
        <LiveCard
          label={isHindi ? 'सोना (₹/10g)' : 'Gold (₹/10g)'}
          value={loading || !live ? '—' : `₹${fmt(live.gold.price)}`}
          sub={loading || !live ? '' : `Δ ${live.gold.change >= 0 ? '+' : ''}₹${fmt(live.gold.change)}`}
          hint={isHindi ? 'MCX गोल्ड फ्यूचर्स' : 'MCX Gold futures (derived)'}
          pct={live?.gold.pct ?? 0}
          loading={loading}
        />
        <LiveCard
          label="USD / INR"
          value={loading || !live ? '—' : `₹${live.usdinr.price.toFixed(2)}`}
          sub={loading || !live ? '' : `Δ ${live.usdinr.change >= 0 ? '+' : ''}${live.usdinr.change.toFixed(4)}`}
          hint={isHindi ? 'विदेशी मुद्रा दर' : 'Foreign exchange rate'}
          pct={live?.usdinr.pct ?? 0}
          loading={loading}
        />
        {STATIC_METRICS.map(m => (
          <StaticCard key={m.id} label={m.label} value={m.value} sub={m.sub} hint={m.hint} />
        ))}
      </div>

      <p className="text-[9px] text-hint text-center font-sora">
        {isHindi
          ? 'डेटा Yahoo Finance · 15-मिनट विलंबित हो सकता है'
          : 'Data via Yahoo Finance · may be 15-min delayed'}
      </p>
    </div>
  );
}
