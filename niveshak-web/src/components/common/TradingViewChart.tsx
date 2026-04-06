import { useEffect, useRef } from 'react';
import { useThemeStore } from '@store/useThemeStore';

interface Props {
  symbol: string;
  label: string;
}

export function TradingViewChart({ symbol, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();
  const colorTheme = theme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = '';

    const tvContainer = document.createElement('div');
    tvContainer.className = 'tradingview-widget-container';

    const inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    tvContainer.appendChild(inner);

    const config = {
      symbols:        [[`${symbol}|12M`]],
      chartOnly:      false,
      width:          '100%',
      height:         260,
      locale:         'en',
      colorTheme,
      autosize:       false,
      showVolume:     false,
      showMA:         false,
      chartType:      'area',
      changeMode:     'price-and-percent',
      scalePosition:  'right',
      scaleMode:      'Normal',
      fontSize:       '10',
      noTimeScale:    false,
      valuesTracking: '1',
    };

    const script = document.createElement('script');
    script.type  = 'text/javascript';
    script.async = true;
    script.appendChild(document.createTextNode(JSON.stringify(config)));
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    tvContainer.appendChild(script);

    el.appendChild(tvContainer);

    return () => { el.innerHTML = ''; };
  }, [symbol, colorTheme]);

  return (
    <div className="rounded-lg border border-line bg-card">
      <p className="text-[11px] font-semibold text-hint font-sora px-3 pt-2 pb-0.5 uppercase tracking-wide">
        {label}
      </p>
      <div ref={containerRef} style={{ height: 260, width: '100%' }} />
    </div>
  );
}
