import { useLanguageStore } from '@store/useLanguageStore';
import { t as rawT, getLocale } from '@i18n/index';

/**
 * useTranslation — reactive wrapper around i18n-js.
 *
 * Re-renders consumers whenever the language changes.
 * Usage:
 *   const { t, language, toggleLanguage } = useTranslation();
 *   t('landing.ctaPrimary')
 */
export function useTranslation() {
  const { language, toggleLanguage, setLanguage } = useLanguageStore();

  function t(scope: string, options?: Record<string, string | number>): string {
    // Access language so React re-renders when it changes
    void language;
    return rawT(scope, options);
  }

  return {
    t,
    language,
    locale: getLocale(),
    isHindi: language === 'hi',
    toggleLanguage,
    setLanguage,
  };
}
