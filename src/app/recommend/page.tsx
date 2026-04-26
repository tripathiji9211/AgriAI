"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Droplets, MapPin, Loader2, Info } from "lucide-react";

interface Recommendation {
  name: string;
  sowing_time: string;
  fertilizer_gap: string;
  icon: string;
}

import { useGlobalLanguage } from "@/lib/LanguageContext";

interface Recommendation {
  name: string;
  sowing_time: string;
  fertilizer_gap: string;
  icon: string;
}

export default function RecommendCropPage() {
  const { t } = useGlobalLanguage();
  const [state, setState] = useState("");
  const [soilType, setSoilType] = useState("");
  const [n, setN] = useState(50);
  const [p, setP] = useState(50);
  const [k, setK] = useState(50);
  const [ph, setPh] = useState(6.5);
  const [useDefaults, setUseDefaults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);

  const soilTypes = [
    { name: t.soil_alluvial || "Alluvial", color: "bg-orange-100 border-orange-300" },
    { name: t.soil_black || "Black Cotton", color: "bg-gray-800 border-gray-600 text-white" },
    { name: t.soil_red || "Red", color: "bg-red-100 border-red-300" },
    { name: t.soil_laterite || "Laterite", color: "bg-yellow-100 border-yellow-300" },
  ];

  const handleRecommend = async () => {
    if (!state || !soilType) return;
    
    setIsLoading(true);
    setResults(null);
    
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          n, p, k, ph, state, soilType,
          useDefaults
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResults(data.recommendations);
    } catch (error) {
      console.error("Recommendation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#0f4c3a]">{t.recommend_title}</h1>
        <p className="text-gray-500 text-lg">{t.recommend_desc}</p>
      </div>

      <Card className="border border-green-100 shadow-xl shadow-green-900/5 rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Form Section */}
            <div className="p-6 md:p-10 w-full md:w-[55%] bg-white space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0f4c3a]" /> {t.label_state_select}
                </label>
                <select 
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f4c3a] outline-none bg-gray-50/50 transition-all font-medium"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">{t.label_state_select}...</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="MP">Madhya Pradesh</option>
                  <option value="Haryana">Haryana</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#0f4c3a]" /> {t.label_soil_type}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {soilTypes.map(soil => (
                    <div 
                      key={soil.name}
                      onClick={() => setSoilType(soil.name)}
                      className={`cursor-pointer border-2 p-3 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-sm active:scale-95 ${soilType === soil.name ? 'border-[#0f4c3a] shadow-md ring-2 ring-offset-2 ring-[#0f4c3a]/20 ' + soil.color : 'bg-white border-gray-100 hover:border-gray-300 text-gray-600'}`}
                    >
                      {soil.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-[#0f4c3a]" /> {t.label_soil_fertility}
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                    <input type="checkbox" checked={useDefaults} onChange={(e) => setUseDefaults(e.target.checked)} className="rounded text-[#0f4c3a] focus:ring-[#0f4c3a]" />
                    {t.label_dont_know_npk}
                  </label>
                </div>
                
                {!useDefaults && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-600"><span>{t.label_nitrogen}</span> <span className="text-[#0f4c3a] bg-green-50 px-2 rounded">{n}</span></div>
                      <input type="range" min="0" max="100" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-full accent-[#0f4c3a]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-600"><span>{t.label_phosphorus}</span> <span className="text-[#0f4c3a] bg-green-50 px-2 rounded">{p}</span></div>
                      <input type="range" min="0" max="100" value={p} onChange={(e) => setP(parseInt(e.target.value))} className="w-full accent-[#0f4c3a]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-600"><span>{t.label_potassium}</span> <span className="text-[#0f4c3a] bg-green-50 px-2 rounded">{k}</span></div>
                      <input type="range" min="0" max="100" value={k} onChange={(e) => setK(parseInt(e.target.value))} className="w-full accent-[#0f4c3a]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-600"><span>{t.label_ph_level}</span> <span className="text-[#0f4c3a] bg-green-50 px-2 rounded">{ph}</span></div>
                      <input type="range" min="0" max="14" step="0.1" value={ph} onChange={(e) => setPh(parseFloat(e.target.value))} className="w-full accent-[#0f4c3a]" />
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleRecommend}
                disabled={isLoading || !state || !soilType}
                className="w-full h-14 bg-[#0f4c3a] hover:bg-[#0a3629] text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4"
              >
                {isLoading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : t.btn_get_recommendation}
              </Button>
            </div>

            {/* Results Section */}
            <div className="w-full md:w-[45%] bg-[#f8faf9] p-6 md:p-10 flex flex-col justify-center border-l border-gray-100 relative">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f8faf9]/80 backdrop-blur-sm z-10 animate-in fade-in">
                  <Loader2 className="w-12 h-12 text-[#0f4c3a] animate-spin mb-4" />
                  <p className="text-[#0f4c3a] font-medium">{t.analyzing_soil_msg}</p>
                </div>
              )}
              
              {!isLoading && !results && (
                <div className="text-center text-gray-400">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                     <Leaf className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">{t.ready_to_analyze_title}</h3>
                  <p className="text-sm">{t.ready_to_analyze_desc}</p>
                </div>
              )}

              {!isLoading && results && (
                <div className="w-full space-y-5 animate-in slide-in-from-right-8 duration-500">
                  <div className="bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest py-1.5 px-3 rounded-full inline-block mb-2">
                    {t.analysis_complete}
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 text-2xl mb-4">{t.top_recommendations}</h3>
                  
                  <div className="space-y-4">
                    {results.map((crop, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 hover:shadow-md transition-all relative overflow-hidden group">
                        {idx === 0 && <div className="absolute top-0 left-0 w-[6px] h-full bg-[#0f4c3a]"></div>}
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-[#0f4c3a]/5 rounded-xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                            {crop.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#0f4c3a] text-xl leading-tight">{crop.name}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">{t.label_sow_in}</span>
                              <span className="text-sm font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{crop.sowing_time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 bg-[#f8faf9] text-[#0f4c3a] text-sm p-3 rounded-xl flex items-start gap-3 border border-green-900/10">
                          <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                          <p className="font-medium leading-relaxed">{crop.fertilizer_gap}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
