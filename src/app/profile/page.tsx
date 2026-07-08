"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Mail, Fingerprint, Calendar, LogOut, Phone, MapPin, Map, Sprout, Loader2, Edit2, CheckCircle2, X } from "lucide-react";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function ProfilePage() {
  const { t } = useGlobalLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    farmSize: "",
    primaryCrop: "",
    soilType: ""
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user?.user_metadata) {
        setFormData({
          fullName: data.user.user_metadata.fullName || "",
          phone: data.user.user_metadata.phone || "",
          location: data.user.user_metadata.location || "",
          farmSize: data.user.user_metadata.farmSize || "",
          primaryCrop: data.user.user_metadata.primaryCrop || "",
          soilType: data.user.user_metadata.soilType || ""
        });
      }
      setIsLoading(false);
    }
    loadUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { data, error } = await supabase.auth.updateUser({
      data: formData
    });
    
    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      setUser(data.user);
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      <div className="container mx-auto max-w-3xl relative z-10">
        <Card className="glass-card border-white/10 p-8 rounded-3xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8 relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0f4c3a] to-[#00E599] p-1 mb-4 shadow-[0_0_20px_rgba(0,229,153,0.3)]">
              <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-[#00E599]" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{formData.fullName || "Farmer Profile"}</h1>
            <p className="text-white/50 text-sm mt-1">{user.email}</p>
            
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="absolute top-0 right-0 bg-[#00E599]/10 hover:bg-[#00E599]/20 text-[#00E599] border-[#00E599]/20 rounded-xl"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* System Details (Always View Only) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors md:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-white font-medium truncate">
                    {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Farmer ID</p>
                   <p className="text-white/60 font-mono text-xs truncate max-w-[120px]">{user.id.substring(0,8)}...</p>
                </div>
              </div>
            </div>

            {/* Editable Details */}
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. John Doe" className="bg-[#050505] border-white/10 text-white rounded-xl h-12 w-full px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. +91 9876543210" className="bg-[#050505] border-white/10 text-white rounded-xl h-12 w-full px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Location / Region</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Punjab, India" className="bg-[#050505] border-white/10 text-white rounded-xl h-12 w-full px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Farm Size</label>
                  <input type="text" name="farmSize" value={formData.farmSize} onChange={handleInputChange} placeholder="e.g. 5 Acres" className="bg-[#050505] border-white/10 text-white rounded-xl h-12 w-full px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Primary Crop(s)</label>
                  <input type="text" name="primaryCrop" value={formData.primaryCrop} onChange={handleInputChange} placeholder="e.g. Wheat, Rice" className="bg-[#050505] border-white/10 text-white rounded-xl h-12 w-full px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Soil Type</label>
                  <input type="text" name="soilType" value={formData.soilType} onChange={handleInputChange} placeholder="e.g. Loamy, Clay" className="bg-[#050505] border-white/10 text-white rounded-xl h-12 w-full px-3" />
                </div>
              </>
            ) : (
              <>
                <ProfileField icon={<UserIcon />} label="Full Name" value={formData.fullName} />
                <ProfileField icon={<Phone />} label="Phone Number" value={formData.phone} />
                <ProfileField icon={<MapPin />} label="Location" value={formData.location} />
                <ProfileField icon={<Map />} label="Farm Size" value={formData.farmSize} />
                <ProfileField icon={<Sprout />} label="Primary Crop(s)" value={formData.primaryCrop} />
                <ProfileField icon={<Sprout />} label="Soil Type" value={formData.soilType} />
              </>
            )}
          </div>

          {isEditing ? (
            <div className="flex gap-4 mb-6">
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 h-14 bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-2xl font-bold transition-all" disabled={isSaving}>
                <X className="w-5 h-5 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1 h-14 bg-[#00E599] hover:bg-[#00c986] text-black rounded-2xl font-black transition-all" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={handleLogout} variant="outline" className="w-full h-14 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" /> Logout Securely
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-[#00E599]/10 flex items-center justify-center shrink-0 text-[#00E599]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-white font-medium truncate">{value || <span className="text-white/30 italic">Not set</span>}</p>
      </div>
    </div>
  );
}
