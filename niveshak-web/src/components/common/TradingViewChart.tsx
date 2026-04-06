import { useEffect, useRef } from 'react';
import { useThemeStore } from '@store/useThemeStore';

interface Props {
  symbol: string;
  label: string;
  dateRange?: '1D' | '1M' | '3M' | '12M';
}

export function TradingViewChart({ symbol, label, dateRange = '1D' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();
  const colorTheme = theme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Re-create widget on theme change
    el.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    el.appendChild(inner);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    // TradingView reads config from the script's text content
    script.innerHTML = JSON.stringify({
      symbol,
      width: '100%',
      height: 140,
      locale: 'en',
      dateRange,
      colorTheme,
      isTransparent: true,
      autosize: false,
      largeChartUrl: '',
    });
    el.appendChild(script);
  }, [symbol, colorTheme, dateRange]);

  return (
    <div className="rounded-lg overflow-hidden border border-line bg-card">
      <p className="text-[11px] font-semibold text-hint font-sora px-3 pt-2.5 pb-0.5 uppercase tracking-wide">
        {label}
      </p>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
