"use client";

import { Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import { Language } from "@/lib/translations";

const LANGUAGES = [
  { code: 'en', native: 'English', en: 'English' },
  { code: 'hi', native: 'हिंदी', en: 'Hindi' },
  { code: 'ta', native: 'தமிழ்', en: 'Tamil' },
  { code: 'te', native: 'తెలుగు', en: 'Telugu' },
  { code: 'kn', native: 'ಕನ್ನಡ', en: 'Kannada' },
  { code: 'mr', native: 'मराठी', en: 'Marathi' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', en: 'Punjabi' },
  { code: 'gu', native: 'ગુજરાતી', en: 'Gujarati' },
  { code: 'bn', native: 'বাংলা', en: 'Bengali' },
  { code: 'ur', native: 'اردو', en: 'Urdu' }
];

const MARQUEE_TEXTS = [
  "Change language anytime from the top menu",
  "शीर्ष मेनू से किसी भी समय भाषा बदलें",
  "மேல் மெனுவிலிருந்து எந்த நேரத்திலும் மொழியை மாற்றவும்",
  "ఎగువ మెను నుండి ఎప్పుడైనా భాషను మార్చండి",
  "ಮೇಲಿನ ಮೆನುವಿನಿಂದ ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ",
  "वरच्या मेनूमधून कधीही भाषा बदला",
  "ਸਿਖਰਲੇ ਮੀਨੂ ਤੋਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਭਾਸ਼ਾ ਬਦਲੋ",
  "ટોચના મેનુમાંથી કોઈપણ સમયે ભાષા બદલો",
  "শীর্ষ মেনু থেকে যেকোনো সময় ভাষা পরিবর্তন করুন",
  "کسی بھی وقت اوپر والے مینو سے زبان تبدیل کریں"
];

export default function LanguageOnboarding({ onComplete }: { onComplete: (code: Language) => void }) {
  const [marqueeIndex, setMarqueeIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarqueeIndex((prev) => (prev + 1) % MARQUEE_TEXTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (code: Language) => {
    setIsClosing(true);
    onComplete(code);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0f4c3a] text-white transition-opacity duration-500 ease-in-out ${isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      dir="ltr"
    >
      <div className="w-full max-w-4xl p-6 flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-in slide-in-from-top-8 duration-700">
          <div className="bg-white p-4 rounded-full mb-4 shadow-lg shadow-black/20">
            <Leaf className="w-12 h-12 text-[#0f4c3a]" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">AgriGuard</h1>
          <p className="text-green-200 mt-2 text-lg font-medium tracking-wide">AgriAI Platform</p>
        </div>

        {/* Headlines */}
        <div className="text-center space-y-2 mb-10 animate-in fade-in duration-1000 delay-300 fill-mode-both">
          <h2 className="text-xl md:text-2xl font-bold">Choose your language</h2>
          <h2 className="text-xl md:text-2xl font-bold text-green-100">अपनी भाषा चुनें</h2>
          <h2 className="text-xl md:text-2xl font-bold text-green-200">உங்கள் மொழியை தேர்ந்தெடுக்கவும்</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full animate-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code as Language)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 group"
            >
              <span className={`text-[18px] font-bold text-white mb-1 group-hover:text-green-100 transition-colors ${l.code === 'ur' ? 'font-[family-name:Noto_Nastaliq_Urdu]' : ''}`}>
                {l.native}
              </span>
              <span className="text-[12px] text-green-200/80">{l.en}</span>
            </button>
          ))}
        </div>

        {/* Marquee Note */}
        <div className="mt-16 h-6 overflow-hidden relative w-full text-center animate-in fade-in duration-1000 delay-1000 fill-mode-both">
          <p 
            key={marqueeIndex}
            className="text-sm text-green-300/80 animate-in slide-in-from-bottom-4 fade-out slide-out-to-top-4 duration-500 absolute w-full"
          >
            {MARQUEE_TEXTS[marqueeIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
