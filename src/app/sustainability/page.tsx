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
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{t.sustain_title}</h1>
          <p className="text-gray-500">{t.sustain_desc}</p>
        </div>
        <Button onClick={generateReport} disabled={isLoadingReport} className="bg-[#0f4c3a] hover:bg-[#0a3629]">
          {isLoadingReport ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.btn_analyzing}</> : <><FileText className="mr-2 h-4 w-4" /> {t.btn_gen_report}</>}
        </Button>
      </div>

      {report && (
        <Card className="border-green-200 bg-green-50 shadow-sm animate-in slide-in-from-top-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-900 flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              {t.report_ai_title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 leading-relaxed whitespace-pre-wrap">{report}</p>
          </CardContent>
        </Card>
      )}

      {/* Metrics Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{t.label_pesticide_reduced}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{MOCK_METRICS.pesticideReduction}%</h3>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Bug className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{t.label_eco_treatments_count}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{MOCK_METRICS.ecoTreatments}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Sprout className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{t.label_co2_saved}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{MOCK_METRICS.co2Saved} <span className="text-sm font-normal text-gray-500">kg</span></h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Wind className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#0f4c3a] bg-[#0f4c3a] text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-100">{t.label_health_score}</p>
                <h3 className="text-3xl font-bold mt-1">{MOCK_METRICS.healthScore}<span className="text-sm font-normal text-green-200">/100</span></h3>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle>{t.chart_usage_title}</CardTitle>
            <CardDescription>{t.chart_usage_desc}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] min-h-[300px]">
            <div dir="ltr" className="h-full w-full min-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#16a34a" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bars */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>{t.impact_title}</CardTitle>
            <CardDescription>{t.impact_desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700 flex items-center gap-2"><Sprout className="h-4 w-4 text-[#8b5a2b]" /> {t.label_soil_health}</span>
                <span className="font-bold text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-[#8b5a2b] h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700 flex items-center gap-2"><Droplets className="h-4 w-4 text-blue-500" /> {t.label_water_quality}</span>
                <span className="font-bold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700 flex items-center gap-2"><Leaf className="h-4 w-4 text-green-500" /> {t.label_biodiversity}</span>
                <span className="font-bold text-gray-900">78%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Tips */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{t.ai_tips_title}</h2>
        {isLoadingTips ? (
          <div className="flex items-center justify-center p-12 text-gray-400 border-2 border-dashed rounded-xl bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-[#0f4c3a]" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((t_tip, i) => (
              <Card key={i} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{t_tip.tip}</p>
                  <div className="flex items-center gap-1.5 self-start bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100 mt-2">
                    <Leaf className="h-3 w-3" />
                    Eco Score: {t_tip.score}/10
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
