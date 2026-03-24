import { formatRupee } from '@engine/inflationProjector';
import type { SliderConfig } from '@t/onboarding';

interface Props {
  sliderConfig: SliderConfig;
  value:        number;
  onChange:     (value: number) => void;
  minLabel?:    string;
  maxLabel?:    string;
}

export function GoalSlider({ sliderConfig, value, onChange, minLabel, maxLabel }: Props) {
  const { min, max, step } = sliderConfig;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-4">
      {/* Value display */}
      <div className="bg-black-mid border border-border-dark rounded-lg p-4 text-center">
        <p className="font-sora font-extrabold text-lime text-3xl">{formatRupee(value)}</p>
      </div>

      {/* Range slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full outline-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-lime
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer"
        style={{
          background: `linear-gradient(to right, #AAFF00 ${percentage}%, #2A2A2A ${percentage}%)`,
        }}
      />

      {/* Min / Max labels */}
      <div className="flex justify-between text-xs text-grey-dark font-sora">
        <span>{minLabel ?? formatRupee(min)}</span>
        <span>{maxLabel ?? formatRupee(max)}</span>
      </div>
    </div>
  );
}
