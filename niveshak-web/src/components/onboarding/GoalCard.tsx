import { useTranslation } from '@hooks/useTranslation';
import type { OptionItem } from '@t/onboarding';

interface Props {
  option:   OptionItem;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function GoalCard({ option, selected, onSelect }: Props) {
  const { isHindi } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all aspect-square ${
        selected
          ? 'border-accent bg-accent-pale'
          : 'border-line bg-card hover:border-accent/40'
      }`}
    >
      <span className="text-2xl">{option.icon}</span>
      <p
        className={`font-sora font-semibold text-xs text-center leading-tight ${
          selected ? 'text-accent-dark' : 'text-content'
        }`}
      >
        {isHindi ? option.labelHi : option.labelEn}
      </p>
    </button>
  );
}