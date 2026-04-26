"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useGlobalLanguage } from "@/lib/LanguageContext";
import { Language } from "@/lib/translations";

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" }
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useGlobalLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-gray-200"
      >
        <Globe className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{currentLang.native}</span>
      </button>

      <div 
        className={`absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 w-[320px] transition-all duration-200 ease-out origin-top ${
          isOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="grid grid-cols-2 gap-1">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code as Language);
                setIsOpen(false);
              }}
              className={`flex flex-col items-start p-3 rounded-lg transition-colors text-left ${
                lang === l.code ? "bg-[#0f4c3a]/10 border border-[#0f4c3a]/20" : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <span className={`font-medium ${lang === l.code ? "text-[#0f4c3a]" : "text-gray-900"}`}>{l.native}</span>
              <span className="text-xs text-gray-500 mt-0.5">{l.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
