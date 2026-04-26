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
      <section className="pt-24 pb-32 px-4 bg-white flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-8">
          <Sprout className="h-4 w-4 text-[#4ade80]" />
          <span className="text-sm font-medium text-green-800">{t.hero_sub}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto">
          {t.appName === "AgriAI" ? (
            <>Detect. Protect. <span className="text-[#4ade80]">Sustain.</span></>
          ) : t.hero_headline}
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-[600px] mx-auto leading-relaxed">
          {t.hero_desc}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link href="/scanner">
            <Button className="bg-[#0f4c3a] hover:bg-[#0a3629] text-white rounded-xl px-8 py-6 h-auto text-lg font-medium shadow-lg flex items-center gap-2 w-full sm:w-auto">
              <Upload className="h-5 w-5" />
              {t.upload_btn}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => setIsLearnMoreOpen(true)}
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-8 py-6 h-auto text-lg font-medium w-full sm:w-auto shadow-sm"
          >
            {t.learn_more}
          </Button>
        </div>
      </section>

      {/* Second Section */}
      <section className="py-24 px-4 bg-[#f9fafb] border-t border-gray-100 flex flex-col items-center text-center flex-1">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          {t.features_title}
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          {t.features_sub}
        </p>
        
        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full text-left">
          
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-green-50 p-3 rounded-2xl mb-6">
              <Shield className="h-6 w-6 text-[#0f4c3a]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">{t.feat_detect_title}</h3>
            <p className="text-gray-500 font-sans leading-relaxed">
              {t.feat_detect_desc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-green-50 p-3 rounded-2xl mb-6">
              <BarChart className="h-6 w-6 text-[#0f4c3a]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">{t.feat_predict_title}</h3>
            <p className="text-gray-500 font-sans leading-relaxed">
              {t.feat_predict_desc}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-green-50 p-3 rounded-2xl mb-6">
              <Sprout className="h-6 w-6 text-[#0f4c3a]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">{t.feat_sustain_title}</h3>
            <p className="text-gray-500 font-sans leading-relaxed">
              {t.feat_sustain_desc}
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-green-50 p-3 rounded-2xl mb-6">
              <Cpu className="h-6 w-6 text-[#0f4c3a]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">{t.feat_iot_title}</h3>
            <p className="text-gray-500 font-sans leading-relaxed">
              {t.feat_iot_desc}
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-green-50 p-3 rounded-2xl mb-6">
              <FileText className="h-6 w-6 text-[#0f4c3a]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">{t.feat_reports_title}</h3>
            <p className="text-gray-500 font-sans leading-relaxed">
              {t.feat_reports_desc}
            </p>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Column 1 */}
            <div className="flex flex-col items-start">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Leaf className="h-7 w-7 text-[#0f4c3a]" />
                <span className="text-2xl font-bold tracking-tight text-gray-900">
                  Agri<span className="text-[#16a34a]">AI</span>
                </span>
              </Link>
              <p className="text-gray-500 leading-relaxed">
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
                <li><Link href="/scanner" className="hover:text-[#16a34a] transition-colors">{t.nav_detection}</Link></li>
                <li><Link href="/prediction" className="hover:text-[#16a34a] transition-colors">{t.nav_prediction}</Link></li>
                <li><Link href="/mandi" className="hover:text-[#16a34a] transition-colors">{t.nav_mandi}</Link></li>
                <li><Link href="/sustainability" className="hover:text-[#16a34a] transition-colors">{t.nav_sustainability}</Link></li>
                <li><Link href="/iot" className="hover:text-[#16a34a] transition-colors">{t.nav_iot}</Link></li>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLearnMoreOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-100 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-serif text-[#0f4c3a] flex items-center gap-2">
                <Leaf className="w-6 h-6" /> {t.modal_discover}
              </h2>
              <button onClick={() => setIsLearnMoreOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-10 space-y-10">
              
              {/* Heading */}
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold font-serif text-[#0f4c3a]">{t.modal_how_helps}</h3>
              </div>

              {/* Video Container */}
              <div className="relative w-full max-w-3xl mx-auto aspect-video bg-gray-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden flex items-center justify-center group border-4 border-white">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 relative max-w-4xl mx-auto">
                <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-[2px] bg-green-100 -z-10"></div>
                
                <div className="flex flex-col items-center text-center bg-white">
                  <div className="w-20 h-20 rounded-full bg-green-50 text-[#0f4c3a] flex items-center justify-center mb-5 shadow-sm border-2 border-green-100 ring-4 ring-white">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-xl">{t.step_scan}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed px-2">{t.step_scan_desc}</p>
                </div>

                <div className="flex flex-col items-center text-center bg-white">
                  <div className="w-20 h-20 rounded-full bg-green-50 text-[#0f4c3a] flex items-center justify-center mb-5 shadow-sm border-2 border-green-100 ring-4 ring-white">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-xl">{t.step_identify}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed px-2">{t.step_identify_desc}</p>
                </div>

                <div className="flex flex-col items-center text-center bg-white">
                  <div className="w-20 h-20 rounded-full bg-green-50 text-[#0f4c3a] flex items-center justify-center mb-5 shadow-sm border-2 border-green-100 ring-4 ring-white">
                    <Droplets className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-xl">{t.step_heal}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed px-2">{t.step_heal_desc}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link href="/scanner" onClick={() => setIsLearnMoreOpen(false)}>
                  <Button className="w-full sm:w-auto bg-[#0f4c3a] hover:bg-[#0a3629] text-white px-8 py-6 h-auto text-lg font-bold rounded-xl shadow-md">
                    {t.btn_try_now}
                  </Button>
                </Link>
                <Link href="/scanner" onClick={() => setIsLearnMoreOpen(false)}>
                  <Button variant="outline" className="w-full sm:w-auto bg-white border-gray-200 text-[#0f4c3a] hover:bg-gray-50 px-8 py-6 h-auto text-lg font-bold rounded-xl shadow-sm">
                    {t.supported_crops}
                  </Button>
                </Link>
              </div>

              {/* Trust Bar */}
              <div className="border-t border-gray-100 pt-6 text-center">
                <p className="text-sm font-medium text-gray-500 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-[#16a34a]" /> 
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
