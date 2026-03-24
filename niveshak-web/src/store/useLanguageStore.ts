import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@t/onboarding';
import { setLocale } from '@i18n/index';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      language: Language.EN,

      setLanguage: (lang: Language) => {
        setLocale(lang as 'en' | 'hi');
        set({ language: lang });
      },

      toggleLanguage: () =>
        set(state => {
          const next =
            state.language === Language.EN ? Language.HI : Language.EN;
          setLocale(next as 'en' | 'hi');
          return { language: next };
        }),
    }),
    {
      name: 'niveshak-language',
      onRehydrateStorage: () => state => {
        // Re-apply locale to i18n-js after hydration from localStorage
        if (state) {
          setLocale(state.language as 'en' | 'hi');
        }
      },
    }
  )
);
