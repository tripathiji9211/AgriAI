"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Droplets, Bug, Sprout, Wind, FileText, Loader2, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useGlobalLanguage } from "@/lib/LanguageContext";

const MOCK_METRICS = {
  pesticideReduction: 42,
  ecoTreatments: 15,
  co2Saved: 850,
  healthScore: 88
};

const CHART_DATA = [
  { month: "Jan", usage: 100 },
  { month: "Feb", usage: 95 },
  { month: "Mar", usage: 90 },
  { month: "Apr", usage: 82 },
  { month: "May", usage: 75 },
  { month: "Jun", usage: 70 },
  { month: "Jul", usage: 62 },
  { month: "Aug", usage: 55 },
  { month: "Sep", usage: 50 },
  { month: "Oct", usage: 45 },
  { month: "Nov", usage: 42 },
  { month: "Dec", usage: 38 },
];

export default function SustainabilityDashboard() {
  const { t, lang } = useGlobalLanguage();
  const [tips, setTips] = useState<any[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState(true);
  
  const [report, setReport] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    setIsLoadingTips(true);
    fetch("/api/sustainability-tips", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ langCode: lang })
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setTips(data);
        setIsLoadingTips(false);
      })
      .catch(() => setIsLoadingTips(false));
  }, [lang]);

  const generateReport = async () => {
    setIsLoadingReport(true);
    try {
      const res = await fetch("/api/sustainability-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...MOCK_METRICS, langCode: lang })
      });
      const data = await res.json();
      setReport(data.report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingReport(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t.sustain_title}</h1>
          <p className="text-white/40 text-lg">{t.sustain_desc}</p>
        </div>
        <Button onClick={generateReport} disabled={isLoadingReport} className="bg-[#00E599] hover:bg-[#00c986] text-black h-12 px-8 font-bold shadow-[0_0_20px_rgba(0,229,153,0.3)]">
          {isLoadingReport ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.btn_analyzing}</> : <><FileText className="mr-2 h-4 w-4" /> {t.btn_gen_report}</>}
        </Button>
      </div>

      {report && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl animate-in slide-in-from-top-4">
          <CardHeader className="pb-2 border-b border-white/5">
            <CardTitle className="text-xl text-[#00E599] flex items-center gap-3">
              <Leaf className="h-6 w-6 neon-glow" />
              {t.report_ai_title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-lg">{report}</p>
          </CardContent>
        </Card>
      )}

      {/* Metrics Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{t.label_pesticide_reduced}</p>
                <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">{MOCK_METRICS.pesticideReduction}%</h3>
              </div>
              <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/30">
                <Bug className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{t.label_eco_treatments_count}</p>
                <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">{MOCK_METRICS.ecoTreatments}</h3>
              </div>
              <div className="p-4 bg-green-500/20 rounded-2xl border border-green-500/30">
                <Sprout className="h-6 w-6 text-[#00E599]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{t.label_co2_saved}</p>
                <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">{MOCK_METRICS.co2Saved} <span className="text-sm font-bold text-white/40">kg</span></h3>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                <Wind className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#00E599] border-none shadow-[0_0_30px_rgba(0,229,153,0.3)]">
          <CardContent className="p-8 text-black">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">{t.label_health_score}</p>
                <h3 className="text-4xl font-black mt-2 tracking-tighter">{MOCK_METRICS.healthScore}<span className="text-sm font-bold opacity-60">/100</span></h3>
              </div>
              <div className="p-4 bg-black/10 rounded-2xl border border-black/10">
                <Target className="h-6 w-6 text-black" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.chart_usage_title}</CardTitle>
            <CardDescription className="text-white/40">{t.chart_usage_desc}</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] min-h-[300px]">
            <div dir="ltr" className="h-full w-full min-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'rgba(255,255,255,0.4)'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'rgba(255,255,255,0.4)'}} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="usage" stroke="#00E599" strokeWidth={4} dot={{r: 4, fill: '#00E599', strokeWidth: 0}} activeDot={{r: 6, stroke: '#fff', strokeWidth: 2}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bars */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.impact_title}</CardTitle>
            <CardDescription className="text-white/40">{t.impact_desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-black text-white/60 flex items-center gap-3 uppercase tracking-widest text-[10px]"><Sprout className="h-5 w-5 text-[#8b5a2b]" /> {t.label_soil_health}</span>
                <span className="font-black text-white text-base">85%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 border border-white/5 overflow-hidden">
                <div className="bg-[#8b5a2b] h-full rounded-full shadow-[0_0_10px_rgba(139,90,43,0.3)]" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-black text-white/60 flex items-center gap-3 uppercase tracking-widest text-[10px]"><Droplets className="h-5 w-5 text-blue-500" /> {t.label_water_quality}</span>
                <span className="font-black text-white text-base">92%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 border border-white/5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-black text-white/60 flex items-center gap-3 uppercase tracking-widest text-[10px]"><Leaf className="h-5 w-5 text-[#00E599]" /> {t.label_biodiversity}</span>
                <span className="font-black text-white text-base">78%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 border border-white/5 overflow-hidden">
                <div className="bg-[#00E599] h-full rounded-full shadow-[0_0_10px_rgba(0,229,153,0.3)]" style={{ width: '78%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Tips */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-widest">{t.ai_tips_title}</h2>
        {isLoadingTips ? (
          <div className="flex items-center justify-center p-12 text-white/10 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 backdrop-blur-md">
            <Loader2 className="h-12 w-12 animate-spin text-[#00E599]" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((t_tip, i) => (
              <Card key={i} className="border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all group rounded-3xl">
                <CardContent className="p-8 flex flex-col h-full justify-between gap-6">
                  <p className="text-white/80 leading-relaxed font-medium">{t_tip.tip}</p>
                  <div className="flex items-center gap-2 self-start bg-[#00E599]/10 text-[#00E599] px-4 py-1.5 rounded-xl text-xs font-black border border-[#00E599]/20 group-hover:bg-[#00E599]/20 transition-all">
                    <Leaf className="h-4 w-4" />
                    ECO SCORE: {t_tip.score}/10
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
