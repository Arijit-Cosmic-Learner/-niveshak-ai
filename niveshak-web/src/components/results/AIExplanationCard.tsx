import { useState, useEffect } from 'react';
import { useResultsStore } from '@store/useResultsStore';
import { useLanguageStore } from '@store/useLanguageStore';

export function AIExplanationCard() {
  const results   = useResultsStore(s => s.results);
  const isLoading = useResultsStore(s => s.isLoading);
  const language  = useLanguageStore(s => s.language);
  const [visibleCount, setVisibleCount] = useState(0);

  const bullets = results?.bullets ?? [];
  const isHindi = language === 'hi';

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

  return (
    <div className="bg-navy-pale border border-navy/20 rounded-lg p-5 h-full flex flex-col">
      <p className="text-[10px] font-semibold text-navy uppercase tracking-widest mb-4">
        {isHindi ? 'आपके लिए AI सलाह' : 'AI Plan Advisor'}
      </p>

      {/* Still generating */}
      {isLoading && (
        <div className="flex items-center gap-3 py-2">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-sub text-sm">
            {isHindi ? 'AI आपकी प्रोफ़ाइल देख रहा है…' : 'AI is analysing your profile…'}
          </p>
        </div>
      )}

      {/* Done — show bullets */}
      {!isLoading && bullets.length > 0 && (
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

      {/* AI failed — graceful fallback */}
      {!isLoading && bullets.length === 0 && results && (
        <p className="text-sub text-xs leading-relaxed">
          {isHindi
            ? 'आपका प्लान आपके रिस्क प्रोफाइल और लक्ष्य के अनुसार तैयार किया गया है। ऊपर दिए गए इंस्ट्रूमेंट्स आपकी समयसीमा और बजट के आधार पर चुने गए हैं।'
            : 'Your plan has been built based on your risk profile and goal. The instruments above were matched to your timeline and monthly budget.'}
        </p>
      )}
    </div>
  );
}
