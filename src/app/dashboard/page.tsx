"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Activity, Droplets, Thermometer, AlertTriangle, Leaf, Bell, Clock, ChevronRight, CheckCircle2, Database, RefreshCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function DashboardPage() {
  const { t } = useGlobalLanguage();
  const [liveData, setLiveData] = useState<any>(null);
  const [agriDataset, setAgriDataset] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchKaggleFeed = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/kaggle-feed");
      const data = await res.json();
      setLiveData(data);
      
      const agriRes = await fetch("/api/agri-dataset");
      const agriData = await agriRes.json();
      setAgriDataset(agriData);
    } catch (e) {
      console.error("Failed to fetch feeds", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchKaggleFeed();
    const interval = setInterval(fetchKaggleFeed, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/60 via-slate-50 to-emerald-100/40 p-4 md:p-8 relative overflow-hidden pb-24">
      {/* Luminous Orbs for Premium Glassmorphism Effect */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-green-400/10 blur-[120px] pointer-events-none mix-blend-multiply" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none mix-blend-multiply" 
      />

      {/* Floating Agricultural Decor (Leaves) */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            x: Math.random() * 1200, 
            y: Math.random() * 1000,
            rotate: 0 
          }}
          animate={{ 
            opacity: [0, 0.25, 0],
            y: [null, -200 - Math.random() * 300],
            x: [null, Math.random() * 100 - 50],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 12 + Math.random() * 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 1.5 
          }}
          className="absolute pointer-events-none z-0"
        >
          <Leaf className="w-10 h-10 text-green-600/15" />
        </motion.div>
      ))}
      
      <div className="container mx-auto max-w-4xl space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-6 pt-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight font-serif drop-shadow-sm flex items-center gap-3">
              {t.dash_title}
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sprout className="w-10 h-10 text-[#00E599] neon-glow" />
              </motion.div>
            </h1>
            <p className="text-gray-600 font-medium text-lg">{t.dash_welcome}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] cursor-pointer hover:bg-white/80 transition-all relative"
          >
            <Bell className="w-5 h-5 text-[#0f4c3a]" />
            <div className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
          </motion.div>
        </div>

        {/* Hero Animated Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 md:h-64 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl group bg-[#0f4c3a]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <Image 
            src="/dashboard-hero.png" 
            alt="Smart Farming" 
            fill 
            className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                 <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-green-500 w-3 h-3 rounded-full shadow-[0_0_10px_#22c55e]"
                 />
                 <span className="text-white text-[10px] font-black uppercase tracking-widest bg-green-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30">AI Systems Live</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">Sustainable Future, <br/><span className="text-[#00E599] neon-text">Powered by AgriAI</span></h2>
            </motion.div>
          </div>

          {/* Animated Growth Lines Decoration */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0">
             <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                d="M-100,150 Q150,50 400,150 T900,150" 
                fill="none" 
                stroke="#00E599" 
                strokeWidth="2" 
             />
             <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, opacity: [0.05, 0.2, 0.05] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 1 }}
                d="M-50,200 Q250,100 500,200 T1050,200" 
                fill="none" 
                stroke="#00E599" 
                strokeWidth="1.5" 
             />
          </svg>
        </motion.div>

        {/* Luminous Glass Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {[
            { id: 'moisture', icon: Droplets, label: t.metric_moisture, value: liveData?.data?.find((d:any) => d.id === 'moisture')?.value || "32%", stat: t.stat_watering, colorClass: "bg-blue-100/80 text-blue-600", statClass: "text-blue-700 bg-blue-50 border border-blue-100" },
            { id: 'temp', icon: Thermometer, label: t.metric_temp, value: liveData?.data?.find((d:any) => d.id === 'temp')?.value || "28°C", stat: t.stat_optimal, colorClass: "bg-red-100/80 text-red-600", statClass: "text-red-700 bg-red-50 border border-red-100" },
            { id: 'health', icon: Sprout, label: t.metric_health, value: "Good", stat: t.stat_good_week, colorClass: "bg-green-100/80 text-green-600", statClass: "text-green-700 bg-green-50 border border-green-100" },
            { id: 'eco', icon: Activity, label: t.metric_eco, value: "85", stat: t.stat_excellent, colorClass: "bg-purple-100/80 text-purple-600", statClass: "text-purple-700 bg-purple-50 border border-purple-100" }
          ].map((metric, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-3xl p-5 flex flex-col items-center justify-center text-center group hover:bg-white/70 transition-all duration-500 cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`p-3.5 ${metric.colorClass} rounded-2xl mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-sm relative z-10`}>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                >
                  <metric.icon className="h-6 w-6" />
                </motion.div>
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1.5 relative z-10">{metric.label}</p>
              <h4 className="text-2xl font-black text-gray-900 mb-2 tracking-tight relative z-10">{metric.value}</h4>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm relative z-10 ${metric.statClass}`}>{metric.stat}</span>
            </motion.div>
          ))}
        </div>

        {/* Kaggle Live Feed Section with Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4">
             <div className="flex items-center gap-2 bg-green-100/80 text-green-700 text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border border-green-200">
               <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
               Live Kaggle Feed
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 relative aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white/60">
              <Image src="/sensor-icon.png" alt="Sensor" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100/80 text-blue-600 rounded-2xl">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide">Kaggle Dataset Sync</h3>
                  <p className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                    {isRefreshing ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                    {liveData?.feed_name || "Connecting to dataset..."} • Last sync: {liveData?.last_sync || "..."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="wait">
                  {liveData?.data?.map((item: any, idx: number) => (
                    <motion.div 
                      key={`${item.id}-${item.value}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm flex justify-between items-center hover:bg-white/90 transition-all cursor-default group/item"
                    >
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.label}</p>
                        <p className="text-lg font-black text-gray-900">{item.value} <span className="text-xs font-medium text-gray-500">{item.unit}</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 block mb-1">DATASET</span>
                        <span className="text-[10px] font-bold text-gray-400 italic group-hover/item:text-blue-500 transition-colors">{item.source.split(':')[1]}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Intelligence Network Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0f4c3a] text-white border border-white/10 shadow-2xl rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[#00E599] uppercase tracking-[0.3em] mb-1">Global Dataset Size</span>
              <h3 className="text-3xl font-black text-white leading-none">
                {agriDataset?.total_records?.toLocaleString() || "54,231"}+
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#00E599]/20 text-[#00E599] rounded-2xl border border-[#00E599]/30">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest text-[#00E599]">Intelligence Hub</h3>
              <p className="text-xs text-white/40 font-bold">Real-time Global Diagnostic Network</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
               <p className="text-sm text-white/60 leading-relaxed font-medium">
                 AgriAI is synced with 54,000+ global records of healthy and infected crops. 
                 Our models are constantly learning from the latest global outbreaks.
               </p>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Top Diseases Today</p>
                  <div className="space-y-2">
                     {["Leaf Blight", "Yellow Rust", "Bacterial Spot"].map((d, i) => (
                        <div key={i} className="flex items-center justify-between">
                           <span className="text-xs font-bold text-white/80">{d}</span>
                           <span className="text-[10px] font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded">High Risk</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-black/20 rounded-3xl border border-white/5 p-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                 <div className="space-y-2">
                    {agriDataset?.feed?.map((record: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${record.condition === "Healthy" ? "bg-green-500 shadow-[0_0_8px_#10b981]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`} />
                           <div>
                              <p className="text-xs font-black text-white leading-none">{record.crop}</p>
                              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{record.condition}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-[#00E599]">{record.confidence}</p>
                           <p className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">{record.location}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vertical Feed Section */}
        <div className="mt-6 relative z-10">
          <div className="flex items-center gap-3 mb-8 bg-white/40 backdrop-blur-md px-5 py-3 rounded-2xl w-fit border border-white/60 shadow-sm">
            <Activity className="w-5 h-5 text-[#0f4c3a]" />
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">{t.feed_title}</h2>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-green-200/50 before:via-teal-200/50 before:to-transparent before:rounded-full">
            
            {/* Feed Item 1: High Priority Alert */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-[0_4px_20px_rgba(245,158,11,0.3)] border border-amber-200 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2 md:-ml-6 transition-transform group-hover:scale-110 duration-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] p-6 rounded-[2rem] ml-4 md:ml-0 hover:bg-white/90 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-300" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">{t.alert_weather}</span>
                  <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Just now</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{t.alert_humidity}</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed font-medium">{t.alert_humidity_desc}</p>
                <Link href="/scanner">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20 py-6 text-base font-bold transition-all hover:scale-[1.02]">
                    {t.btn_scan_now} <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feed Item 2: Scan Result */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.2)] border border-green-200 bg-gradient-to-br from-green-100 to-green-50 text-green-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2 md:-ml-6 transition-transform group-hover:scale-110 duration-300">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 rounded-[2rem] ml-4 md:ml-0 hover:bg-white/70 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-[11px] font-black text-green-700 uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-md border border-green-100">{t.alert_scan_complete}</span>
                  <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 2 hours ago</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-3 relative z-10">Tomato Leaf Diagnosed</h3>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white shadow-sm relative z-10">
                  <div className="bg-green-100/50 p-2 rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-900">{t.alert_healthy}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{t.alert_no_action}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Item 3: Sustainability Insight */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-[0_4px_20px_rgba(59,130,246,0.2)] border border-blue-200 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2 md:-ml-6 transition-transform group-hover:scale-110 duration-300">
                <Activity className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 rounded-[2rem] ml-4 md:ml-0 hover:bg-white/70 transition-all duration-300 relative overflow-hidden">
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">{t.alert_eco_insight}</span>
                  <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Yesterday</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2 relative z-10">{t.alert_pesticide_down}</h3>
                <p className="text-sm text-gray-600 mb-5 font-medium leading-relaxed relative z-10">{t.alert_pesticide_desc}</p>
                <div className="w-full bg-blue-100/50 rounded-full h-3 border border-white relative z-10 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full w-[60%] relative">
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
