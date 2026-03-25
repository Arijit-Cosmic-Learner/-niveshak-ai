import { useTranslation } from '@hooks/useTranslation';
import { ValuePropCard } from '@components/partner/ValuePropCard';
import { RevenueModelGrid } from '@components/partner/RevenueModelGrid';
import { DemoRequestForm } from '@components/partner/DemoRequestForm';

const VALUE_PROPS = [
  { icon: '🏦', titleKey: 'partner.valueProp.banks.title',     descKey: 'partner.valueProp.banks.desc' },
  { icon: '📈', titleKey: 'partner.valueProp.funds.title',     descKey: 'partner.valueProp.funds.desc' },
  { icon: '📱', titleKey: 'partner.valueProp.platforms.title', descKey: 'partner.valueProp.platforms.desc' },
] as const;

export default function PartnerPage() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto w-full px-5 py-6">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-content text-2xl md:text-3xl leading-tight mb-3">
          {t('partner.heroTitle')}
        </h1>
        <p className="text-sub text-sm leading-relaxed">{t('partner.heroSub')}</p>
      </div>

      {/* Revenue model — full width */}
      <RevenueModelGrid />

      {/* 2-col on desktop: value props left, form right */}
      <div className="md:grid md:grid-cols-2 md:gap-10 mt-8">
        {/* Left: value props */}
        <div>
          <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-4">
            {t('partner.valueProp.label')}
          </p>
          <div className="flex flex-col gap-3">
            {VALUE_PROPS.map(item => (
              <ValuePropCard
                key={item.titleKey}
                icon={item.icon}
                title={t(item.titleKey)}
                desc={t(item.descKey)}
              />
            ))}
          </div>
        </div>

        {/* Right: demo form */}
        <div className="mt-8 md:mt-0">
          <DemoRequestForm />
        </div>
      </div>
    </div>
  );
}
