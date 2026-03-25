import { useState, useEffect, useRef, useCallback } from 'react';
import { useResultsStore } from '@store/useResultsStore';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useLanguageStore } from '@store/useLanguageStore';
import { fetchAIExplanation, buildExplanationPayload } from '@lib/anthropic';

type CardState = 'loading' | 'done' | 'error';

export function AIExplanationCard() {
  const results  = useResultsStore((s) => s.results);
  const answers  = useOnboardingStore((s) => s.answers);
  const language = useLanguageStore((s) => s.language);

  const [state, setState]             = useState<CardState>('loading');
  const [explanation, setExplanation] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [errorMsg, setErrorMsg]       = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const doFetch = useCallback(
    async (signal: AbortSignal) => {
      if (!results) return;
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
        const text = await fetchAIExplanation(payload, signal);
        setExplanation(text);
        setState('done');
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setErrorMsg(
          (err as Error).message || 'Something went wrong. Please try again.'
        );
        setState('error');
      }
    },
    [results, answers, language]
  );

  // Auto-trigger as soon as the card mounts (results are already computed)
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    doFetch(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typewriter reveal once explanation arrives
  useEffect(() => {
    if (state !== 'done' || !explanation) return;
    let idx = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      idx++;
      setDisplayedText(explanation.slice(0, idx));
      if (idx >= explanation.length) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [state, explanation]);

  // Cleanup on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleRegenerate = () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    doFetch(controller.signal);
  };

  if (!results) return null;

  return (
    <div className="bg-black-light border border-border-dark rounded-lg p-5">
      <p className="text-[10px] font-semibold text-lime uppercase tracking-widest mb-3">
        {language === 'hi'
          ? '\u0906\u092A\u0915\u0947 \u0932\u093F\u090F AI \u0938\u0932\u093E\u0939'
          : 'AI Plan Advisor'}
      </p>

      {state === 'loading' && (
        <div className="flex items-center gap-3 py-2">
          <div className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-grey-mid text-sm">
            {language === 'hi'
              ? 'AI \u0906\u092A\u0915\u0940 \u092A\u0942\u0930\u0940 \u092A\u094D\u0930\u094B\u092B\u093E\u0907\u0932 \u0926\u0947\u0916 \u0930\u0939\u093E \u0939\u0948\u2026'
              : 'AI is reading your full profile\u2026'}
          </p>
        </div>
      )}

      {state === 'done' && (
        <div>
          <p className="text-white text-sm leading-relaxed">{displayedText}</p>
          <button
            type="button"
            onClick={handleRegenerate}
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
          <p className="text-red-400 text-xs mb-2 break-words">{errorMsg}</p>
          <button
            type="button"
            onClick={handleRegenerate}
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