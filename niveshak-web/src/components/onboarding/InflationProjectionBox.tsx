import { useTranslation } from '@hooks/useTranslation';
import { formatRupee } from '@engine/inflationProjector';
import type { InflationProjection } from '@t/onboarding';

interface Props { projection: InflationProjection; }

export function InflationProjectionBox({ projection }: Props) {
  const { t } = useTranslation();
  const { todayAmount, adjustedCorpus, targetYear, yearsToGoal, inflationRate } = projection;
  return (
    <div className="bg-navy-pale border border-navy/20 rounded-lg p-4 flex flex-col gap-2">
      <p className="text-[10px] font-semibold text-navy uppercase tracking-widest">
        {t('onboarding.steps.goalAmount.projectionTitle')}
      </p>
      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-sub">{t('onboarding.steps.goalAmount.projectionToday')}</span>
          <span className="text-content font-semibold">{formatRupee(todayAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sub">{t('onboarding.steps.goalAmount.projectionTimeline')}</span>
          <span className="text-content font-semibold">{yearsToGoal} yrs</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sub">{t('onboarding.steps.goalAmount.projectionInflation')}</span>
          <span className="text-content font-semibold">{(inflationRate * 100).toFixed(0)}%</span>
        </div>
        <div className="h-px bg-line my-1" />
        <div className="flex justify-between">
          <span className="text-accent font-semibold">
            {t('onboarding.steps.goalAmount.projectionTarget', { year: targetYear })}
          </span>
          <span className="text-accent font-bold text-base">{formatRupee(adjustedCorpus)}</span>
        </div>
      </div>
    </div>
  );
}