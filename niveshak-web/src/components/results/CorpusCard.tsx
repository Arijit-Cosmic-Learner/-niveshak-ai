import { useTranslation } from '@hooks/useTranslation';
import { formatRupee } from '@engine/inflationProjector';
import type { InflationProjection } from '@t/onboarding';

interface Props { projection: InflationProjection; }

export function CorpusCard({ projection }: Props) {
  const { t } = useTranslation();
  const { todayAmount, adjustedCorpus, targetYear, yearsToGoal, inflationRate } = projection;
  return (
    <div className="bg-black-light border border-border-dark rounded-lg p-4 flex flex-col gap-3">
      <p className="text-[10px] font-semibold text-lime uppercase tracking-widest">
        {t('results.sections.goalSummary')}
      </p>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-grey-mid">{t('results.corpus.estimateToday')}</span>
          <span className="text-white font-semibold">{formatRupee(todayAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-grey-mid">
            {t('results.corpus.inflation', { years: yearsToGoal })}
          </span>
          <span className="text-white font-semibold">
            {(inflationRate * 100).toFixed(0)}% p.a.
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-grey-mid">{t('results.corpus.timeline')}</span>
          <span className="text-white font-semibold">{yearsToGoal} yrs</span>
        </div>
        <div className="h-px bg-border-dark" />
        <div className="flex justify-between">
          <span className="text-lime font-semibold">
            {t('results.corpus.targetCorpus', { year: targetYear })}
          </span>
          <span className="text-lime font-extrabold text-lg">{formatRupee(adjustedCorpus)}</span>
        </div>
      </div>
    </div>
  );
}
