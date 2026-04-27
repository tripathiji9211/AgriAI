"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, MessageSquare, LineChart } from "lucide-react";
import { useGlobalLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useGlobalLanguage();

  const links = [
    { href: "/dashboard", label: t.nav_dashboard, icon: Home },
    { href: "/scanner", label: t.nav_detection, icon: Camera },
    { href: "/advisor", label: t.nav_advisor, icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 z-50 w-full glass-navbar md:hidden pb-safe border-t border-white/10">
      <div className="flex h-20 items-center justify-around px-6">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname === "/" && link.href === "/dashboard");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all",
                isActive ? "text-[#00E599] neon-glow" : "text-white/40 hover:text-[#00E599]"
              )}
            >
              <link.icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} />
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", isActive ? "opacity-100" : "opacity-40")}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
