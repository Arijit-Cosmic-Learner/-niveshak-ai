import { useState, useEffect } from 'react';
import { useResultsStore } from '@store/useResultsStore';
import { useLanguageStore } from '@store/useLanguageStore';

export function AIExplanationCard() {
  const results  = useResultsStore(s => s.results);
  const language = useLanguageStore(s => s.language);
  const [visibleCount, setVisibleCount] = useState(0);

  const bullets = results?.bullets ?? [];

  // Reveal bullets one by one with a stagger
  useEffect(() => {
    if (!bullets.length) return;
    setVisibleCount(0);
    const timers = bullets.map((_, i) =>
      setTimeout(() => setVisibleCount(n => Math.max(n, i + 1)), i * 500 + 200)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  if (!results) return null;

  return (
    <div className="bg-navy-pale border border-navy/20 rounded-lg p-5 h-full flex flex-col">
      <p className="text-[10px] font-semibold text-navy uppercase tracking-widest mb-4">
        {language === 'hi' ? 'आपके लिए AI सलाह' : 'AI Plan Advisor'}
      </p>

      {bullets.length === 0 ? (
        <p className="text-sub text-xs italic">
          {language === 'hi'
            ? 'AI सलाह इस योजना के लिए उपलब्ध नहीं है।'
            : 'AI advice was not available for this plan.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3 flex-1">
          {bullets.slice(0, visibleCount).map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5"
              style={{ animation: 'fadeSlideIn 0.35s ease both' }}
            >
              <span className="text-accent font-bold mt-0.5 flex-shrink-0 text-sm">▸</span>
              <p className="text-content text-sm leading-relaxed">{bullet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
