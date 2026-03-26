import { useOnboardingStore } from '@store/useOnboardingStore';
import { useTranslation } from '@hooks/useTranslation';
import { GoalType, TimelineType } from '@t/onboarding';

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

const GOAL_LABELS: Record<GoalType, { en: string; hi: string }> = {
  [GoalType.CHILD_EDUCATION]: { en: "Child's Education", hi: 'बच्चे की पढ़ाई' },
  [GoalType.CHILD_MARRIAGE]:  { en: "Child's Marriage",  hi: 'बच्चे की शादी' },
  [GoalType.BUY_HOME]:        { en: 'Buy a Home',        hi: 'घर खरीदें' },
  [GoalType.RETIREMENT]:      { en: 'Retirement',        hi: 'सेवानिवृत्ति' },
  [GoalType.EMERGENCY_FUND]:  { en: 'Emergency Fund',    hi: 'आपातकालीन फंड' },
  [GoalType.GROW_WEALTH]:     { en: 'Grow Wealth',       hi: 'संपत्ति वृद्धि' },
  [GoalType.START_BUSINESS]:  { en: 'Start a Business',  hi: 'व्यापार शुरू करें' },
  [GoalType.BIG_PURCHASE]:    { en: 'A Big Purchase',    hi: 'बड़ी खरीदी' },
};

const TIMELINE_LABELS: Record<TimelineType, { en: string; hi: string }> = {
  [TimelineType.UNDER_1_YEAR]:   { en: 'Under 1 year',  hi: '1 साल से कम' },
  [TimelineType.ONE_TO_3_YEARS]: { en: '1–3 years',     hi: '1–3 साल' },
  [TimelineType.THREE_TO_7]:     { en: '3–7 years',     hi: '3–7 साल' },
  [TimelineType.SEVEN_TO_15]:    { en: '7–15 years',    hi: '7–15 साल' },
  [TimelineType.ABOVE_15]:       { en: '15+ years',     hi: '15+ साल' },
  [TimelineType.NOT_SURE]:       { en: 'Not sure yet',  hi: 'अभी नहीं पता' },
};

// Step indices matching the reordered steps.ts
const STEP_INDEX: Record<string, number> = {
  name: 0, goal: 1, state: 2, occupation: 3,
  inHandIncome: 4, monthlySurplus: 5, goalAmount: 6,
  timeline: 7, monthlyInvestment: 8, experience: 9, riskTolerance: 10,
};

// ── Component ──────────────────────────────────────────────────────────────
export function OnboardingSummary() {
  const { answers, goToStep, currentStep } = useOnboardingStore();
  const { isHindi } = useTranslation();

  type Row = { key: string; label: { en: string; hi: string }; value: string | null; stepIdx: number };

  const rows: Row[] = [
    {
      key: 'name',
      label: { en: 'Name', hi: 'नाम' },
      value: answers.name ?? null,
      stepIdx: STEP_INDEX.name,
    },
    {
      key: 'goal',
      label: { en: 'Goal', hi: 'लक्ष्य' },
      value: answers.goalCustom
        ? answers.goalCustom
        : answers.goal
          ? (isHindi ? GOAL_LABELS[answers.goal].hi : GOAL_LABELS[answers.goal].en)
          : null,
      stepIdx: STEP_INDEX.goal,
    },
    {
      key: 'inHandIncome',
      label: { en: 'Monthly Income', hi: 'मासिक आय' },
      value: answers.inHandIncome != null ? `${fmt(answers.inHandIncome)}/mo` : null,
      stepIdx: STEP_INDEX.inHandIncome,
    },
    {
      key: 'monthlySurplus',
      label: { en: 'Surplus/mo', hi: 'बचत' },
      value: answers.monthlySurplus != null ? `${fmt(answers.monthlySurplus)}/mo` : null,
      stepIdx: STEP_INDEX.monthlySurplus,
    },
    {
      key: 'goalAmount',
      label: { en: 'Target Amount', hi: 'लक्ष्य राशि' },
      value: answers.goalAmount != null ? fmt(answers.goalAmount) : null,
      stepIdx: STEP_INDEX.goalAmount,
    },
    {
      key: 'timeline',
      label: { en: 'Timeline', hi: 'समयसीमा' },
      value: answers.timeline
        ? (isHindi ? TIMELINE_LABELS[answers.timeline].hi : TIMELINE_LABELS[answers.timeline].en)
        : null,
      stepIdx: STEP_INDEX.timeline,
    },
    {
      key: 'monthlyInvestment',
      label: { en: 'Monthly Investment', hi: 'मासिक निवेश' },
      value: answers.monthlyInvestment != null ? `${fmt(answers.monthlyInvestment)}/mo` : null,
      stepIdx: STEP_INDEX.monthlyInvestment,
    },
  ];

  const answeredCount = rows.filter(r => r.value !== null).length;

  // Don't render on step 0 (name), only after at least one answer
  if (currentStep === 0) return null;

  return (
    <aside className="hidden md:flex flex-col gap-3 bg-card border border-line rounded-xl p-5 sticky top-6 self-start">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-sora font-semibold text-sm text-content">
          {isHindi ? 'आपकी जानकारी' : 'Your Summary'}
        </p>
        <span className="font-sora text-xs text-hint">
          {answeredCount}/{rows.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-line rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${(answeredCount / rows.length) * 100}%` }}
        />
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-0.5">
        {rows.map(row => {
          const isCurrentField = STEP_INDEX[row.key] === currentStep;
          const isPast = currentStep > row.stepIdx;
          return (
            <div
              key={row.key}
              className={`group flex items-center justify-between py-2 px-2 rounded-md transition-colors gap-2 ${
                isCurrentField ? 'bg-accent-pale' : isPast && row.value ? 'hover:bg-muted-bg' : ''
              }`}
            >
              <span className={`font-sora text-xs shrink-0 ${isCurrentField ? 'text-accent-dark font-semibold' : 'text-hint'}`}>
                {isHindi ? row.label.hi : row.label.en}
              </span>
              <div className="flex items-center gap-1 min-w-0">
                <span className={`font-sora text-xs font-medium truncate text-right ${
                  row.value ? 'text-content' : 'text-hint/40'
                }`}>
                  {row.value ?? '—'}
                </span>
                {row.value && isPast && (
                  <button
                    type="button"
                    onClick={() => goToStep(row.stepIdx)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    title={isHindi ? 'संपादित करें' : 'Edit'}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
