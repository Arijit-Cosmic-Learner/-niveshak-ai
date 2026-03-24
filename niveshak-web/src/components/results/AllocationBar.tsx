import { useTranslation } from '@hooks/useTranslation';
import type { InstrumentRecommendation } from '@t/instruments';

const BAR_COLORS = ['#AAFF00', '#C2FF4D', '#7ACC00', '#EEFFCC', '#B0FF4D'];

interface Props { recommendations: InstrumentRecommendation[]; }

export function AllocationBar({ recommendations }: Props) {
  const { isHindi } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      {/* Segmented bar */}
      <div className="flex w-full h-3 rounded-full overflow-hidden gap-px">
        {recommendations.map((rec, i) => (
          <div
            key={rec.instrument.id}
            style={{
              width: `${rec.allocationPercent}%`,
              backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
            }}
            className="h-full"
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {recommendations.map((rec, i) => (
          <div key={rec.instrument.id} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
            />
            <span className="text-[10px] text-grey-mid font-sora">
              {isHindi ? rec.instrument.nameHi : rec.instrument.nameEn}
              {' '}({rec.allocationPercent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
