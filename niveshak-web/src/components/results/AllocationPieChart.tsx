import { useTranslation } from '@hooks/useTranslation';
import { formatRupee } from '@engine/inflationProjector';
import type { InstrumentRecommendation } from '@t/instruments';

const SLICE_COLORS = ['#1A7A52', '#2D9966', '#0F4C3A', '#A8C4B0', '#1A4030'];

interface Props {
  recommendations: InstrumentRecommendation[];
  totalMonthly: number;
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const sx = cx + r * Math.cos(toRad(startDeg));
  const sy = cy + r * Math.sin(toRad(startDeg));
  const ex = cx + r * Math.cos(toRad(endDeg));
  const ey = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z`;
}

export function AllocationPieChart({ recommendations, totalMonthly }: Props) {
  const { t, isHindi } = useTranslation();

  // Build slices
  const cx = 80;
  const cy = 80;
  const r = 68;
  let cursor = 0;

  const slices = recommendations.map((rec, i) => {
    const span = (rec.allocationPercent / 100) * 360;
    // Avoid full-circle arc degeneracy: clamp to 359.99 if 100%
    const end = cursor + Math.min(span, 359.99);
    const path = arcPath(cx, cy, r, cursor, end);
    cursor += span;
    return { path, color: SLICE_COLORS[i % SLICE_COLORS.length], rec };
  });

  return (
    <div className="bg-card border border-line rounded-lg p-4 flex flex-col gap-4 h-full">
      <p className="text-[10px] font-semibold text-accent uppercase tracking-widest">
        {t('results.sections.monthlyAlloc', { amount: formatRupee(totalMonthly) })}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Pie chart */}
        <svg
          viewBox="0 0 160 160"
          className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0"
          aria-hidden="true"
        >
          {slices.map(({ path, color, rec }) => (
            <path
              key={rec.instrument.id}
              d={path}
              fill={color}
              stroke="var(--surface-raised-color)"
              strokeWidth="1.5"
            />
          ))}
          {/* Inner circle for donut effect */}
          <circle cx={cx} cy={cy} r={32} fill="currentColor" className="text-card" />
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0 w-full">
          {slices.map(({ color, rec }) => (
            <div key={rec.instrument.id} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <p className="text-[11px] text-sub font-sora truncate flex-1">
                {isHindi ? rec.instrument.nameHi : rec.instrument.nameEn}
              </p>
              <div className="text-right flex-shrink-0">
                <p className="text-[11px] font-bold text-accent font-sora">
                  {formatRupee(rec.monthlyAmount)}
                </p>
                <p className="text-[9px] text-hint">{rec.allocationPercent}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
