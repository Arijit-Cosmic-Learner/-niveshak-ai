import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import { useTranslation } from '@hooks/useTranslation';

export function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="px-6 pt-8 pb-6">
      {/* Category chip */}
      <div className="inline-flex items-center bg-black-mid border border-lime/30 rounded-full px-3 py-1 mb-6">
        <span className="text-[10px] text-lime font-semibold font-sora tracking-wide">
          {t('landing.chip')}
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-sora text-3xl font-extrabold text-white leading-tight mb-4">
        {t('landing.heroLine1')}<br />
        <span className="text-lime">{t('landing.heroLine2')}</span><br />
        {t('landing.heroLine3')}
      </h1>

      {/* Sub text */}
      <p className="text-grey-mid text-sm leading-relaxed mb-8">
        {t('landing.heroSub')}
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <Button fullWidth onClick={() => navigate('/discover')}>
          {t('landing.ctaPrimary')}
        </Button>
        <Button fullWidth variant="ghost" onClick={() => navigate('/partner')}>
          {t('landing.ctaPartner')}
        </Button>
      </div>

      {/* Trust band */}
      <p className="text-grey-dark text-xs text-center mt-6 font-sora">
        {t('landing.trustBand')}
      </p>
    </section>
  );
}
