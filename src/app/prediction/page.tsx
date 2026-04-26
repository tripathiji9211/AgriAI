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
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t.predict_title}</h1>
        <p className="text-gray-500">{t.predict_desc}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Input Form */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200 shadow-sm sticky top-24">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#0f4c3a]" />
                {t.params_title}
              </CardTitle>
              <CardDescription>{t.params_desc}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePredict} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.label_crop_type}</label>
                  <input required placeholder="e.g. Tomato, Potato, Wheat" value={formData.cropType} onChange={e => setFormData({...formData, cropType: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0f4c3a] focus:border-transparent outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.label_location}</label>
                  <input required placeholder="e.g. Pune, Maharashtra" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0f4c3a] focus:border-transparent outline-none text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t.label_temp}</label>
                    <input required placeholder="e.g. 25-30°C" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0f4c3a] outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t.label_humidity_percent}</label>
                    <input required placeholder="e.g. 85%" value={formData.humidity} onChange={e => setFormData({...formData, humidity: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0f4c3a] outline-none text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.label_past_diseases}</label>
                  <input placeholder="e.g. Blight last year" value={formData.pastDiseases} onChange={e => setFormData({...formData, pastDiseases: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0f4c3a] outline-none text-sm" />
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full bg-[#0f4c3a] hover:bg-[#0a3629] text-white py-6 mt-4">
                  {isLoading ? t.btn_analyzing_risks : t.btn_gen_predict}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Results */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <CloudRain className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-lg">{t.empty_predict_msg}</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-[#0f4c3a] bg-green-50/50 rounded-xl border border-green-100">
              <div className="w-12 h-12 border-4 border-[#0f4c3a] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">{t.running_models_msg}</p>
            </div>
          )}

          {result && !isLoading && (
            <>
              {/* Risk Summary Card */}
              <Card className={`border ${getRiskColor(result.risk_level)} shadow-sm`}>
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/50 rounded-full">
                      <AlertTriangle className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider opacity-80">{t.overall_risk_title}</p>
                      <h2 className="text-4xl font-black capitalize">{result.risk_level}</h2>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSetAlert}
                    disabled={alertSet}
                    className={`shrink-0 ${alertSet ? 'bg-green-600 text-white' : 'bg-white text-gray-900 border hover:bg-gray-50'}`}
                  >
                    {alertSet ? <><CheckCircle2 className="h-4 w-4 mr-2" /> {t.btn_alert_active}</> : <><BellRing className="h-4 w-4 mr-2" /> {t.btn_set_alert}</>}
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
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900">{disease.name}</p>
                          <p className="text-xs text-gray-500">{t.day_label || 'Day'} {disease.peak_risk_day}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-black ${disease.probability_percent > 70 ? 'text-red-600' : 'text-amber-600'}`}>
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
                <Card className="border-amber-200 bg-amber-50/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-amber-600" />
                      {t.contributing_factors_title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.contributing_factors?.slice(0,3).map((factor: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700">
                          <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      {t.preventive_actions_title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.preventive_actions?.slice(0,3).map((action: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></div>
                          <span>{action}</span>
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

