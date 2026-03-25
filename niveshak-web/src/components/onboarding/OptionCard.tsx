import { useTranslation } from '@hooks/useTranslation';
import type { OptionItem } from '@t/onboarding';

interface Props {
  option:   OptionItem;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function OptionCard({ option, selected, onSelect }: Props) {
  const { isHindi } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`w-full flex items-start gap-3 p-4 rounded-md border text-left transition-all ${
        selected
          ? 'border-accent bg-accent-pale'
          : 'border-line bg-card hover:border-accent/40'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
          selected ? 'border-accent bg-accent' : 'border-hint'
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className={`font-sora font-semibold text-sm ${
          selected ? 'text-accent-dark' : 'text-content'
        }`}>
          {isHindi ? option.labelHi : option.labelEn}
        </p>
        {(option.subEn || option.subHi) && (
          <p className="text-sub text-xs">
            {isHindi ? option.subHi : option.subEn}
          </p>
        )}
      </div>
    </button>
  );
}