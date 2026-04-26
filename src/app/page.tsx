"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Sprout, Shield, BarChart, Cpu, FileText, Leaf, Camera, X, Check, PlayCircle, BrainCircuit, Droplets, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function LandingPage() {
  const { t } = useGlobalLanguage();
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>("/3d-animation.mp4");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSaveVideo = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setVideoUrl(data.videoUrl);
        setSelectedFile(null);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-40 px-4 flex flex-col items-center text-center relative overflow-hidden">
        {/* Floating Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E599]/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

        {/* Top Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel mb-8 border-white/10 shimmer">
          <img src="/logo.png" alt="Logo" className="h-5 w-5 object-contain neon-glow" />
          <span className="text-sm font-bold uppercase tracking-widest text-white/80">{t.hero_sub}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 max-w-5xl mx-auto leading-[1.1]">
          {t.appName === "AgriAI" ? (
            <>Detect. Protect. <span className="text-[#00E599] neon-text">Sustain.</span></>
          ) : t.hero_headline}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-[700px] mx-auto leading-relaxed font-light">
          {t.hero_desc}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
          <Link href="/scanner">
            <Button className="bg-[#00E599] hover:bg-[#00c986] text-black rounded-2xl px-10 py-7 h-auto text-xl font-bold shadow-[0_0_30px_rgba(0,229,153,0.3)] flex items-center gap-3 w-full sm:w-auto hover:scale-105 active:scale-95 transition-all shimmer">
              <Upload className="h-6 w-6" />
              {t.upload_btn}
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => setIsLearnMoreOpen(true)}
            className="text-white/80 hover:text-white hover:bg-white/5 rounded-2xl px-10 py-7 h-auto text-xl font-medium w-full sm:w-auto border border-white/10 glass-panel"
          >
            {t.learn_more}
          </Button>
        </div>
      </section>

      {/* Second Section */}
      <section className="py-32 px-4 relative flex flex-col items-center text-center flex-1">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          {t.features_title}
        </h2>
        <p className="text-xl text-white/40 max-w-3xl mx-auto font-light">
          {t.features_sub}
        </p>
        
        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full text-left">
          
          {/* Card 1 */}
          <div className="glass-card p-10 flex flex-col items-start group">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-colors">
              <Shield className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.feat_detect_title}</h3>
            <p className="text-white/40 leading-relaxed text-base">
              {t.feat_detect_desc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-10 flex flex-col items-start group">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-colors">
              <BarChart className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.feat_predict_title}</h3>
            <p className="text-white/40 leading-relaxed text-base">
              {t.feat_predict_desc}
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-10 flex flex-col items-start group">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-colors">
              <Sprout className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.feat_sustain_title}</h3>
            <p className="text-white/40 leading-relaxed text-base">
              {t.feat_sustain_desc}
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-10 flex flex-col items-start group">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-colors">
              <Cpu className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.feat_iot_title}</h3>
            <p className="text-white/40 leading-relaxed text-base">
              {t.feat_iot_desc}
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-10 flex flex-col items-start group">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-colors">
              <FileText className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.feat_reports_title}</h3>
            <p className="text-white/40 leading-relaxed text-base">
              {t.feat_reports_desc}
            </p>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="glass-navbar border-t border-white/5 pt-20 pb-10 px-4 mt-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E599]/5 rounded-full blur-[100px] -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Column 1 */}
            <div className="flex flex-col items-start">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="AgriAI Logo" className="h-10 w-10 object-contain neon-glow rounded-lg" />
                <span className="text-3xl font-black tracking-tighter text-white">
                  Agri<span className="text-[#00E599]">AI</span>
                </span>
              </Link>
              <p className="text-white/40 leading-relaxed">
                {t.footer_tagline}
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-bold font-serif text-gray-900 text-lg mb-4">{t.built_for}</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2"><span>🌾</span> {t.farmers_type}</li>
                <li className="flex items-center gap-2"><span>🔬</span> {t.researchers_type}</li>
                <li className="flex items-center gap-2"><span>🤝</span> {t.orgs_type}</li>
                <li className="flex items-center gap-2"><span>🌍</span> Sustainability-focused Enterprises</li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-bold font-serif text-gray-900 text-lg mb-4">{t.platform}</h4>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/scanner" className="hover:text-[#00E599] transition-colors">{t.nav_detection}</Link></li>
                <li><Link href="/prediction" className="hover:text-[#00E599] transition-colors">{t.nav_prediction}</Link></li>
                <li><Link href="/mandi" className="hover:text-[#00E599] transition-colors">{t.nav_mandi}</Link></li>
                <li><Link href="/sustainability" className="hover:text-[#00E599] transition-colors">{t.nav_sustainability}</Link></li>
                <li><Link href="/iot" className="hover:text-[#00E599] transition-colors">{t.nav_iot}</Link></li>
              </ul>
            </div>
            
          </div>

          {/* Copyright Bottom Bar */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2026 {t.appName}. Empowering sustainable agriculture.
            </p>
          </div>
        </div>
      </footer>

      {/* Learn More Modal */}
      {isLearnMoreOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsLearnMoreOpen(false)} />
          <div className="relative glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-black/40 backdrop-blur-2xl z-10 border-b border-white/5 p-8 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Leaf className="w-8 h-8 text-[#00E599]" /> {t.modal_discover}
              </h2>
              <button onClick={() => setIsLearnMoreOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-10 space-y-10">
              
              {/* Heading */}
              <div className="text-center space-y-4">
                <h3 className="text-4xl md:text-5xl font-black text-white">{t.modal_how_helps}</h3>
              </div>

              {/* Video Container */}
              <div className="relative w-full max-w-3xl mx-auto aspect-video bg-black rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center group border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                <video 
                  key={videoUrl}
                  className="absolute inset-0 w-full h-full object-cover" 
                  poster="/video-poster.png"
                  controls
                  onError={() => setVideoUrl(null)}
                >
                   {videoUrl && <source src={videoUrl} type="video/mp4" />}
                </video>
                <div className="z-10 flex flex-col items-center group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                  {!videoUrl && <PlayCircle className="w-16 h-16 text-white/70 mb-3 drop-shadow-md" />}
                  {!videoUrl && <span className="text-white font-medium drop-shadow-md">Upload 3D Demonstration</span>}
                </div>

                <input 
                  type="file" 
                  accept="video/mp4,video/webm" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect} 
                />
                
                {!videoUrl && (
                  <div className="absolute top-4 right-4 z-20 flex gap-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all border border-white/20 shadow-lg"
                    >
                      <UploadCloud className="w-4 h-4" />
                      {selectedFile ? "Change File" : "Select Video"}
                    </button>
                    
                    {selectedFile && (
                      <button 
                        onClick={handleSaveVideo}
                        disabled={isUploading}
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg animate-in slide-in-from-right-4"
                      >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {isUploading ? "Saving..." : "Save Forever"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 3-Step Process */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10 relative max-w-4xl mx-auto">
                <div className="hidden md:block absolute top-[3rem] left-[16%] right-[16%] h-[1px] bg-white/10 -z-10"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[32px] glass-panel text-[#00E599] flex items-center justify-center mb-6 shadow-xl border border-white/10 ring-8 ring-black/20">
                    <Camera className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-white mb-3 text-2xl">{t.step_scan}</h4>
                  <p className="text-base text-white/40 leading-relaxed px-2">{t.step_scan_desc}</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[32px] glass-panel text-[#00E599] flex items-center justify-center mb-6 shadow-xl border border-white/10 ring-8 ring-black/20">
                    <BrainCircuit className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-white mb-3 text-2xl">{t.step_identify}</h4>
                  <p className="text-base text-white/40 leading-relaxed px-2">{t.step_identify_desc}</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[32px] glass-panel text-[#00E599] flex items-center justify-center mb-6 shadow-xl border border-white/10 ring-8 ring-black/20">
                    <Droplets className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-white mb-3 text-2xl">{t.step_heal}</h4>
                  <p className="text-base text-white/40 leading-relaxed px-2">{t.step_heal_desc}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                <Link href="/scanner" onClick={() => setIsLearnMoreOpen(false)}>
                  <Button className="w-full sm:w-auto bg-[#00E599] hover:bg-[#00c986] text-black px-10 py-7 h-auto text-xl font-black rounded-2xl shadow-lg shimmer transition-all hover:scale-105 active:scale-95">
                    {t.btn_try_now}
                  </Button>
                </Link>
                <Link href="/scanner" onClick={() => setIsLearnMoreOpen(false)}>
                  <Button variant="ghost" className="w-full sm:w-auto glass-panel text-white border border-white/10 px-10 py-7 h-auto text-xl font-bold rounded-2xl transition-all hover:bg-white/5">
                    {t.supported_crops}
                  </Button>
                </Link>
              </div>

              {/* Trust Bar */}
              <div className="border-t border-white/5 pt-10 text-center">
                <p className="text-base font-medium text-white/30 flex items-center justify-center gap-3">
                  <Shield className="w-5 h-5 text-[#00E599]" /> 
                  {t.trust_text}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
