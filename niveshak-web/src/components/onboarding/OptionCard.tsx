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
          ? 'border-lime bg-lime/10'
          : 'border-border-dark bg-black-light hover:border-lime/40'
      }`}
    >
      {/* Radio dot */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
          selected ? 'border-lime bg-lime' : 'border-grey-dark'
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-black" />}
      </div>

      {/* Labels */}
      <div className="flex flex-col gap-0.5">
        <p className={`font-sora font-semibold text-sm ${
          selected ? 'text-lime' : 'text-white'
        }`}>
          {isHindi ? option.labelHi : option.labelEn}
        </p>
        {(option.subEn || option.subHi) && (
          <p className="text-grey-mid text-xs">
            {isHindi ? option.subHi : option.subEn}
          </p>
        )}
      </div>
    </button>
  );
}
