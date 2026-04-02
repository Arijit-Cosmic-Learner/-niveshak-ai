import { useState } from 'react';
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

  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText]   = useState('');

  const startEditing = () => {
    setInputText(String(value));
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    const raw = parseInt(inputText.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(raw) && raw > 0) {
      const clamped = Math.max(min, Math.min(max, Math.round(raw / step) * step));
      onChange(clamped);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Value display — entire box is clickable to enter edit mode */}
      <button
        type="button"
        onClick={startEditing}
        className="bg-input border border-line rounded-lg p-4 flex flex-col items-center gap-1 w-full"
      >
        {isEditing ? (
          <div className="flex items-baseline gap-0.5" onClick={e => e.stopPropagation()}>
            <span className="font-sora font-extrabold text-accent text-2xl leading-none">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputText}
              ref={el => { if (el) el.focus(); }}
              onChange={e => setInputText(e.target.value)}
              onBlur={commit}
              onKeyDown={e => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }}
              className="font-sora font-extrabold text-accent text-3xl bg-transparent outline-none text-center w-44 min-w-0"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-sora font-extrabold text-accent text-3xl">
              {formatRupee(value)}
            </p>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-hint"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
        )}
        <p className="text-[10px] text-hint">
          {isEditing ? 'Press Enter or tap away to apply' : 'Tap to type an amount'}
        </p>
      </button>

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
          [&::-webkit-slider-thumb]:bg-accent
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--accent-color) ${percentage}%, var(--surface-raised-color) ${percentage}%)`,
        }}
      />

      <div className="flex justify-between text-xs text-hint font-sora">
        <span>{minLabel ?? formatRupee(min)}</span>
        <span>{maxLabel ?? formatRupee(max)}</span>
      </div>
    </div>
  );
}