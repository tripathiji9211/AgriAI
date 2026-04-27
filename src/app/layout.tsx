import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { LanguageProvider } from "@/lib/LanguageContext";
import KrishiAIChatbot from "@/components/KrishiAIChatbot";
import OfflineIndicator from "@/components/OfflineIndicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriAI - AI for Sustainable Farming",
  description: "AI-powered eco-friendly crop disease management for a sustainable agricultural future.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f4c3a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LanguageProvider>
          <OfflineIndicator />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <BottomNav />
          <KrishiAIChatbot />
        </LanguageProvider>
      </body>
    </html>
  );
}
