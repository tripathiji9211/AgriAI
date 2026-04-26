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
    moisture: { value: 65, trend: genTrend(65, 5), unit: "%", label: t.label_soil_moisture, threshold: 30, criticalFn: (v:number) => v < 30 },
    temperature: { value: 24, trend: genTrend(24, 2), unit: "°C", label: t.label_temperature, threshold: 35, criticalFn: (v:number) => v > 35 },
    humidity: { value: 60, trend: genTrend(60, 8), unit: "%", label: t.label_humidity, threshold: 80, criticalFn: (v:number) => v > 80 },
    ph: { value: 6.5, trend: genTrend(6.5, 0.2), unit: "pH", label: t.label_soil_ph, threshold: 5.5, criticalFn: (v:number) => v < 5.5 || v > 8.0 },
    leafWetness: { value: 4, trend: genTrend(4, 1), unit: "idx", label: t.label_leaf_wetness, threshold: 8, criticalFn: (v:number) => v > 8 }
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
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-8 w-8 text-[#0f4c3a]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.iot_title}</h1>
          <p className="text-gray-500">{t.iot_desc}</p>
        </div>
      </div>

      {alert && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex justify-between items-start shadow-sm animate-in slide-in-from-top-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />
            <div>
              <h3 className="text-red-800 font-bold">{t.ai_alert_title}</h3>
              <p className="text-red-700 text-sm mt-1 leading-relaxed">{alert}</p>
            </div>
          </div>
          <button onClick={() => setAlert(null)} className="text-red-400 hover:text-red-600"><X className="h-5 w-5"/></button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(sensors).map(([key, s]) => {
          const colorClass = getColor(s);
          const hexColor = colorClass.includes('red') ? '#ef4444' : colorClass.includes('amber') ? '#f59e0b' : '#22c55e';
          
          return (
            <Card key={key} className="border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="pb-2 flex flex-row justify-between items-center bg-gray-50/50">
                <CardTitle className="text-sm font-medium text-gray-600">{s.label}</CardTitle>
                {s.label === t.label_soil_moisture || s.label === t.label_humidity ? <Droplets className="h-4 w-4 text-gray-400" /> : <Thermometer className="h-4 w-4 text-gray-400" />}
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-end mb-4">
                  <h2 className={`text-4xl font-black ${colorClass.split(' ')[0]}`}>{s.value}<span className="text-lg font-normal text-gray-500 ml-1">{s.unit}</span></h2>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                  <div className={`h-full ${colorClass.split(' ')[1]} transition-all duration-1000 ease-in-out`} style={{ width: `${Math.min(100, Math.max(0, s.label === t.label_soil_ph ? (s.value/14)*100 : s.label === t.label_leaf_wetness ? (s.value/10)*100 : s.value))}%` }}></div>
                </div>

                <div className="h-[60px] w-full opacity-70" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={s.trend}>
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                      <Line type="monotone" dataKey="val" stroke={hexColor} strokeWidth={2} dot={false} isAnimationActive={false} />
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
