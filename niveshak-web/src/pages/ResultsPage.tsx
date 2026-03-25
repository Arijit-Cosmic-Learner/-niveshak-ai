import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResultsStore } from '@store/useResultsStore';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useRecommendation } from '@hooks/useRecommendation';
import { useTranslation } from '@hooks/useTranslation';
import { ScoreRing } from '@components/results/ScoreRing';
import { CorpusCard } from '@components/results/CorpusCard';
import { AllocationBar } from '@components/results/AllocationBar';
import { AllocationCard } from '@components/results/AllocationCard';
import { InstrumentCard } from '@components/results/InstrumentCard';
import { AIExplanationCard } from '@components/results/AIExplanationCard';
import { Disclaimer } from '@components/common/Disclaimer';
import { Button } from '@components/common/Button';

export default function ResultsPage() {
  const { t, isHindi } = useTranslation();
  const navigate = useNavigate();
  const { results, isLoading } = useResultsStore();
  const answers = useOnboardingStore(s => s.answers);
  const { generate } = useRecommendation();

  useEffect(() => {
    if (!results && answers.name) {
      generate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="max-w-7xl mx-auto w-full px-5 py-6">
      {/* Greeting */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-1">
          {t('results.greeting')}
        </p>
        {answers.name && (
          <h2 className="font-sora font-extrabold text-content text-2xl">
            {t('results.hello', { name: answers.name })}
          </h2>
        )}
      </div>

      {/* 2-col on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-6">
        {/* Left col */}
        <div className="flex flex-col gap-5">
          {/* Score ring */}
          <div className="bg-card border border-line rounded-lg p-6 flex flex-col items-center gap-4">
            <ScoreRing
              score={riskScore}
              profile={riskProfile}
            label={isHindi ? riskProfileLabelHi : riskProfileLabelEn}
            />
            <p className="text-sub text-xs text-center leading-relaxed">
              {isHindi ? riskProfileDescHi : riskProfileDescEn}
            </p>
          </div>

          {/* Goal & inflation projection */}
          <CorpusCard projection={inflationProjection} />

          {/* Allocation bar */}
          {recommendations.length > 0 && (
            <div className="bg-card border border-line rounded-lg p-4">
              <AllocationBar recommendations={recommendations} />
            </div>
          )}
          <AllocationCard recommendations={recommendations} totalMonthly={totalMonthlyAmount} />
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-5 mt-5 md:mt-0">
          {/* Instrument cards */}
          <div>
            <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-3">
              {t('results.sections.instruments')}
            </p>
            <div className="flex flex-col gap-3">
              {recommendations.map(rec => (
                <InstrumentCard key={rec.instrument.id} rec={rec} />
              ))}
            </div>
          </div>

          {/* AI Explanation */}
          <AIExplanationCard />

          {/* Recalculate */}
          <Button variant="ghost" fullWidth onClick={() => navigate('/discover')}>
            {t('results.recalculate')}
          </Button>

          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
