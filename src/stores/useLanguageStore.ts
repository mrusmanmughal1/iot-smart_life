// src/stores/useLanguageStore.ts - UPDATED WITH TRANSLATIONS
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, Language } from '@/i18n/translations';

type Direction = 'ltr' | 'rtl';

interface LanguageStore {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  t: (section: keyof typeof translations.en, key: string) => string;
}

const rtlLanguages: Language[] = ['ar'];

const getDirection = (language: Language): Direction => {
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      direction: 'ltr',
      
      setLanguage: (language) => {
        const direction = getDirection(language);
        
        // Update document direction and language
        document.documentElement.dir = direction;
        document.documentElement.lang = language;
        
        set({ language, direction });
      },
      
      // Translation function
      t: (section, key) => {
        const { language } = get();
        try {
          return (translations[language][section] as any)[key] || key;
        } catch {
          return key;
        }
      },
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.dir = state.direction;
          document.documentElement.lang = state.language;
        }
      },
    }
  )
);

// Helper hook for easier usage
export const useTranslation = () => {
  const { language, t } = useLanguageStore();
  return { language, t };
};