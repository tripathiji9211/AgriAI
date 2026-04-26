"use client";

import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Leaf, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const { t } = useGlobalLanguage();

  return (
    <nav className="sticky top-0 z-[60] w-full glass-navbar border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="AgriAI Logo" className="h-10 w-10 object-contain neon-glow rounded-lg" />
          <span className="font-black text-2xl tracking-tighter text-white">Agri<span className="text-[#00E599]">AI</span></span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/scanner" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#00E599] transition-all">{t.nav_detection}</Link>
          <Link href="/prediction" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#00E599] transition-all">{t.nav_prediction}</Link>
          <Link href="/sustainability" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#00E599] transition-all">{t.nav_sustainability}</Link>
          <Link href="/advisor" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#00E599] transition-all">{t.nav_chatbot}</Link>
          <Link href="/recommend" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#00E599] transition-all">{t.nav_recommender}</Link>
          <Link href="/iot" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#00E599] transition-all">{t.nav_iot}</Link>
          <Link href="/mandi" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#00E599] transition-all">{t.nav_mandi}</Link>
          <Link href="/reports" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#00E599] transition-all">{t.nav_reports}</Link>
        </div>

        {/* Right: Language & Button */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
          
          <Link href="/login">
            <Button className="bg-[#0f4c3a] hover:bg-[#0a3629] text-white rounded-lg px-6 py-2.5 h-auto text-sm font-medium shadow-sm">
              {t.btn_get_started}
            </Button>
          </Link>
        </div>
        
      </div>
    </nav>
  );
}
