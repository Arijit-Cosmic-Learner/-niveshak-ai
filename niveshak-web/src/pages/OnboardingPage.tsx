import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@hooks/useOnboarding';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useTranslation } from '@hooks/useTranslation';
import { Button } from '@components/common/Button';
import { QuestionCard } from '@components/onboarding/QuestionCard';
import { OptionList } from '@components/onboarding/OptionList';
import { GoalGrid } from '@components/onboarding/GoalGrid';
import { GoalSlider } from '@components/onboarding/GoalSlider';
import { InflationProjectionBox } from '@components/onboarding/InflationProjectionBox';
import { OnboardingSummary } from '@components/onboarding/OnboardingSummary';
import { projectInflation } from '@engine/inflationProjector';
import { GoalType, TimelineType, OccupationType, ExperienceType, RiskToleranceType } from '@t/onboarding';
import type { OnboardingAnswers } from '@t/onboarding';

// ── Static data ─────────────────────────────────────────────────────────────
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Other',
];

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
  [TimelineType.UNDER_1_YEAR]:   { en: 'Under 1 year',   hi: '1 साल से कम' },
  [TimelineType.ONE_TO_3_YEARS]: { en: '1–3 years',      hi: '1–3 साल' },
  [TimelineType.THREE_TO_7]:     { en: '3–7 years',      hi: '3–7 साल' },
  [TimelineType.SEVEN_TO_15]:    { en: '7–15 years',     hi: '7–15 साल' },
  [TimelineType.ABOVE_15]:       { en: '15+ years',      hi: '15+ साल' },
  [TimelineType.NOT_SURE]:       { en: 'Not sure yet',   hi: 'अभी नहीं पता' },
};

const OCC_LABELS: Record<OccupationType, { en: string; hi: string }> = {
  [OccupationType.SALARIED_PRIVATE]: { en: 'Salaried (Private)', hi: 'निजी नौकरी' },
  [OccupationType.SALARIED_GOVT]:    { en: 'Salaried (Govt)',    hi: 'सरकारी नौकरी' },
  [OccupationType.SELF_EMPLOYED]:    { en: 'Self-Employed',      hi: 'स्व-रोजगार' },
  [OccupationType.DAILY_WAGE]:       { en: 'Daily Wage',         hi: 'दैनिक मजदूरी' },
  [OccupationType.FARMER]:           { en: 'Farmer',             hi: 'किसान' },
  [OccupationType.STUDENT]:          { en: 'Student',            hi: 'विद्यार्थी' },
  [OccupationType.HOMEMAKER]:        { en: 'Homemaker',          hi: 'गृहिणी' },
  [OccupationType.RETIRED]:          { en: 'Retired',            hi: 'सेवानिवृत्त' },
};

const EXP_LABELS: Record<ExperienceType, { en: string; hi: string }> = {
  [ExperienceType.NEVER]:                  { en: 'Never invested',       hi: 'कभी निवेश नहीं' },
  [ExperienceType.ONLY_FD_SAVINGS]:        { en: 'FD / Savings only',    hi: 'FD / बचत खाता' },
  [ExperienceType.GOLD_REAL_ESTATE]:       { en: 'Gold / Real estate',   hi: 'सोना / अचल संपत्ति' },
  [ExperienceType.MF_STOCKS_OCCASIONAL]:   { en: 'MF / Stocks (occ.)',   hi: 'MF / शेयर (कभी-कभी)' },
  [ExperienceType.REGULAR_INVESTOR]:       { en: 'Regular investor',     hi: 'नियमित निवेशक' },
};

const RISK_LABELS: Record<RiskToleranceType, { en: string; hi: string }> = {
  [RiskToleranceType.WITHDRAW_IMMEDIATELY]: { en: 'Withdraw immediately', hi: 'तुरंत निकाल लेते' },
  [RiskToleranceType.WORRY_AND_WAIT]:       { en: 'Worry and wait',       hi: 'चिंता कर इंतज़ार' },
  [RiskToleranceType.STAY_CALM]:            { en: 'Stay calm',            hi: 'शांत रहते' },
  [RiskToleranceType.BUY_MORE]:             { en: 'Buy more',             hi: 'और खरीदते' },
};

// Step indices matching steps.ts order
const STEP_INDEX: Record<string, number> = {
  name: 0, goal: 1, state: 2, occupation: 3,
  inHandIncome: 4, monthlySurplus: 5, goalAmount: 6,
  timeline: 7, monthlyInvestment: 8, experience: 9, riskTolerance: 10,
};

// ── Review screen ────────────────────────────────────────────────────────────
interface ReviewProps {
  answers: OnboardingAnswers;
  isHindi: boolean;
  onEdit: (step: number) => void;
  onConfirm: () => void;
}

function ReviewAnswers({ answers, isHindi, onEdit, onConfirm }: ReviewProps) {
  type ReviewRow = { label: { en: string; hi: string }; value: string | null; stepIdx: number };

  const rows: ReviewRow[] = [
    {
      label: { en: 'Name', hi: 'नाम' },
      value: answers.name ?? null,
      stepIdx: STEP_INDEX.name,
    },
    {
      label: { en: 'Goal', hi: 'लक्ष्य' },
      value: answers.goalCustom
        ? answers.goalCustom
        : answers.goal
          ? (isHindi ? GOAL_LABELS[answers.goal].hi : GOAL_LABELS[answers.goal].en)
          : null,
      stepIdx: STEP_INDEX.goal,
    },
    {
      label: { en: 'State', hi: 'राज्य' },
      value: answers.state ?? null,
      stepIdx: STEP_INDEX.state,
    },
    {
      label: { en: 'Occupation', hi: 'पेशा' },
      value: answers.occupation
        ? (isHindi ? OCC_LABELS[answers.occupation].hi : OCC_LABELS[answers.occupation].en)
        : null,
      stepIdx: STEP_INDEX.occupation,
    },
    {
      label: { en: 'Monthly Income', hi: 'मासिक आय' },
      value: answers.inHandIncome != null ? fmt(answers.inHandIncome) : null,
      stepIdx: STEP_INDEX.inHandIncome,
    },
    {
      label: { en: 'Monthly Surplus', hi: 'मासिक बचत' },
      value: answers.monthlySurplus != null ? fmt(answers.monthlySurplus) : null,
      stepIdx: STEP_INDEX.monthlySurplus,
    },
    {
      label: { en: 'Target Amount', hi: 'लक्ष्य राशि' },
      value: answers.goalAmount != null ? fmt(answers.goalAmount) : null,
      stepIdx: STEP_INDEX.goalAmount,
    },
    {
      label: { en: 'Timeline', hi: 'समयसीमा' },
      value: answers.timeline
        ? (isHindi ? TIMELINE_LABELS[answers.timeline].hi : TIMELINE_LABELS[answers.timeline].en)
        : null,
      stepIdx: STEP_INDEX.timeline,
    },
    {
      label: { en: 'Monthly Investment', hi: 'मासिक निवेश' },
      value: answers.monthlyInvestment != null ? fmt(answers.monthlyInvestment) : null,
      stepIdx: STEP_INDEX.monthlyInvestment,
    },
    {
      label: { en: 'Experience', hi: 'अनुभव' },
      value: answers.experience
        ? (isHindi ? EXP_LABELS[answers.experience].hi : EXP_LABELS[answers.experience].en)
        : null,
      stepIdx: STEP_INDEX.experience,
    },
    {
      label: { en: 'Risk Attitude', hi: 'जोखिम रवैया' },
      value: answers.riskTolerance
        ? (isHindi ? RISK_LABELS[answers.riskTolerance].hi : RISK_LABELS[answers.riskTolerance].en)
        : null,
      stepIdx: STEP_INDEX.riskTolerance,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg bg-card border border-line rounded-xl p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h2 className="font-sora font-bold text-xl text-content">
            {isHindi ? 'अपनी जानकारी देखें' : 'Review Your Details'}
          </h2>
          <p className="font-sora text-sm text-hint mt-1">
            {isHindi
              ? 'कुछ बदलना हो तो संपादित करें, फिर अपनी योजना देखें।'
              : 'Tap any row to edit, then get your personalised plan.'}
          </p>
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-line">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3 gap-3">
              <span className="font-sora text-sm text-hint shrink-0">
                {isHindi ? row.label.hi : row.label.en}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <span className={`font-sora text-sm font-medium truncate ${row.value ? 'text-content' : 'text-hint/40'}`}>
                  {row.value ?? '—'}
                </span>
                <button
                  type="button"
                  onClick={() => onEdit(row.stepIdx)}
                  className="shrink-0 text-accent hover:text-accent-dark transition-colors"
                  title={isHindi ? 'संपादित करें' : 'Edit'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onConfirm} fullWidth>
          {isHindi ? 'मेरी योजना देखें →' : 'Get My Plan →'}
        </Button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const { t, isHindi } = useTranslation();
  const navigate = useNavigate();
  const { setAnswer } = useOnboardingStore();

  const [showReview, setShowReview] = useState(false);
  const [investError, setInvestError] = useState('');

  const {
    currentStep,
    currentStepData,
    answers,
    totalSteps,
    progress,
    isFirstStep,
    isLastStep,
    setStepAnswer,
    goNext,
    goPrev,
    goToStep,
    canContinue,
  } = useOnboarding();

  if (!currentStepData && !showReview) {
    navigate('/results');
    return null;
  }

  // When user edits from review, hide review and jump to that step
  const handleEditFromReview = (stepIdx: number) => {
    setShowReview(false);
    goToStep(stepIdx);
  };

  // Show review screen
  if (showReview) {
    return (
      <ReviewAnswers
        answers={answers}
        isHindi={isHindi}
        onEdit={handleEditFromReview}
        onConfirm={goNext}
      />
    );
  }

  const { id, inputType, questionEn, questionHi, subEn, subHi, options, sliderConfig } =
    currentStepData!;

  const currentValue = answers[id as keyof OnboardingAnswers];

  const handleSelect = (value: string) =>
    setStepAnswer(id as keyof OnboardingAnswers, value as never);

  // Goal custom handling: preset clears custom, custom text clears preset
  const handleGoalSelect = (value: string) => {
    setStepAnswer('goal', value as GoalType);
    setAnswer('goalCustom', undefined);
  };

  const handleGoalCustomChange = (text: string) => {
    setAnswer('goalCustom', text || undefined);
    if (text) setAnswer('goal', undefined);
  };

  // Combined continue check — goal step is satisfied by either preset OR custom text
  const isStepDone = id === 'goal'
    ? !!(answers.goal || answers.goalCustom)
    : canContinue();

  // Handle continue with validation
  const handleContinue = () => {
    if (id === 'monthlyInvestment') {
      const val = (currentValue as number | undefined) ?? 0;
      const surplus = answers.monthlySurplus ?? 0;
      if (surplus > 0 && val > surplus) {
        setInvestError(
          isHindi
            ? `यह राशि आपकी मासिक बचत (${fmt(surplus)}) से अधिक है।`
            : `Amount exceeds your monthly surplus of ${fmt(surplus)}.`
        );
        return;
      }
    }
    setInvestError('');

    if (isLastStep) {
      setShowReview(true);
    } else {
      goNext();
    }
  };

  const renderInput = () => {
    switch (inputType) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={isHindi ? 'यहाँ लिखें...' : 'Type here...'}
            value={(currentValue as string) ?? ''}
            onChange={e =>
              setStepAnswer(id as keyof OnboardingAnswers, e.target.value as never)
            }
            className="w-full bg-input border border-line rounded-md px-4 py-3.5 text-content font-sora text-sm placeholder:text-hint outline-none focus:border-accent/60 transition-colors"
            autoFocus
          />
        );

      case 'state_select':
        return (
          <select
            value={(currentValue as string) ?? ''}
            onChange={e =>
              setStepAnswer(id as keyof OnboardingAnswers, e.target.value as never)
            }
            className="w-full bg-input border border-line rounded-md px-4 py-3.5 text-content font-sora text-sm outline-none focus:border-accent/60 transition-colors"
          >
            <option value="" disabled>
              {isHindi ? 'राज्य चुनें' : 'Select your state'}
            </option>
            {STATES.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        );

      case 'option_list':
        return options ? (
          <OptionList
            options={options}
            selected={currentValue as string | undefined}
            onSelect={handleSelect}
          />
        ) : null;

      case 'goal_grid':
        return options ? (
          <GoalGrid
            options={options}
            selected={answers.goal as string | undefined}
            onSelect={handleGoalSelect}
            customValue={answers.goalCustom ?? ''}
            onCustomChange={handleGoalCustomChange}
          />
        ) : null;

      case 'slider': {
        if (!sliderConfig) return null;
        const sliderValue = (currentValue as number | undefined) ?? sliderConfig.default;
        const showInflation = id === 'goalAmount' && answers.timeline != null;
        return (
          <div className="flex flex-col gap-4">
            <GoalSlider
              sliderConfig={sliderConfig}
              value={sliderValue}
              onChange={v =>
                setStepAnswer(id as keyof OnboardingAnswers, v as never)
              }
            />
            {showInflation && (
              <InflationProjectionBox
                projection={projectInflation({ ...answers, goalAmount: sliderValue })}
              />
            )}
            {/* Validation error */}
            {id === 'monthlyInvestment' && investError && (
              <p className="font-sora text-xs text-error flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {investError}
              </p>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-start justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Question card */}
        <div className="bg-card border border-line rounded-xl shadow-sm">
          <div className="flex flex-col px-5 py-6 gap-6">
            <QuestionCard
              questionEn={questionEn}
              questionHi={questionHi}
              subEn={subEn}
              subHi={subHi}
              stepCurrent={currentStep + 1}
              stepTotal={totalSteps}
              progress={progress}
            >
              {renderInput()}
            </QuestionCard>

            {/* Navigation */}
            <div className="flex gap-3 mt-auto pt-2">
              {!isFirstStep && (
                <Button variant="ghost" onClick={goPrev} className="flex-1">
                  {t('onboarding.back')}
                </Button>
              )}
              <Button
                onClick={handleContinue}
                disabled={!isStepDone}
                fullWidth={isFirstStep}
                className={isFirstStep ? '' : 'flex-[2]'}
              >
                {isLastStep ? t('onboarding.finish') : t('onboarding.continue')}
              </Button>
            </div>
          </div>
        </div>

        {/* Summary sidebar — hidden on mobile and first step */}
        <OnboardingSummary />
      </div>
    </div>
  );
}
