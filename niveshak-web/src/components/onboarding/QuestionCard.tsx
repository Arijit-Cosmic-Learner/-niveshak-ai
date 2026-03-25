import type { ReactNode } from 'react';
import { ProgressBar } from '@components/common/ProgressBar';
import { useTranslation } from '@hooks/useTranslation';

interface Props {
  questionEn:  string;
  questionHi:  string;
  subEn:       string;
  subHi:       string;
  stepCurrent: number;
  stepTotal:   number;
  progress:    number;
  children:    ReactNode;
}

export function QuestionCard({
  questionEn, questionHi,
  subEn, subHi,
  stepCurrent, stepTotal,
  progress,
  children,
}: Props) {
  const { t, isHindi } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[10px] font-semibold text-hint uppercase tracking-widest mb-3">
          {t('onboarding.stepLabel', { current: stepCurrent, total: stepTotal })}
        </p>
        <ProgressBar progress={progress} />
      </div>
      <div>
        <h2 className="font-sora font-bold text-content text-xl leading-snug mb-2">
          {isHindi ? questionHi : questionEn}
        </h2>
        <p className="text-sub text-sm leading-relaxed">
          {isHindi ? subHi : subEn}
        </p>
      </div>
      {children}
    </div>
  );
}