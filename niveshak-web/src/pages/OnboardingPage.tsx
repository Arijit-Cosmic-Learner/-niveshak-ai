import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@hooks/useOnboarding';
import { useTranslation } from '@hooks/useTranslation';
import { Button } from '@components/common/Button';
import { QuestionCard } from '@components/onboarding/QuestionCard';
import { OptionList } from '@components/onboarding/OptionList';
import { GoalGrid } from '@components/onboarding/GoalGrid';
import { GoalSlider } from '@components/onboarding/GoalSlider';
import { InflationProjectionBox } from '@components/onboarding/InflationProjectionBox';
import { projectInflation } from '@engine/inflationProjector';
import type { OnboardingAnswers } from '@t/onboarding';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Other',
];

export default function OnboardingPage() {
  const { t, isHindi } = useTranslation();
  const navigate = useNavigate();

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
    canContinue,
  } = useOnboarding();

  if (!currentStepData) {
    navigate('/results');
    return null;
  }

  const { id, inputType, questionEn, questionHi, subEn, subHi, options, sliderConfig } =
    currentStepData;

  const currentValue = answers[id];

  const handleSelect = (value: string) =>
    setStepAnswer(id as keyof OnboardingAnswers, value as never);

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
            selected={currentValue as string | undefined}
            onSelect={handleSelect}
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
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col px-5 py-6 gap-6 min-h-[calc(100dvh-56px-64px)]">
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
      <div className={`flex gap-3 mt-auto pt-2 ${isFirstStep ? '' : ''}`}>
        {!isFirstStep && (
          <Button variant="ghost" onClick={goPrev} className="flex-1">
            {t('onboarding.back')}
          </Button>
        )}
        <Button
          onClick={goNext}
          disabled={!canContinue()}
          fullWidth={isFirstStep}
          className={isFirstStep ? '' : 'flex-[2]'}
        >
          {isLastStep ? t('onboarding.finish') : t('onboarding.continue')}
        </Button>
      </div>
    </div>
  );
}
