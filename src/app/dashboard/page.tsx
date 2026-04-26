"use client";

import { Sprout, Activity, Droplets, Thermometer, AlertTriangle, Leaf, Bell, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function DashboardPage() {
  const { t } = useGlobalLanguage();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/60 via-slate-50 to-emerald-100/40 p-4 md:p-8 relative overflow-hidden">
      {/* Luminous Orbs for Premium Glassmorphism Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-400/20 blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-teal-300/10 blur-[100px] pointer-events-none mix-blend-multiply" />
      
      <div className="container mx-auto max-w-3xl space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10 pt-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight font-serif drop-shadow-sm">{t.dash_title}</h1>
            <p className="text-gray-600 font-medium text-lg">{t.dash_welcome}</p>
          </div>
          <div className="w-12 h-12 bg-white/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] cursor-pointer hover:bg-white/80 transition-all hover:scale-105 active:scale-95">
            <Bell className="w-5 h-5 text-[#0f4c3a]" />
            <div className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
          </div>
        </div>

        {/* Luminous Glass Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {[
            { icon: Droplets, label: t.metric_moisture, value: "32%", stat: t.stat_watering, colorClass: "bg-blue-100/80 text-blue-600", statClass: "text-blue-700 bg-blue-50 border border-blue-100" },
            { icon: Thermometer, label: t.metric_temp, value: "28°C", stat: t.stat_optimal, colorClass: "bg-red-100/80 text-red-600", statClass: "text-red-700 bg-red-50 border border-red-100" },
            { icon: Sprout, label: t.metric_health, value: "Good", stat: t.stat_good_week, colorClass: "bg-green-100/80 text-green-600", statClass: "text-green-700 bg-green-50 border border-green-100" },
            { icon: Activity, label: t.metric_eco, value: "85", stat: t.stat_excellent, colorClass: "bg-purple-100/80 text-purple-600", statClass: "text-purple-700 bg-purple-50 border border-purple-100" }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-3xl p-5 flex flex-col items-center justify-center text-center group hover:bg-white/70 transition-all duration-500 hover:-translate-y-1.5 cursor-default relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`p-3.5 ${metric.colorClass} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm relative z-10`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1.5 relative z-10">{metric.label}</p>
              <h4 className="text-3xl font-black text-gray-900 mb-2 tracking-tight relative z-10">{metric.value}</h4>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm relative z-10 ${metric.statClass}`}>{metric.stat}</span>
            </div>
          ))}
        </div>

        {/* Vertical Feed Section */}
        <div className="mt-14 relative z-10">
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
