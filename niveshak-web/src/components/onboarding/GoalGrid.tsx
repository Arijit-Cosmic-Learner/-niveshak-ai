import { GoalCard } from './GoalCard';
import { useTranslation } from '@hooks/useTranslation';
import type { OptionItem } from '@t/onboarding';

interface Props {
  options:        OptionItem[];
  selected:       string | undefined;
  onSelect:       (value: string) => void;
  customValue?:   string;
  onCustomChange: (text: string) => void;
}

export function GoalGrid({ options, selected, onSelect, customValue = '', onCustomChange }: Props) {
  const { isHindi } = useTranslation();
  const isCustomActive = !selected && customValue.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => (
          <GoalCard
            key={opt.value}
            option={opt}
            selected={selected === opt.value}
            onSelect={val => {
              onSelect(val);
              onCustomChange('');
            }}
          />
        ))}
      </div>

      {/* Custom / own goal entry — label wrapper focuses input on any tap */}
      <label className={`flex items-center gap-3 rounded-lg border-2 transition-all px-4 py-3 cursor-text ${
        isCustomActive
          ? 'border-accent bg-accent-pale'
          : 'border-line bg-card hover:border-accent/40'
      }`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${isCustomActive ? 'text-accent' : 'text-sub'}`}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <input
          type="text"
          maxLength={80}
          value={customValue}
          onChange={e => onCustomChange(e.target.value)}
          placeholder={isHindi ? 'मेरा अपना लक्ष्य लिखें...' : 'Describe your own goal...'}
          className="flex-1 bg-transparent font-sora text-sm text-content placeholder:text-hint outline-none"
        />
      </label>
    </div>
  );
}
