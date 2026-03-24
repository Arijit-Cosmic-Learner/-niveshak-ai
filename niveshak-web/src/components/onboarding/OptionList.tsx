import { OptionCard } from './OptionCard';
import type { OptionItem } from '@t/onboarding';

interface Props {
  options:  OptionItem[];
  selected: string | undefined;
  onSelect: (value: string) => void;
}

export function OptionList({ options, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <OptionCard
          key={opt.value}
          option={opt}
          selected={selected === opt.value}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
