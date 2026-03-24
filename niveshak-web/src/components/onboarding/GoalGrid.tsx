import { GoalCard } from './GoalCard';
import type { OptionItem } from '@t/onboarding';

interface Props {
  options:  OptionItem[];
  selected: string | undefined;
  onSelect: (value: string) => void;
}

export function GoalGrid({ options, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(opt => (
        <GoalCard
          key={opt.value}
          option={opt}
          selected={selected === opt.value}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
