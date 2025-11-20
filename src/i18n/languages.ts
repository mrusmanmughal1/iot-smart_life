import { i18nConfig } from './config.ts';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  {
    code: 'ar',
    name: 'العربية',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
  },
 
 
];

export function getLanguage(code: string): Language | undefined {
  return languages.find((lang) => lang.code === code);
}

export function isRTL(locale: string): boolean {
  return i18nConfig.rtlLocales.includes(locale as any);
}