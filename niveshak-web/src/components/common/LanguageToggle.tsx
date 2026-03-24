import { useTranslation } from '@hooks/useTranslation';

export function LanguageToggle() {
  const { isHindi, toggleLanguage } = useTranslation();
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 bg-black-mid rounded-md px-3 py-1.5 text-xs font-semibold font-sora transition-colors hover:bg-black-soft"
      aria-label="Toggle language"
    >
      <span className={isHindi ? 'text-grey-mid' : 'text-lime'}>EN</span>
      <span className="text-grey-dark mx-0.5">|</span>
      <span className={isHindi ? 'text-lime' : 'text-grey-mid'}>हिं</span>
    </button>
  );
}
