"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, CloudRain, Thermometer, Info, BellRing, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useGlobalLanguage } from "@/lib/LanguageContext";

export default function PredictionPage() {
  const { t, lang } = useGlobalLanguage();
  const [formData, setFormData] = useState({
    cropType: "",
    location: "",
    season: "",
    temperature: "",
    humidity: "",
    pastDiseases: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [alertSet, setAlertSet] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setAlertSet(false);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, langCode: lang })
      });
      const data = await res.json();
      
      // Generate 7-day timeline data for the chart based on the top disease peak risk day
      if (data && data.predicted_diseases && data.predicted_diseases.length > 0) {
        const topDisease = data.predicted_diseases[0];
        const peakDay = topDisease.peak_risk_day || 3;
        const maxProb = topDisease.probability_percent || 80;
        
        // Simple bell curve generation around the peak day
        const chartData = Array.from({ length: 7 }).map((_, i) => {
          const day = i + 1;
          const distance = Math.abs(day - peakDay);
          const probability = Math.max(10, Math.round(maxProb - (distance * 15) + (Math.random() * 5)));
          return {
            name: `${t.day_label || 'Day'} ${day}`,
            risk: Math.min(100, probability)
          };
        });
        data.chartData = chartData;
      }

      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAlert = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("AgriAI Disease Alert Set", {
            body: "We will notify you if risk levels spike in your area.",
            icon: "/favicon.ico"
          });
          setAlertSet(true);
        } else {
          alert("Please enable notifications in your browser settings.");
        }
      });
    } else {
      alert("Your browser doesn't support notifications.");
    }
  };

  const getRiskColor = (level: string) => {
    if (level === "high") return "text-red-800 bg-red-100 border-red-200";
    if (level === "medium") return "text-amber-800 bg-amber-100 border-amber-200";
    return "text-green-800 bg-green-100 border-green-200";
  };

  const getBarColor = (risk: number) => {
    if (risk >= 75) return "#dc2626"; // red-600
    if (risk >= 40) return "#d97706"; // amber-600
    return "#16a34a"; // green-600
  };

  return (
    <div className="container mx-auto p-4 md:p-12 max-w-7xl space-y-12 animate-in fade-in duration-700">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{t.predict_title}</h1>
        <p className="text-white/40 text-lg max-w-2xl">{t.predict_desc}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Input Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-white/5 overflow-visible">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="text-xl flex items-center gap-3 text-[#00E599]">
                <TrendingUp className="h-6 w-6 neon-glow" />
                {t.params_title}
              </CardTitle>
              <CardDescription className="text-white/40">{t.params_desc}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handlePredict} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">{t.label_crop_type}</label>
                  <input required placeholder="e.g. Tomato, Potato, Wheat" value={formData.cropType} onChange={e => setFormData({...formData, cropType: e.target.value})} className="w-full glass-input p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">{t.label_location}</label>
                  <input required placeholder="e.g. Pune, Maharashtra" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full glass-input p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">{t.label_temp}</label>
                    <input required placeholder="e.g. 25-30°C" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} className="w-full glass-input p-3 rounded-xl outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">{t.label_humidity_percent}</label>
                    <input required placeholder="e.g. 85%" value={formData.humidity} onChange={e => setFormData({...formData, humidity: e.target.value})} className="w-full glass-input p-3 rounded-xl outline-none text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">{t.label_past_diseases}</label>
                  <input placeholder="e.g. Blight last year" value={formData.pastDiseases} onChange={e => setFormData({...formData, pastDiseases: e.target.value})} className="w-full glass-input p-3 rounded-xl outline-none text-sm" />
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg font-bold mt-6 shadow-[0_0_25px_rgba(0,229,153,0.2)]">
                  {isLoading ? t.btn_analyzing_risks : t.btn_gen_predict}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Results */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm">
              <CloudRain className="h-24 w-24 mb-6 opacity-10" />
              <p className="text-xl font-medium tracking-wide">{t.empty_predict_msg}</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-[#00E599] bg-[#00E599]/5 rounded-3xl border border-[#00E599]/10 backdrop-blur-md">
              <div className="w-16 h-16 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-xl font-bold tracking-wide">{t.running_models_msg}</p>
            </div>
          )}

          {result && !isLoading && (
            <>
              {/* Risk Summary Card */}
              <Card className={`border ${getRiskColor(result.risk_level)} shadow-sm`}>
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                      <AlertTriangle className="h-12 w-12 neon-glow" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">{t.overall_risk_title}</p>
                      <h2 className="text-6xl font-black capitalize tracking-tight">{result.risk_level}</h2>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSetAlert}
                    disabled={alertSet}
                    className={`shrink-0 h-14 px-8 text-base font-bold rounded-xl transition-all ${alertSet ? 'bg-white/10 text-white cursor-default' : 'bg-white text-black hover:scale-105 active:scale-95'}`}
                  >
                    {alertSet ? <><CheckCircle2 className="h-5 w-5 mr-2" /> {t.btn_alert_active}</> : <><BellRing className="h-5 w-5 mr-2" /> {t.btn_set_alert}</>}
                  </Button>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Chart */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t.chart_timeline_title}</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] w-full">
                    {result.chartData && (
                      <div dir="ltr" className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={result.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                            <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                              {result.chartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.risk)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Threats */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t.predicted_threats_title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.predicted_diseases?.map((disease: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div>
                          <p className="text-lg font-bold text-white">{disease.name}</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-white/30">{t.day_label || 'Day'} {disease.peak_risk_day}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-black ${disease.probability_percent > 70 ? 'text-red-500' : 'text-amber-500'}`}>
                            {disease.probability_percent}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Factors & Prevention */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-3 text-amber-500">
                      <Thermometer className="h-6 w-6" />
                      {t.contributing_factors_title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {result.contributing_factors?.slice(0,3).map((factor: string, i: number) => (
                        <li key={i} className="flex gap-4 text-white/60">
                          <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-base leading-relaxed">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-3 text-blue-500">
                      <CheckCircle2 className="h-6 w-6" />
                      {t.preventive_actions_title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {result.preventive_actions?.slice(0,3).map((action: string, i: number) => (
                        <li key={i} className="flex gap-4 text-white/60">
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                          <span className="text-base leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

