import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResultsStore } from '@store/useResultsStore';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useRecommendation } from '@hooks/useRecommendation';
import { useTranslation } from '@hooks/useTranslation';
import { ScoreRing } from '@components/results/ScoreRing';
import { CorpusCard } from '@components/results/CorpusCard';
import { AllocationPieChart } from '@components/results/AllocationPieChart';
import { InstrumentCard } from '@components/results/InstrumentCard';
import { AIExplanationCard } from '@components/results/AIExplanationCard';
import { FactsLoader } from '@components/results/FactsLoader';
import { Disclaimer } from '@components/common/Disclaimer';
import { Button } from '@components/common/Button';

export default function ResultsPage() {
  const { t, isHindi } = useTranslation();
  const navigate = useNavigate();
  const { results, isLoading, error } = useResultsStore();
  const answers = useOnboardingStore(s => s.answers);
  const { generate } = useRecommendation();
  // Show loader only for fresh computations — skip if results were already cached on mount
  const [loaderDone, setLoaderDone] = useState(() => results !== null);

  useEffect(() => {
    // If user lands here without any onboarding data, redirect them
    if (!results && !answers.name && !answers.occupation) {
      navigate('/discover');
      return;
    }
    if (!results) {
      generate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4-second facts loader (shown before revealing freshly computed results)
  if (!loaderDone) {
    return <FactsLoader onDone={() => setLoaderDone(true)} />;
  }

  // Show engine/network error
  if (error && !results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 px-6 text-center">
        <p className="text-sub text-sm">{error}</p>
        <Button onClick={() => { navigate('/discover'); }}>{t('landing.ctaPrimary')}</Button>
      </div>
    );
  }

  // Unexpected loading state after loader (engine is synchronous, should not linger)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-6">
        <div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sub font-sora text-sm">
          {isHindi ? 'आपकी योजना तैयार हो रही है…' : 'Calculating your plan…'}
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 px-6 text-center">
        <p className="text-sub text-sm">{t('results.noResults')}</p>
        <Button onClick={() => navigate('/discover')}>{t('landing.ctaPrimary')}</Button>
      </div>
    );
  }

  const {
    riskScore,
    riskProfile,
    riskProfileLabelEn,
    riskProfileLabelHi,
    riskProfileDescEn,
    riskProfileDescHi,
    inflationProjection,
    recommendations,
    totalMonthlyAmount,
  } = results;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6 flex flex-col gap-5 overflow-x-hidden">
      {/* Greeting */}
      <div>
        <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-1">
          {t('results.greeting')}
        </p>
        {answers.name && (
          <h2 className="font-sora font-extrabold text-content text-xl sm:text-2xl">
            {t('results.hello', { name: answers.name })}
          </h2>
        )}
      </div>

      {/* Row A: Score ring + AI Advisor side by side */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card border border-line rounded-lg p-5 flex flex-col items-center gap-4">
          <ScoreRing
            score={riskScore}
            profile={riskProfile}
            label={isHindi ? riskProfileLabelHi : riskProfileLabelEn}
          />
          <p className="text-sub text-xs text-center leading-relaxed">
            {isHindi ? riskProfileDescHi : riskProfileDescEn}
          </p>
        </div>
        <AIExplanationCard />
      </div>

      {/* Row B: Goal summary + Pie chart side by side */}
      <div className="grid sm:grid-cols-2 gap-4">
        <CorpusCard projection={inflationProjection} />
        {recommendations.length > 0 && (
          <AllocationPieChart
            recommendations={recommendations}
            totalMonthly={totalMonthlyAmount}
          />
        )}
      </div>

      {/* Row C: Instrument cards — full width 2-col grid */}
      <div>
        <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-3">
          {t('results.sections.instruments')}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {recommendations.map(rec => (
            <InstrumentCard key={rec.instrument.id} rec={rec} />
          ))}
        </div>
      </div>

      {/* Row D: Recalculate + Disclaimer — full width */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" fullWidth onClick={() => navigate('/discover')}>
          {t('results.recalculate')}
        </Button>
        <Disclaimer />
      </div>
    </div>
  );
}
