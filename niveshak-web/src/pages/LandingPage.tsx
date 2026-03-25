import { useEffect } from 'react';
import { useTranslation } from '@hooks/useTranslation';
import { HeroSection } from '@components/landing/HeroSection';
import { PersonaCard } from '@components/landing/PersonaCard';
import { HowItWorks } from '@components/landing/HowItWorks';
import { PartnerChips } from '@components/landing/PartnerChips';
import { personas } from '@data/personas';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useResultsStore } from '@store/useResultsStore';

export default function LandingPage() {
  const { t } = useTranslation();
  const reset = useOnboardingStore(s => s.reset);
  const clearResults = useResultsStore(s => s.clearResults);

  useEffect(() => {
    reset();
    clearResults();
  }, []);
  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Desktop: 2-col hero. Mobile: stacked */}
      <div className="md:grid md:grid-cols-2 md:gap-0 md:min-h-[calc(100vh-57px)]">
        {/* Left: hero content */}
        <div className="md:border-r md:border-line">
          <HeroSection />
          <div className="h-px bg-line mx-6 md:hidden" />
          {/* Personas — shown below hero on mobile, in left col on desktop */}
          <section className="px-6 py-8">
            <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-4">
              {t('landing.personas.label')}
            </p>
            <div className="flex flex-col gap-3">
              {personas.map(persona => (
                <PersonaCard key={persona.id} persona={persona} />
              ))}
            </div>
          </section>
        </div>

        {/* Right col: How it works + Partner chips (desktop only stacking) */}
        <div className="hidden md:flex md:flex-col">
          <div className="flex-1 px-8 py-8">
            <HowItWorks />
          </div>
          <div className="border-t border-line">
            <PartnerChips />
          </div>
        </div>
      </div>

      {/* Mobile-only bottom sections */}
      <div className="md:hidden">
        <div className="h-px bg-line mx-6" />
        <HowItWorks />
        <div className="h-px bg-line mx-6" />
        <PartnerChips />
      </div>
    </div>
  );
}
