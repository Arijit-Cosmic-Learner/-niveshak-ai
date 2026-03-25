import { useTranslation } from '@hooks/useTranslation';

const PARTNERS = [
  'HDFC Bank', 'Axis MF', 'SBI', 'India Post',
  'Groww', 'Zerodha', 'PhonePe', 'ICICIdirect',
];

export function PartnerChips() {
  const { t } = useTranslation();
  return (
    <section className="px-6 py-6">
      <p className="text-[10px] font-semibold text-hint uppercase tracking-widest mb-4">
        {t('landing.partners.label')}
      </p>
      <div className="flex flex-wrap gap-2">
        {PARTNERS.map(name => (
          <span
            key={name}
            className="px-3 py-1.5 bg-input border border-line rounded-full text-xs text-sub font-sora"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}