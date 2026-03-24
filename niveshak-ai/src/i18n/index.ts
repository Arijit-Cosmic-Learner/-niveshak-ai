import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import en from './en';
import hi from './hi';
import type { TranslationKeys } from './en';

const i18n = new I18n({
  en,
  hi,
});

i18n.locale = getLocales()?.[0]?.languageCode ?? 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;

export function t(
  scope: string,
  options?: Record<string, string | number>
): string {
  return i18n.t(scope, options);
}

export function setLocale(locale: 'en' | 'hi'): void {
  i18n.locale = locale;
}

export function getLocale(): string {
  return i18n.locale;
}

export type { TranslationKeys };