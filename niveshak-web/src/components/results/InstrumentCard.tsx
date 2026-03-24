import { useTranslation } from '@hooks/useTranslation';
import { Badge } from '@components/common/Badge';
import { formatRupee } from '@engine/inflationProjector';
import type { InstrumentRecommendation } from '@t/instruments';

interface Props { rec: InstrumentRecommendation; }

export function InstrumentCard({ rec }: Props) {
  const { t, isHindi } = useTranslation();
  const { instrument, monthlyAmount, reasonEn, reasonHi } = rec;
  return (
    <div className="bg-black-light border border-border-dark rounded-lg p-4 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <p className="font-sora font-bold text-white text-base leading-tight">
            {isHindi ? instrument.nameHi : instrument.nameEn}
          </p>
          <Badge type={instrument.type} />
        </div>
        <div className="bg-black-mid border border-border-dark rounded-md px-3 py-2 text-center flex-shrink-0">
          <p className="font-sora font-extrabold text-lime text-lg leading-none">
            {formatRupee(monthlyAmount)}
          </p>
          <p className="text-[9px] text-grey-dark">/mo</p>
        </div>
      </div>

      {/* Reason */}
      <p className="text-grey-mid text-xs leading-relaxed">
        {isHindi ? reasonHi : reasonEn}
      </p>

      {/* Stats chips */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <p className="text-[9px] text-grey-dark uppercase tracking-wide">
            {t('results.instrument.returns')}
          </p>
          <p className="text-lime font-semibold text-xs">{instrument.returnsLabel}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[9px] text-grey-dark uppercase tracking-wide">
            {t('results.instrument.risk')}
          </p>
          <p className="text-white font-semibold text-xs">{instrument.riskLevel}</p>
        </div>
        {instrument.taxBenefit && (
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] text-grey-dark uppercase tracking-wide">Tax</p>
            <p className="text-success font-semibold text-xs">{instrument.taxBenefit}</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(
          isHindi ? instrument.nameHi : instrument.nameEn
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-black-mid border border-lime/40 text-lime font-sora font-semibold text-sm rounded-md py-2.5 text-center hover:bg-lime/10 transition-colors block"
      >
        {isHindi ? instrument.ctaLabelHi : instrument.ctaLabelEn}
      </a>
    </div>
  );
}
