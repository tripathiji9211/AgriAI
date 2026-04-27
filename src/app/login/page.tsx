"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function LoginPage() {
  const { t } = useGlobalLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [supabase] = useState(() => createClient());

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("Auth Error:", error.message);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (authTab === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/dashboard";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert(t.auth_verify_sent);
      }
    } catch (error: any) {
      console.error("Auth Error:", error.message);
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]">
      {/* Immersive background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00E599]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Card className="glass-card w-full max-w-[440px] p-10 rounded-[32px] border-white/10 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Brand Header */}
          <div className="rounded-2xl bg-[#00E599]/10 p-4 mb-6 shadow-[0_0_20px_rgba(0,229,153,0.15)] group-hover:scale-110 transition-transform duration-500">
            <Leaf className="h-8 w-8 text-[#00E599] neon-glow" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Agri<span className="text-[#00E599]">AI</span>
          </h1>
          <p className="text-sm text-white/50 font-medium mb-10">{t.login_title}</p>

          {/* Social Login */}
          <Button 
            type="button"
            variant="outline" 
            className="w-full h-14 text-sm font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center justify-center gap-3"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            </svg>
            {t.btn_google}
          </Button>

          {/* Divider */}
          <div className="w-full flex items-center my-8">
            <div className="flex-1 border-t border-white/5"></div>
            <span className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{t.or_divider}</span>
            <div className="flex-1 border-t border-white/5"></div>
          </div>

          {/* Auth Tabs - Glass Toggle */}
          <div className="flex w-full bg-white/5 border border-white/5 rounded-2xl p-1.5 mb-8">
            <button
              onClick={() => setAuthTab("login")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${authTab === "login" ? "bg-[#00E599] text-black shadow-[0_0_20px_rgba(0,229,153,0.3)]" : "text-white/40 hover:text-white"}`}
            >
              {t.btn_login}
            </button>
            <button
              onClick={() => setAuthTab("signup")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${authTab === "signup" ? "bg-[#00E599] text-black shadow-[0_0_20px_rgba(0,229,153,0.3)]" : "text-white/40 hover:text-white"}`}
            >
              {t.btn_signup}
            </button>
          </div>

          {/* Form Fields */}
          <form className="w-full space-y-5" onSubmit={handleEmailLogin}>
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.label_email}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/20 group-focus-within:text-[#00E599] transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E599]/30 focus:border-[#00E599]/50 transition-all focus:bg-white/10" 
                  placeholder={t.placeholder_email}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.label_password}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/20 group-focus-within:text-[#00E599] transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E599]/30 focus:border-[#00E599]/50 transition-all focus:bg-white/10" 
                  placeholder={t.placeholder_pass}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <Button 
              type="submit"
              className="w-full h-14 text-base font-black bg-[#00E599] hover:bg-[#00c986] text-black rounded-2xl shadow-[0_0_30px_rgba(0,229,153,0.2)] mt-8 transition-all hover:scale-[1.02] active:scale-[0.98] shimmer"
              disabled={isLoading}
            >
              {isLoading ? t.auth_wait : (authTab === "login" ? t.btn_login : t.btn_create_acc)}
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-[11px] font-medium text-white/30 mt-10 leading-relaxed max-w-[300px]">
            {t.footer_terms}
          </p>
        </div>
      </Card>
    </div>
  );
}
