import { useTranslation } from '@hooks/useTranslation';
import { formatRupee } from '@engine/inflationProjector';
import type { InflationProjection } from '@t/onboarding';

interface Props { projection: InflationProjection; }

export function CorpusCard({ projection }: Props) {
  const { t } = useTranslation();
  const { todayAmount, adjustedCorpus, targetYear, yearsToGoal, inflationRate } = projection;
  return (
    <div className="bg-card border border-line rounded-lg p-4 flex flex-col gap-3">
      <p className="text-[10px] font-semibold text-accent uppercase tracking-widest">
        {t('results.sections.goalSummary')}
      </p>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-sub">{t('results.corpus.estimateToday')}</span>
          <span className="text-content font-semibold">{formatRupee(todayAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sub">{t('results.corpus.inflation', { years: yearsToGoal })}</span>
          <span className="text-content font-semibold">{(inflationRate * 100).toFixed(0)}% p.a.</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sub">{t('results.corpus.timeline')}</span>
          <span className="text-content font-semibold">{yearsToGoal} yrs</span>
        </div>
        <div className="h-px bg-line" />
        <div className="flex justify-between">
          <span className="text-navy font-semibold">
            {t('results.corpus.targetCorpus', { year: targetYear })}
          </span>
          <span className="text-navy font-extrabold text-lg">{formatRupee(adjustedCorpus)}</span>
        </div>
      </div>
    </div>
  );
}