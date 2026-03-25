import { useTranslation } from '@hooks/useTranslation';
import type { Persona } from '@data/personas';

interface Props { persona: Persona; }

export function PersonaCard({ persona }: Props) {
  const { isHindi } = useTranslation();
  return (
    <div className="bg-card border border-line rounded-lg p-4 flex items-start gap-3">
      <div
        className={`w-10 h-10 rounded-full ${persona.colorClass} flex items-center justify-center flex-shrink-0`}
      >
        <span className="font-sora font-bold text-white text-sm">{persona.avatarInitials}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-content font-sora font-semibold text-sm leading-snug">
          {isHindi ? persona.nameHi : persona.nameEn}
        </p>
        <p className="text-sub text-xs leading-snug">
          {isHindi ? persona.metaHi : persona.metaEn}
        </p>
      </div>
    </div>
  );
}