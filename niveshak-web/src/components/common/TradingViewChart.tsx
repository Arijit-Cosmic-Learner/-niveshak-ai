import { useEffect, useRef } from 'react';
import { useThemeStore } from '@store/useThemeStore';

interface Props {
  symbol: string;
  label: string;
  dateRange?: '1D' | '1M' | '3M' | '12M';
}

export function TradingViewChart({ symbol, label, dateRange = '12M' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();
  const colorTheme = theme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Wipe previous widget
    el.innerHTML = '';
    el.className = 'tradingview-widget-container';

    // TradingView requires this inner div as the render target
    const inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    el.appendChild(inner);

    const config = {
      symbol,
      width: '100%',
      height: 220,
      locale: 'en',
      dateRange,
      colorTheme,
      isTransparent: false,
      autosize: false,
      largeChartUrl: '',
      chartOnly: true,
      noTimeScale: false,
    };

    // TradingView reads config from the script element's textContent
    // We must use createTextNode — innerHTML on a script with src is unreliable
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.appendChild(document.createTextNode(JSON.stringify(config)));
    // Setting src after textContent triggers load when appended to DOM
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    el.appendChild(script);

    return () => {
      el.innerHTML = '';
    };
  }, [symbol, colorTheme, dateRange]);

  return (
    <div className="rounded-lg overflow-hidden border border-line bg-card">
      <p className="text-[11px] font-semibold text-hint font-sora px-3 pt-2 pb-1 uppercase tracking-wide">
        {label}
      </p>
      <div ref={containerRef} style={{ minHeight: 220 }} />
    </div>
  );
}
