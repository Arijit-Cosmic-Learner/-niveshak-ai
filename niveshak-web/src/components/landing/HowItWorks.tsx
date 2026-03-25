import { useTranslation } from '@hooks/useTranslation';

const STEPS = [
  { num: '01', titleKey: 'landing.howItWorks.step1Title', descKey: 'landing.howItWorks.step1Desc' },
  { num: '02', titleKey: 'landing.howItWorks.step2Title', descKey: 'landing.howItWorks.step2Desc' },
  { num: '03', titleKey: 'landing.howItWorks.step3Title', descKey: 'landing.howItWorks.step3Desc' },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="px-6 py-8 md:px-0 md:pt-0">
      <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-6">
        {t('landing.howItWorks.label')}
      </p>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
        {STEPS.map(({ num, titleKey, descKey }) => (
          <div key={num} className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-sm bg-navy flex items-center justify-center flex-shrink-0">
              <span className="font-sora font-bold text-white text-xs">{num}</span>
            </div>
            <div>
              <p className="font-sora font-semibold text-content text-sm mb-1">
                {t(titleKey)}
              </p>
              <p className="text-sub text-xs leading-relaxed">
                {t(descKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}