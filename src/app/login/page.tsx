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

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-[420px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl border border-gray-100">
        <div className="flex flex-col items-center text-center">
          
          {/* Header */}
          <div className="rounded-full bg-green-50 p-3 mb-4">
            <Leaf className="h-7 w-7 text-[#0f4c3a]" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#0f4c3a] tracking-tight mb-2">{t.appName}</h1>
          <p className="text-sm text-gray-500 font-sans mb-8">{t.login_title}</p>

          {/* Social Login */}
          <Button 
            variant="outline" 
            className="w-full h-12 text-sm font-medium border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t.btn_google}
          </Button>

          {/* Divider */}
          <div className="w-full flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-xs font-medium text-gray-400 bg-white">{t.or_divider}</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Auth Tabs */}
          <div className="flex w-full bg-gray-100/80 rounded-xl p-1 mb-6">
            <button
              onClick={() => setAuthTab("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.btn_login}
            </button>
            <button
              onClick={() => setAuthTab("signup")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authTab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.btn_signup}
            </button>
          </div>

          {/* Form Fields */}
          <form className="w-full space-y-4" onSubmit={handleEmailLogin}>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-gray-700 ml-1">{t.label_email}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c3a] focus:border-transparent transition-all bg-gray-50/50 focus:bg-white" 
                  placeholder={t.placeholder_email}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-gray-700 ml-1">{t.label_password}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c3a] focus:border-transparent transition-all bg-gray-50/50 focus:bg-white" 
                  placeholder={t.placeholder_pass}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Primary Button */}
            <Button 
              type="submit"
              className="w-full h-12 text-sm font-semibold bg-[#0f4c3a] hover:bg-[#0a3629] text-white rounded-xl shadow-md mt-6 transition-all hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? t.auth_wait : (authTab === "login" ? t.btn_login : t.btn_create_acc)}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-[13px] text-gray-400 mt-8 leading-relaxed max-w-[280px]">
            {t.footer_terms}
          </p>
        </div>
      </Card>
    </div>
  );
}
