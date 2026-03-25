import { useTranslation } from '@hooks/useTranslation';
import { formatRupee } from '@engine/inflationProjector';
import type { InstrumentRecommendation } from '@t/instruments';

const BAR_COLORS = ['#1A7A52', '#1A4030', '#2D9966', '#0F4C3A', '#A8C4B0'];

interface Props {
  recommendations: InstrumentRecommendation[];
  totalMonthly:    number;
}

export function AllocationCard({ recommendations, totalMonthly }: Props) {
  const { t, isHindi } = useTranslation();
  return (
    <div className="bg-card border border-line rounded-lg p-4 flex flex-col gap-4">
      <p className="text-[10px] font-semibold text-accent uppercase tracking-widest">
        {t('results.sections.monthlyAlloc', { amount: formatRupee(totalMonthly) })}
      </p>
      <div className="flex flex-col gap-2.5">
        {recommendations.map((rec, i) => (
          <div key={rec.instrument.id} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
            />
            <p className="flex-1 font-sora font-semibold text-content text-sm">
              {isHindi ? rec.instrument.nameHi : rec.instrument.nameEn}
            </p>
            <div className="text-right">
              <p className="font-sora font-bold text-accent text-sm">
                {formatRupee(rec.monthlyAmount)}
              </p>
              <p className="text-[10px] text-hint">{rec.allocationPercent}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}