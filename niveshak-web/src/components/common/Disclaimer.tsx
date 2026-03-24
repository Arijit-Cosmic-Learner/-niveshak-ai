import { useTranslation } from '@hooks/useTranslation';

export function Disclaimer() {
  const { t } = useTranslation();
  return (
    <p className="text-[10px] text-grey-dark leading-relaxed text-center px-4 py-6">
      {t('results.disclaimer')}
    </p>
  );
}
