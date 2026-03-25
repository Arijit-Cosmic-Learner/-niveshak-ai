import { useTranslation } from '@hooks/useTranslation';

export function RevenueModelGrid() {
  const { t } = useTranslation();
  const items = [
    { value: t('partner.revenue.perLead'),    label: t('partner.revenue.perLeadLabel') },
    { value: t('partner.revenue.perAccount'), label: t('partner.revenue.perAccountLabel') },
    { value: t('partner.revenue.aumTrail'),   label: t('partner.revenue.aumTrailLabel') },
    { value: t('partner.revenue.free'),       label: t('partner.revenue.freeLabel') },
  ];
  return (
    <div>
      <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-4">
        {t('partner.revenue.label')}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <div
            key={item.label}
            className="bg-card border border-line rounded-lg p-4 flex flex-col gap-1"
          >
            <p className="font-sora font-extrabold text-navy text-2xl">{item.value}</p>
            <p className="text-sub text-xs">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}