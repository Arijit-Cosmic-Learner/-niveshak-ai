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
    <div className="flex flex-col gap-8 px-5 py-6">
      {/* Hero */}
      <div>
        <h1 className="font-sora font-extrabold text-white text-2xl leading-tight mb-3">
          {t('partner.heroTitle')}
        </h1>
        <p className="text-grey-mid text-sm leading-relaxed">{t('partner.heroSub')}</p>
      </div>

      {/* Revenue model */}
      <RevenueModelGrid />

      {/* Value props */}
      <div>
        <p className="text-[10px] font-semibold text-lime uppercase tracking-widest mb-4">
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

      <div className="h-px bg-border-dark" />

      {/* Demo form */}
      <DemoRequestForm />
    </div>
  );
}
