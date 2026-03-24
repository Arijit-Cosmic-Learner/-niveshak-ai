import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingAnswers } from '@t/onboarding';

const TOTAL_STEPS = 11;

interface OnboardingState {
  currentStep: number;
  answers: OnboardingAnswers;
  isComplete: boolean;

  // Actions
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  markComplete: () => void;
  reset: () => void;
}

const initialAnswers: OnboardingAnswers = {};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: initialAnswers,
      isComplete: false,

      setAnswer: (key, value) =>
        set(state => ({
          answers: { ...state.answers, [key]: value },
        })),

      nextStep: () =>
        set(state => ({
          currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
        })),

      prevStep: () =>
        set(state => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (step: number) =>
        set({ currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),

      markComplete: () => set({ isComplete: true }),

      reset: () =>
        set({
          currentStep: 0,
          answers: {},
          isComplete: false,
        }),
    }),
    {
      name: 'niveshak-onboarding',
      partialize: state => ({
        currentStep: state.currentStep,
        answers: state.answers,
        isComplete: state.isComplete,
      }),
    }
  )
);

export const ONBOARDING_TOTAL_STEPS = TOTAL_STEPS;
