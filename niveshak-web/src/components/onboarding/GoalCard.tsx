import type { ReactElement } from 'react';
import { useTranslation } from '@hooks/useTranslation';
import { GoalType } from '@t/onboarding';
import type { OptionItem } from '@t/onboarding';

const GOAL_SVG: Record<string, ReactElement> = {
  [GoalType.CHILD_EDUCATION]: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/>
      <path d="M6 12v5c3.56 2.01 8.44 2.01 12 0v-5"/>
    </svg>
  ),
  [GoalType.CHILD_MARRIAGE]: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  [GoalType.BUY_HOME]: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  [GoalType.RETIREMENT]: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  [GoalType.EMERGENCY_FUND]: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  [GoalType.GROW_WEALTH]: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  [GoalType.START_BUSINESS]: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  [GoalType.BIG_PURCHASE]: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
};

interface Props {
  option:   OptionItem;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function GoalCard({ option, selected, onSelect }: Props) {
  const { isHindi } = useTranslation();
  const icon = GOAL_SVG[option.value];
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all aspect-square ${
        selected
          ? 'border-accent bg-accent-pale text-accent'
          : 'border-line bg-card hover:border-accent/40 text-sub'
      }`}
    >
      {icon ?? <span className="text-2xl">◈</span>}
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