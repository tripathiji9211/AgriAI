"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Mail, Fingerprint, Calendar, LogOut } from "lucide-react";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function ProfilePage() {
  const { t } = useGlobalLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    }
    loadUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E599]"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#050505] py-12 px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00E599]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0f4c3a]/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-2xl relative z-10">
        <Card className="glass-card border-white/10 p-8 rounded-3xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0f4c3a] to-[#00E599] p-1 mb-4 shadow-[0_0_20px_rgba(0,229,153,0.3)]">
              <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-[#00E599]" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Farmer Profile</h1>
            <p className="text-white/50 text-sm mt-1">Manage your credentials and account details</p>
          </div>

          <div className="space-y-4 mb-8">
            {/* Email Field */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#00E599]/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#00E599]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-white font-medium truncate">{user.email}</p>
              </div>
            </div>

            {/* User ID Field */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#0f4c3a]/30 flex items-center justify-center shrink-0">
                <Fingerprint className="w-5 h-5 text-[#00E599]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Farmer ID</p>
                <p className="text-white font-mono text-sm truncate">{user.id}</p>
              </div>
            </div>

            {/* Created At Field */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Member Since</p>
                <p className="text-white font-medium truncate">
                  {new Date(user.created_at).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout Securely
          </Button>
        </Card>
      </div>
    </div>
  );
}
