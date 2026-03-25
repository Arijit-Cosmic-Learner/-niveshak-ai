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
    <div className="flex flex-col">
      <HeroSection />

      <div className="h-px bg-border-dark mx-6" />

      {/* Personas */}
      <section className="px-6 py-8">
        <p className="text-[10px] font-semibold text-lime uppercase tracking-widest mb-4">
          {t('landing.personas.label')}
        </p>
        <div className="flex flex-col gap-3">
          {personas.map(persona => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      </section>

      <div className="h-px bg-border-dark mx-6" />
      <HowItWorks />
      <div className="h-px bg-border-dark mx-6" />
      <PartnerChips />
    </div>
  );
}
