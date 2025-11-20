export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'ar', 'es', 'fr', 'de', 'zh'],
  fallbackLocale: 'en',
  
  // Date formatting
  dateFormats: {
    en: 'MM/DD/YYYY',
    ar: 'DD/MM/YYYY',
    es: 'DD/MM/YYYY',
    fr: 'DD/MM/YYYY',
    de: 'DD.MM.YYYY',
    zh: 'YYYY/MM/DD',
  },

  // Time formatting
  timeFormats: {
    en: 'hh:mm A',
    ar: 'hh:mm A',
    es: 'HH:mm',
    fr: 'HH:mm',
    de: 'HH:mm',
    zh: 'HH:mm',
  },

  // Number formatting
  numberFormats: {
    en: {
      decimal: '.',
      thousand: ',',
    },
    ar: {
      decimal: '٫',
      thousand: '٬',
    },
    es: {
      decimal: ',',
      thousand: '.',
    },
    fr: {
      decimal: ',',
      thousand: ' ',
    },
    de: {
      decimal: ',',
      thousand: '.',
    },
    zh: {
      decimal: '.',
      thousand: ',',
    },
  },

  // RTL languages
  rtlLocales: ['ar'],

  // Currency formats
  currencyFormats: {
    en: { symbol: '$', position: 'before' },
    ar: { symbol: 'ر.س', position: 'after' },
    es: { symbol: '€', position: 'before' },
    fr: { symbol: '€', position: 'before' },
    de: { symbol: '€', position: 'before' },
    zh: { symbol: '¥', position: 'before' },
  },
} as const;

export type Locale = typeof i18nConfig.locales[number];