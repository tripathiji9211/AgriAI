"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Activity, Droplets, Thermometer, AlertTriangle, X } from "lucide-react";
import { useGlobalLanguage } from "@/lib/LanguageContext";

// Helper to generate trend data
const genTrend = (base: number, variance: number) => 
  Array.from({length: 24}).map((_, i) => ({ time: i, val: base + (Math.random() * variance * 2) - variance }));

export default function IoTMonitorPage() {
  const { t, lang } = useGlobalLanguage();
  const [sensors, setSensors] = useState({
    moisture: { value: 65, trend: genTrend(65, 5), unit: "%", label: t.label_soil_moisture, threshold: 30, criticalFn: (v:number) => v < 30, source: "Kaggle: smart-farming-v1" },
    temperature: { value: 24, trend: genTrend(24, 2), unit: "°C", label: t.label_temperature, threshold: 35, criticalFn: (v:number) => v > 35, source: "Kaggle: weather-sensor-data" },
    humidity: { value: 60, trend: genTrend(60, 8), unit: "%", label: t.label_humidity, threshold: 80, criticalFn: (v:number) => v > 80, source: "Kaggle: iot-agri-telemetry" },
    ph: { value: 6.5, trend: genTrend(6.5, 0.2), unit: "pH", label: t.label_soil_ph, threshold: 5.5, criticalFn: (v:number) => v < 5.5 || v > 8.0, source: "Kaggle: soil-quality-dataset" },
    leafWetness: { value: 4, trend: genTrend(4, 1), unit: "idx", label: t.label_leaf_wetness, threshold: 8, criticalFn: (v:number) => v > 8, source: "Kaggle: crop-health-monitoring" }
  });

  const [alert, setAlert] = useState<string | null>(null);
  const [cropType] = useState("Tomato");

  useEffect(() => {
    // Update labels if t changes
    setSensors(prev => ({
      ...prev,
      moisture: { ...prev.moisture, label: t.label_soil_moisture },
      temperature: { ...prev.temperature, label: t.label_temperature },
      humidity: { ...prev.humidity, label: t.label_humidity },
      ph: { ...prev.ph, label: t.label_soil_ph },
      leafWetness: { ...prev.leafWetness, label: t.label_leaf_wetness }
    }));
  }, [t]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => {
        const next = { ...prev };
        let newAlertTriggered = false;

        Object.keys(next).forEach(key => {
          const k = key as keyof typeof sensors;
          const s = next[k];
          
          let newVal = s.value + (Math.random() * 4 - 2);
          if(k === 'ph') newVal = s.value + (Math.random() * 0.2 - 0.1);
          
          newVal = Math.max(0, newVal);
          if (k === 'humidity' || k === 'moisture') newVal = Math.min(100, newVal);
          
          s.value = parseFloat(newVal.toFixed(1));
          s.trend = [...s.trend.slice(1), { time: Date.now(), val: s.value }];

          if (s.criticalFn(s.value) && !alert && !newAlertTriggered) {
             newAlertTriggered = true;
             triggerAlert(s.label, s.value);
          }
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [alert, t]);

  const triggerAlert = async (sensorName: string, value: number) => {
    try {
      const res = await fetch("/api/iot-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensor: sensorName, value, crop_type: cropType, langCode: lang })
      });
      const data = await res.json();
      setAlert(data.alert || t.iot_critical_msg);
    } catch (e) {
      console.error(e);
    }
  };

  const getColor = (s: any) => {
    if (s.criticalFn(s.value)) return "text-red-500 bg-red-500";
    if (s.label === t.label_humidity && s.value > 70) return "text-amber-500 bg-amber-500";
    if (s.label === t.label_soil_moisture && s.value < 40) return "text-amber-500 bg-amber-500";
    return "text-green-500 bg-green-500";
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-10 animate-in fade-in duration-700 pb-24">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
          <Activity className="h-8 w-8 text-[#00E599] neon-glow" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t.iot_title}</h1>
          <p className="text-white/40 text-lg font-medium">{t.iot_desc}</p>
        </div>
      </div>

      {alert && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex justify-between items-start shadow-2xl animate-in slide-in-from-top-4 backdrop-blur-md">
          <div className="flex gap-4">
            <AlertTriangle className="h-7 w-7 text-red-500 shrink-0" />
            <div>
              <h3 className="text-red-400 font-black uppercase tracking-widest text-sm">{t.ai_alert_title}</h3>
              <p className="text-white/80 text-lg mt-2 leading-relaxed font-medium">{alert}</p>
            </div>
          </div>
          <button onClick={() => setAlert(null)} className="text-white/20 hover:text-white transition-colors"><X className="h-6 w-6"/></button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(sensors).map(([key, s]) => {
          const colorClass = getColor(s);
          const isCritical = s.criticalFn(s.value);
          const hexColor = isCritical ? '#ef4444' : colorClass.includes('amber') ? '#f59e0b' : '#00E599';
          
          return (
            <Card key={key} className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden group hover:border-white/20 transition-all">
              <CardHeader className="pb-4 flex flex-row justify-between items-center border-b border-white/5 bg-white/5">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{s.label}</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">SOURCE: {s.source.split(':')[1]}</span>
                  {s.label === t.label_soil_moisture || s.label === t.label_humidity ? <Droplets className="h-5 w-5 text-white/20" /> : <Thermometer className="h-5 w-5 text-white/20" />}
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex justify-between items-end mb-6">
                  <h2 className={`text-5xl font-black tracking-tighter ${isCritical ? 'text-red-500' : colorClass.includes('amber') ? 'text-amber-500' : 'text-white'}`}>
                    {s.value}<span className="text-xl font-bold text-white/20 ml-1 uppercase">{s.unit}</span>
                  </h2>
                </div>
                
                <div className="w-full bg-white/5 rounded-full h-3 mb-8 overflow-hidden border border-white/5 shadow-inner">
                  <div className={`h-full ${isCritical ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : colorClass.includes('amber') ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-[#00E599] shadow-[0_0_10px_rgba(0,229,153,0.5)]'} transition-all duration-1000 ease-in-out`} style={{ width: `${Math.min(100, Math.max(0, s.label === t.label_soil_ph ? (s.value/14)*100 : s.label === t.label_leaf_wetness ? (s.value/10)*100 : s.value))}%` }}></div>
                </div>

                <div className="h-[80px] w-full opacity-60 group-hover:opacity-100 transition-opacity" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={s.trend}>
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                      <Line type="monotone" dataKey="val" stroke={hexColor} strokeWidth={4} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
