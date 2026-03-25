import { useState, useEffect, useRef } from 'react';
import { useResultsStore } from '@store/useResultsStore';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useLanguageStore } from '@store/useLanguageStore';
import {
  fetchAIExplanation,
  buildExplanationPayload,
} from '@lib/anthropic';

type CardState = 'idle' | 'loading' | 'done' | 'error';

export function AIExplanationCard() {
  const results = useResultsStore((s) => s.results);
  const answers = useOnboardingStore((s) => s.answers);
  const language = useLanguageStore((s) => s.language);

  const [state, setState] = useState<CardState>('idle');
  const [explanation, setExplanation] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (state !== 'done' || !explanation) return;

    let idx = 0;
    setDisplayedText('');

    const timer = setInterval(() => {
      idx++;
      setDisplayedText(explanation.slice(0, idx));
      if (idx >= explanation.length) clearInterval(timer);
    }, 18);

    return () => clearInterval(timer);
  }, [state, explanation]);

  const handleGenerate = async () => {
    if (!results) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState('loading');
    setErrorMsg('');
    setExplanation('');
    setDisplayedText('');

    try {
      const payload = buildExplanationPayload(
        results,
        answers,
        language as 'en' | 'hi'
      );
      const text = await fetchAIExplanation(payload, controller.signal);
      setExplanation(text);
      setState('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setErrorMsg(
        (err as Error).message || 'Something went wrong. Please try again.'
      );
      setState('error');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  if (!results) return null;

  return (
    <div className="bg-black-light border border-border-dark rounded-lg p-5">
      <p className="text-[10px] font-semibold text-lime uppercase tracking-widest mb-3">
        {language === 'hi'
          ? '\u0906\u092A\u0915\u0947 \u0932\u093F\u090F AI \u0938\u0932\u093E\u0939'
          : 'AI Explanation'}
      </p>

      {state === 'idle' && (
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full py-3 rounded-lg bg-lime text-black font-semibold text-sm hover:brightness-110 transition-all active:scale-[0.98]"
        >
          {language === 'hi'
            ? '\u092E\u0947\u0930\u0940 \u092F\u094B\u091C\u0928\u093E \u0938\u092E\u091D\u093E\u0913'
            : 'Explain My Plan'}
        </button>
      )}

      {state === 'loading' && (
        <div className="flex items-center gap-3 py-3">
          <div className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-grey-mid text-sm">
            {language === 'hi'
              ? 'AI \u0938\u094B\u091A \u0930\u0939\u093E \u0939\u0948\u2026'
              : 'AI is thinking\u2026'}
          </p>
        </div>
      )}

      {state === 'done' && (
        <div>
          <p className="text-white text-sm leading-relaxed">{displayedText}</p>
          <button
            type="button"
            onClick={handleGenerate}
            className="mt-3 text-lime text-xs font-medium hover:underline"
          >
            {language === 'hi'
              ? '\u092B\u093F\u0930 \u0938\u0947 \u0938\u092E\u091D\u093E\u0913'
              : 'Regenerate'}
          </button>
        </div>
      )}

      {state === 'error' && (
        <div>
          <p className="text-red-400 text-sm mb-2">{errorMsg}</p>
          <button
            type="button"
            onClick={handleGenerate}
            className="text-lime text-xs font-medium hover:underline"
          >
            {language === 'hi'
              ? '\u092B\u093F\u0930 \u0938\u0947 \u0915\u094B\u0936\u093F\u0936 \u0915\u0930\u0947\u0902'
              : 'Try again'}
          </button>
        </div>
      )}
    </div>
  );
}