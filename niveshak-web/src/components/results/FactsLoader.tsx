import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@store/useLanguageStore';

const FACTS = [
  {
    en: 'India has over 500 mutual fund schemes managing ₹50+ lakh crore in assets.',
    hi: 'भारत में ₹50+ लाख करोड़ की AUM के साथ 500 से अधिक म्यूचुअल फंड योजनाएं हैं।',
  },
  {
    en: 'Starting a SIP at age 25 vs 35 can nearly double your retirement corpus.',
    hi: '25 वर्ष में SIP शुरू करने से 35 की तुलना में रिटायरमेंट कोष लगभग दोगुना हो सकता है।',
  },
  {
    en: 'PPF offers completely tax-free returns — one of India\'s safest long-term instruments.',
    hi: 'PPF पूरी तरह कर-मुक्त रिटर्न देता है — भारत के सबसे सुरक्षित दीर्घकालिक साधनों में से एक।',
  },
  {
    en: 'Gold has delivered ~11% average annual returns over the last 20 years in India.',
    hi: 'पिछले 20 वर्षों में भारत में सोने ने ~11% औसत वार्षिक रिटर्न दिया है।',
  },
  {
    en: 'NPS Tier-1 gives an extra ₹50,000 tax deduction under Section 80CCD(1B).',
    hi: 'NPS टियर-1 धारा 80CCD(1B) के तहत अतिरिक्त ₹50,000 की कर कटौती देता है।',
  },
  {
    en: 'The power of compounding works best when you stay invested for 10+ years.',
    hi: 'चक्रवृद्धि की शक्ति तब सबसे अधिक काम करती है जब आप 10+ वर्षों तक निवेशित रहते हैं।',
  },
];

const DURATION_MS = 4000;
const FACT_INTERVAL_MS = 1400;

interface Props {
  onDone: () => void;
}

export function FactsLoader({ onDone }: Props) {
  const language = useLanguageStore(s => s.language);
  const isHindi = language === 'hi';

  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FACTS.length));
  const [progress, setProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Rotate facts with fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setFactIndex(i => (i + 1) % FACTS.length);
        setFadeIn(true);
      }, 250);
    }, FACT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Progress bar + completion
  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / DURATION_MS, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(tick);
        onDoneRef.current();
      }
    }, 50);
    return () => clearInterval(tick);
  }, []);

  const fact = FACTS[factIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] gap-8 px-6 max-w-md mx-auto text-center">
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 border-[3px] border-accent/20 rounded-full" />
        <div className="absolute inset-0 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Label */}
      <p className="text-[10px] font-semibold text-accent uppercase tracking-widest -mb-4">
        {isHindi ? 'आपकी योजना बन रही है…' : 'Building your plan…'}
      </p>

      {/* Financial fact */}
      <div
        className="min-h-[4.5rem] flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: fadeIn ? 1 : 0 }}
      >
        <p className="font-sora font-semibold text-content text-sm leading-relaxed">
          💡&nbsp;{isHindi ? fact.hi : fact.en}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-75 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
