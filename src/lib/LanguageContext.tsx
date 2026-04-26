"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';
import LanguageOnboarding from '@/components/LanguageOnboarding';
import { useRouter } from 'next/navigation';

interface LanguageContextType {
  lang: Language;
  setLang: (code: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedLang = localStorage.getItem('agriai_lang') as Language;
    if (storedLang && translations[storedLang]) {
      setLangState(storedLang);
      document.documentElement.setAttribute('lang', storedLang);
      document.dir = 'ltr';
      setIsFirstLaunch(false);
    } else {
      setIsFirstLaunch(true);
    }
  }, []);

  const setLang = (code: Language) => {
    if (translations[code]) {
      setLangState(code);
      localStorage.setItem('agriai_lang', code);
      // Set cookie for Server Components
      document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.setAttribute('lang', code);
      document.dir = 'ltr';
      
      // Force App Router to refresh Server Components
      router.refresh();
    }
  };

  const handleOnboardingComplete = (code: Language) => {
    setLang(code);
    setTimeout(() => setIsFirstLaunch(false), 500);
  };

  if (isFirstLaunch === null) {
    return <div className="min-h-screen bg-[#0f4c3a]" />;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: { ...translations.en, ...(translations[lang] || {}) } }}>
      {children}
      {isFirstLaunch && <LanguageOnboarding onComplete={handleOnboardingComplete} />}
    </LanguageContext.Provider>
  );
}

export function useGlobalLanguage() {
  return useContext(LanguageContext);
}
