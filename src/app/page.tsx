"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Sprout, Shield, BarChart, Cpu, FileText, Leaf, Camera, X, Check, PlayCircle, BrainCircuit, Droplets, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGlobalLanguage } from "@/lib/LanguageContext";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const { t } = useGlobalLanguage();
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [showCrops, setShowCrops] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>("/3d-animation.mp4");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

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
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-[#020804]" onMouseMove={handleMouseMove}>
      {/* Interactive Background Glows */}
      <motion.div 
        animate={{ 
          x: mousePos.x - 400,
          y: mousePos.y - 400,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 50 }}
        className="fixed w-[800px] h-[800px] rounded-full bg-[#00E599]/5 blur-[150px] pointer-events-none z-0"
      />

      {/* Hero Section */}
      <section className="pt-40 pb-48 px-4 flex flex-col items-center text-center relative">
        {/* Floating Agricultural Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 2000 - 1000, 
              y: Math.random() * 1000, 
              opacity: 0 
            }}
            animate={{ 
              y: [-20, 20, -20],
              opacity: [0, 0.4, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute pointer-events-none z-0"
          >
            <Leaf className="w-6 h-6 text-[#00E599]/10" />
          </motion.div>
        ))}

        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel mb-10 border-white/10 shimmer relative z-10"
        >
          <Image src="/logo.png" alt="Logo" width={20} height={20} className="h-5 w-5 object-contain neon-glow" />
          <span className="text-sm font-black uppercase tracking-[0.3em] text-[#00E599]">{t.hero_sub}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-10 max-w-6xl mx-auto leading-[0.9] relative z-10"
        >
          {t.appName === "AgriAI" ? (
            <>Detect. Protect. <br/> <span className="text-[#00E599] neon-text drop-shadow-[0_0_40px_rgba(0,229,153,0.3)]">Sustain.</span></>
          ) : t.hero_headline}
        </motion.h1>

        {/* Subheadline with Typing Effect */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-white/40 mb-14 max-w-[800px] mx-auto leading-relaxed font-medium relative z-10"
        >
          {t.hero_desc}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full relative z-10"
        >
          <Link href="/scanner">
            <Button className="bg-[#00E599] hover:bg-[#00c986] text-black rounded-[2rem] px-12 py-8 h-auto text-2xl font-black shadow-[0_0_50px_rgba(0,229,153,0.4)] flex items-center gap-4 w-full sm:w-auto hover:scale-105 active:scale-95 transition-all shimmer border-none">
              <Upload className="h-7 w-7" />
              {t.upload_btn}
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => setIsLearnMoreOpen(true)}
            className="text-white hover:text-[#00E599] hover:bg-white/5 rounded-[2rem] px-12 py-8 h-auto text-2xl font-black w-full sm:w-auto border border-white/10 glass-panel backdrop-blur-xl transition-all"
          >
            {t.learn_more}
          </Button>
        </motion.div>
      </section>

      {/* Second Section */}
      <section className="py-40 px-4 relative flex flex-col items-center text-center flex-1 bg-gradient-to-b from-transparent to-black/40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8">
            {t.features_title}
          </h2>
          <p className="text-2xl text-white/30 max-w-4xl mx-auto font-medium mb-20">
            {t.features_sub}
          </p>
        </motion.div>
        
        {/* Feature Cards Grid (already updated in previous turns, just ensuring it fits here) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full text-left">
          
          {/* Card 1: Detection */}
          <div className="glass-card p-10 flex flex-col items-start group hover:scale-[1.02] transition-all duration-500">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-all shadow-[0_0_20px_rgba(0,229,153,0.1)] group-hover:shadow-[0_0_30px_rgba(0,229,153,0.2)]">
              <Shield className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t.feat_detect_title}</h3>
            <p className="text-white/50 leading-relaxed text-base font-medium mb-8 flex-1">
              {t.feat_detect_desc}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               <span className="px-3 py-1 bg-[#00E599]/10 text-[#00E599] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#00E599]/20">98% Accuracy</span>
               <span className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">Organic Focus</span>
            </div>
          </div>

          {/* Card 2: Prediction */}
          <div className="glass-card p-10 flex flex-col items-start group hover:scale-[1.02] transition-all duration-500">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-all shadow-[0_0_20px_rgba(0,229,153,0.1)] group-hover:shadow-[0_0_30px_rgba(0,229,153,0.2)]">
              <BarChart className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t.feat_predict_title}</h3>
            <p className="text-white/50 leading-relaxed text-base font-medium mb-8 flex-1">
              {t.feat_predict_desc}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               <span className="px-3 py-1 bg-[#00E599]/10 text-[#00E599] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#00E599]/20">7-Day Forecast</span>
               <span className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">Weather Sync</span>
            </div>
          </div>

          {/* Card 3: Sustainability */}
          <div className="glass-card p-10 flex flex-col items-start group hover:scale-[1.02] transition-all duration-500">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-all shadow-[0_0_20px_rgba(0,229,153,0.1)] group-hover:shadow-[0_0_30px_rgba(0,229,153,0.2)]">
              <Sprout className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t.feat_sustain_title}</h3>
            <p className="text-white/50 leading-relaxed text-base font-medium mb-8 flex-1">
              {t.feat_sustain_desc}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               <span className="px-3 py-1 bg-[#00E599]/10 text-[#00E599] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#00E599]/20">ROI Driven</span>
               <span className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">Carbon Audit</span>
            </div>
          </div>

          {/* Card 4: IoT */}
          <div className="glass-card p-10 flex flex-col items-start group hover:scale-[1.02] transition-all duration-500">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-all shadow-[0_0_20px_rgba(0,229,153,0.1)] group-hover:shadow-[0_0_30px_rgba(0,229,153,0.2)]">
              <Cpu className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t.feat_iot_title}</h3>
            <p className="text-white/50 leading-relaxed text-base font-medium mb-8 flex-1">
              {t.feat_iot_desc}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               <span className="px-3 py-1 bg-[#00E599]/10 text-[#00E599] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#00E599]/20">Live Telemetry</span>
               <span className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">NPK Mesh</span>
            </div>
          </div>

          {/* Card 5: Reports */}
          <div className="glass-card p-10 flex flex-col items-start group hover:scale-[1.02] transition-all duration-500">
            <div className="bg-[#00E599]/10 p-4 rounded-2xl mb-8 group-hover:bg-[#00E599]/20 transition-all shadow-[0_0_20px_rgba(0,229,153,0.1)] group-hover:shadow-[0_0_30px_rgba(0,229,153,0.2)]">
              <FileText className="h-8 w-8 text-[#00E599]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t.feat_reports_title}</h3>
            <p className="text-white/50 leading-relaxed text-base font-medium mb-8 flex-1">
              {t.feat_reports_desc}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               <span className="px-3 py-1 bg-[#00E599]/10 text-[#00E599] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#00E599]/20">PDF Export</span>
               <span className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">Govt Ready</span>
            </div>
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
                <Image src="/logo.png" alt="AgriAI Logo" width={40} height={40} className="h-10 w-10 object-contain neon-glow rounded-lg" />
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
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCrops(!showCrops)}
                  className={`w-full sm:w-auto glass-panel text-white border border-white/10 px-10 py-7 h-auto text-xl font-bold rounded-2xl transition-all hover:bg-white/5 ${showCrops ? 'bg-white/10 border-[#00E599]/50' : ''}`}
                >
                  {t.supported_crops}
                </Button>
              </div>

              {/* Supported Crops Grid */}
              {showCrops && (
                <div className="pt-10 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[
                      { name: "Tomato", icon: "🍅" },
                      { name: "Potato", icon: "🥔" },
                      { name: "Rice", icon: "🌾" },
                      { name: "Wheat", icon: "🌾" },
                      { name: "Corn", icon: "🌽" },
                      { name: "Cotton", icon: "☁️" },
                      { name: "Grapes", icon: "🍇" },
                      { name: "Apple", icon: "🍎" },
                      { name: "Sugarcane", icon: "🎋" },
                      { name: "Coffee", icon: "☕" }
                    ].map((crop) => (
                      <div key={crop.name} className="glass-card p-6 flex flex-col items-center gap-3 group hover:border-[#00E599]/50 transition-all">
                        <span className="text-4xl group-hover:scale-125 transition-transform">{crop.icon}</span>
                        <span className="text-white font-bold text-sm tracking-wide">{crop.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
