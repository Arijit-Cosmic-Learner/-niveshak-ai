import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore, ONBOARDING_TOTAL_STEPS } from '@store/useOnboardingStore';
import { onboardingSteps } from '@data/steps';
import type { OnboardingAnswers } from '@t/onboarding';

/**
 * useOnboarding — orchestrates the 11-step onboarding flow.
 *
 * Provides:
 *  - Current step data & progress
 *  - Navigation helpers (next, prev, skip)
 *  - Answer setter
 *  - Completion handler
 */
export function useOnboarding() {
  const navigate = useNavigate();
  const {
    currentStep,
    answers,
    isComplete,
    setAnswer,
    nextStep: storeNextStep,
    prevStep: storePrevStep,
    goToStep,
    markComplete,
    reset,
  } = useOnboardingStore();

  const activeSteps = onboardingSteps.filter(
    step => !step.showIf || step.showIf(answers)
  );

  const totalSteps   = activeSteps.length;
  const currentStepData = activeSteps[currentStep] ?? activeSteps[0];
  const isFirstStep  = currentStep === 0;
  const isLastStep   = currentStep === totalSteps - 1;
  const progress     = ((currentStep + 1) / totalSteps) * 100;

  const setStepAnswer = useCallback(
    <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
      setAnswer(key, value);
    },
    [setAnswer]
  );

  const goNext = useCallback(() => {
    if (isLastStep) {
      markComplete();
      navigate('/results');
    } else {
      storeNextStep();
    }
  }, [isLastStep, markComplete, navigate, storeNextStep]);

  const goPrev = useCallback(() => {
    if (!isFirstStep) storePrevStep();
  }, [isFirstStep, storePrevStep]);

  const canContinue = useCallback(() => {
    if (!currentStepData) return false;
    if (!currentStepData.isRequired) return true;
    const value = answers[currentStepData.id];
    return value !== undefined && value !== '' && value !== null;
  }, [currentStepData, answers]);

  return {
    currentStep,
    currentStepData,
    answers,
    isComplete,
    totalSteps,
    progress,
    isFirstStep,
    isLastStep,
    TOTAL_STEPS: ONBOARDING_TOTAL_STEPS,
    setStepAnswer,
    goNext,
    goPrev,
    goToStep,
    canContinue,
    reset,
  };
}
