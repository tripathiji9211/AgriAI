"use client";

import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Leaf, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const { t } = useGlobalLanguage();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Leaf className="h-7 w-7 text-[#0f4c3a]" />
          <span className="font-bold text-2xl tracking-tight text-gray-900">{t.appName}</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/scanner" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{t.nav_detection}</Link>
          <Link href="/prediction" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{t.nav_prediction}</Link>
          <Link href="/sustainability" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{t.nav_sustainability}</Link>
          <Link href="/advisor" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{t.nav_chatbot}</Link>
          <Link href="/recommend" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{t.nav_recommender}</Link>
          <Link href="/iot" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{t.nav_iot}</Link>
          <Link href="/mandi" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{t.nav_mandi}</Link>
          <Link href="/reports" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{t.nav_reports}</Link>
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
