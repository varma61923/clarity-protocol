import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { locales, Locale, Direction } from '../locales';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof locales.en.translations);
  direction: Direction;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('clarity-locale');
      if (savedLocale && locales[savedLocale as Locale]) {
        return savedLocale as Locale;
      }
      // Fallback to browser language if supported
      const browserLang = navigator.language.split('-')[0] as Locale;
      if (locales[browserLang]) {
          return browserLang;
      }
    }
    return 'en';
  });

  useEffect(() => {
    const currentDirection = locales[locale].direction || 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = currentDirection;
    localStorage.setItem('clarity-locale', locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const contextValue = useMemo(() => ({
    locale,
    setLocale,
    t: locales[locale].translations,
    direction: locales[locale].direction || 'ltr',
  }), [locale]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
