"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Droplets, MapPin, Loader2, Info, Navigation, Globe } from "lucide-react";
import LocationPickerMap from "@/components/LocationPickerMap";
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
  const [isDetecting, setIsDetecting] = useState(false);
  const [showMap, setShowMap] = useState(false);
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

  const detectLocation = () => {
    setIsDetecting(true);
    // Simulate reverse geocoding from browser API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we'd use a reverse geocoding API here
          // For demo, we'll pick a state randomly or based on coords
          setTimeout(() => {
            const states = ["Punjab", "Maharashtra", "UP", "MP", "Haryana"];
            const randomState = states[Math.floor(Math.random() * states.length)];
            setState(randomState);
            setIsDetecting(false);
          }, 1500);
        },
        (error) => {
          console.error("Location access denied", error);
          setIsDetecting(false);
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

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
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">{t.recommend_title}</h1>
        <p className="text-white/40 text-lg font-medium">{t.recommend_desc}</p>
      </div>

      <Card className="border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden glass-card">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Form Section */}
            <div className="p-6 md:p-10 w-full md:w-[55%] space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-white/80 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#00E599]" /> {t.label_state_select}
                  </label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowMap(!showMap)}
                      className={`text-[10px] font-black uppercase rounded-full px-3 h-7 border-white/10 transition-all ${showMap ? 'bg-[#00E599] text-black border-[#00E599]' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                    >
                      <Globe className="w-3 h-3 mr-1.5" /> {showMap ? "Hide Map" : "Map View"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={isDetecting}
                      onClick={detectLocation}
                      className="bg-white/5 text-white/60 hover:bg-white/10 border-white/10 text-[10px] font-black uppercase rounded-full px-3 h-7"
                    >
                      {isDetecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3 mr-1.5" />}
                      {isDetecting ? "Detecting..." : "Auto-Detect"}
                    </Button>
                  </div>
                </div>

                {showMap && (
                  <div className="animate-in zoom-in-95 duration-300">
                    <LocationPickerMap onSelectState={setState} selectedState={state} />
                  </div>
                )}

                {!showMap && (
                  <select 
                    className="w-full p-4 rounded-2xl border border-white/10 focus:ring-2 focus:ring-[#00E599] outline-none glass-input transition-all font-bold text-white shadow-inner"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="" className="bg-[#1a1a1a]">{t.label_state_select}...</option>
                    <option value="Punjab" className="bg-[#1a1a1a]">Punjab</option>
                    <option value="Maharashtra" className="bg-[#1a1a1a]">Maharashtra</option>
                    <option value="UP" className="bg-[#1a1a1a]">Uttar Pradesh</option>
                    <option value="MP" className="bg-[#1a1a1a]">Madhya Pradesh</option>
                    <option value="Haryana" className="bg-[#1a1a1a]">Haryana</option>
                  </select>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-white/80 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#00E599]" /> {t.label_soil_type}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {soilTypes.map(soil => (
                    <div 
                      key={soil.name}
                      onClick={() => setSoilType(soil.name)}
                      className={`cursor-pointer border-2 p-3 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-sm active:scale-95 ${soilType === soil.name ? 'border-[#00E599] shadow-md ring-2 ring-offset-2 ring-[#00E599]/20 bg-[#00E599]/10 text-white' : 'glass-panel border-white/5 hover:border-white/20 text-white/60'}`}
                    >
                      {soil.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white/80 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-[#00E599]" /> {t.label_soil_fertility}
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-white/50 bg-white/5 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors border border-white/10">
                    <input type="checkbox" checked={useDefaults} onChange={(e) => setUseDefaults(e.target.checked)} className="rounded text-[#00E599] focus:ring-[#00E599]" />
                    {t.label_dont_know_npk}
                  </label>
                </div>
                
                {!useDefaults && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-white/60"><span>{t.label_nitrogen}</span> <span className="text-[#00E599] bg-[#00E599]/10 px-2 rounded border border-[#00E599]/20">{n}</span></div>
                      <input type="range" min="0" max="100" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-full accent-[#00E599]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-white/60"><span>{t.label_phosphorus}</span> <span className="text-[#00E599] bg-[#00E599]/10 px-2 rounded border border-[#00E599]/20">{p}</span></div>
                      <input type="range" min="0" max="100" value={p} onChange={(e) => setP(parseInt(e.target.value))} className="w-full accent-[#00E599]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-white/60"><span>{t.label_potassium}</span> <span className="text-[#00E599] bg-[#00E599]/10 px-2 rounded border border-[#00E599]/20">{k}</span></div>
                      <input type="range" min="0" max="100" value={k} onChange={(e) => setK(parseInt(e.target.value))} className="w-full accent-[#00E599]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-white/60"><span>{t.label_ph_level}</span> <span className="text-[#00E599] bg-[#00E599]/10 px-2 rounded border border-[#00E599]/20">{ph}</span></div>
                      <input type="range" min="0" max="14" step="0.1" value={ph} onChange={(e) => setPh(parseFloat(e.target.value))} className="w-full accent-[#00E599]" />
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleRecommend}
                disabled={isLoading || !state || !soilType}
                className="w-full h-14 bg-[#00E599] hover:bg-[#00c986] text-black text-lg font-bold rounded-xl shadow-[0_0_15px_rgba(0,229,153,0.3)] transition-all active:scale-[0.98] mt-4"
              >
                {isLoading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : t.btn_get_recommendation}
              </Button>
            </div>

            {/* Results Section */}
            <div className="w-full md:w-[45%] bg-white/5 backdrop-blur-sm p-6 md:p-10 flex flex-col justify-center border-l border-white/10 relative">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 animate-in fade-in">
                  <Loader2 className="w-12 h-12 text-[#00E599] animate-spin mb-4 neon-glow" />
                  <p className="text-[#00E599] font-medium">{t.analyzing_soil_msg}</p>
                </div>
              )}
              
              {!isLoading && !results && (
                <div className="text-center text-white/40">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                     <Leaf className="w-12 h-12 text-[#00E599]/50" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.ready_to_analyze_title}</h3>
                  <p className="text-sm">{t.ready_to_analyze_desc}</p>
                </div>
              )}

              {!isLoading && results && (
                <div className="w-full space-y-5 animate-in slide-in-from-right-8 duration-500">
                  <div className="bg-[#00E599]/20 text-[#00E599] text-xs font-bold uppercase tracking-widest py-1.5 px-3 rounded-full inline-block mb-2 border border-[#00E599]/30">
                    {t.analysis_complete}
                  </div>
                  <h3 className="font-bold text-white text-2xl mb-4">{t.top_recommendations}</h3>
                  
                  <div className="space-y-4">
                    {results.map((crop, idx) => (
                      <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all relative overflow-hidden group backdrop-blur-md">
                        {idx === 0 && <div className="absolute top-0 left-0 w-[6px] h-full bg-[#00E599] shadow-[0_0_10px_#00E599]"></div>}
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform border border-white/10">
                            {crop.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-xl leading-tight">{crop.name}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[11px] font-bold uppercase text-white/40 tracking-wider">{t.label_sow_in}</span>
                              <span className="text-sm font-semibold text-white/80 bg-white/5 px-2 py-0.5 rounded border border-white/10">{crop.sowing_time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 bg-white/5 text-white/70 text-sm p-3 rounded-xl flex items-start gap-3 border border-white/5">
                          <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#00E599]" />
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
