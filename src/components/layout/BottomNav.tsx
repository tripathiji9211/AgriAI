"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, MessageSquare, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/scanner", label: "Scan", icon: Camera },
    { href: "/advisor", label: "Advisor", icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 z-50 w-full border-t bg-white md:hidden pb-safe">
      <div className="flex h-16 items-center justify-around px-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname === "/" && link.href === "/dashboard");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-green-600" : "text-gray-500 hover:text-green-600"
              )}
            >
              <link.icon className={cn("h-6 w-6", isActive && "fill-green-100")} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
