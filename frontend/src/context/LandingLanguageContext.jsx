import { createContext, useContext, useEffect, useCallback } from 'react';
import { landingTranslations } from '../i18n/landingTranslations';

const LandingLanguageContext = createContext();

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

const ar = landingTranslations.ar;

export function LandingLanguageProvider({ children }) {
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  const t = useCallback((key) => getNested(ar, key) ?? key, []);

  return (
    <LandingLanguageContext.Provider value={{ dir: 'rtl', t }}>
      {children}
    </LandingLanguageContext.Provider>
  );
}

export const useLandingLanguage = () => {
  const ctx = useContext(LandingLanguageContext);
  if (!ctx) throw new Error('useLandingLanguage must be used within LandingLanguageProvider');
  return ctx;
};
