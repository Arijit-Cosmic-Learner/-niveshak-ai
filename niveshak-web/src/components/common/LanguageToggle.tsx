import { useTranslation } from '@hooks/useTranslation';

export function LanguageToggle() {
  const { isHindi, toggleLanguage } = useTranslation();
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 bg-input rounded-md px-3 py-1.5 text-xs font-semibold font-sora transition-colors hover:bg-muted-bg"
      aria-label="Toggle language"
    >
      <span className={isHindi ? 'text-hint' : 'text-accent'}>EN</span>
      <span className="text-hint mx-0.5">|</span>
      <span className={isHindi ? 'text-accent' : 'text-hint'}>{'\u0939\u093F\u0902'}</span>
    </button>
  );
}