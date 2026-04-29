"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";

import { useGlobalLanguage } from "@/lib/LanguageContext";

interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  arrival_date: string;
}

export default function MandiPricesPage() {
  const { t } = useGlobalLanguage();
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [commodity, setCommodity] = useState("");
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (state) params.append("state", state);
      if (district) params.append("district", district);
      if (commodity) params.append("commodity", commodity);

      const res = await fetch(`/api/mandi?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch from server");
      
      if (data.records && data.records.length === 0) {
        setError(t.err_no_data);
      }
      
      setRecords(data.records || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t.mandi_title}</h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl mx-auto">{t.mandi_desc}</p>
      </div>

      {/* Search & Filters Section */}
      <Card className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-[#00E599]">{t.label_state}</label>
              <input 
                type="text" 
                placeholder={t.placeholder_state} 
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-14 p-5 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#00E599] focus:border-transparent focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-[#00E599]">{t.label_district}</label>
              <input 
                type="text" 
                placeholder={t.placeholder_district} 
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-14 p-5 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#00E599] focus:border-transparent focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-[#00E599]">{t.label_crop}</label>
              <input 
                type="text" 
                placeholder={t.placeholder_crop} 
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full h-14 p-5 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#00E599] focus:border-transparent focus:outline-none transition-all"
              />
            </div>
          </div>
          
          <Button 
            onClick={fetchPrices} 
            disabled={isLoading || (!state && !district && !commodity)}
            className="w-full md:w-auto h-14 px-10 text-lg font-black bg-[#00E599] hover:bg-[#00c986] text-black rounded-2xl shadow-[0_0_20px_rgba(0,229,153,0.3)] transition-all active:scale-95 uppercase tracking-widest"
          >
            {isLoading ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> {t.btn_fetching_prices}</> : <><Search className="w-6 h-6 mr-2" /> {t.btn_search_prices}</>}
          </Button>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 text-red-400 animate-in slide-in-from-top-2">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <p className="font-bold text-lg">{error}</p>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-white/5 bg-white/5 rounded-3xl h-64"></Card>
          ))}
        </div>
      )}

      {/* Data Display Grid */}
      {records.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
          {records.map((record, idx) => (
            <Card key={idx} className="border border-white/10 hover:border-[#00E599]/40 transition-all bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden group shadow-2xl">
              <CardHeader className="pb-4 border-b border-white/5 bg-white/5">
                <CardTitle className="text-2xl font-black text-white flex justify-between items-center">
                  <span className="truncate pr-2">{record.commodity}</span>
                  <span className="text-[10px] font-black text-[#00E599] bg-[#00E599]/10 border border-[#00E599]/20 px-3 py-1 rounded-full uppercase tracking-widest shrink-0">
                    {record.arrival_date}
                  </span>
                </CardTitle>
                <div className="flex items-center text-white/40 text-sm mt-3 font-bold uppercase tracking-tighter">
                  <MapPin className="h-4 w-4 mr-2 text-[#00E599]" />
                  {record.market}, {record.district}
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="bg-[#00E599]/10 p-6 rounded-2xl flex items-center justify-between border border-[#00E599]/10 group-hover:bg-[#00E599]/20 transition-all">
                  <span className="text-[#00E599] font-black text-xs uppercase tracking-widest">{t.label_modal_price}</span>
                  <span className="text-3xl font-black text-white tracking-tighter">₹{record.modal_price}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/5 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">{t.label_min_price}</span>
                    <span className="font-black text-white text-xl tracking-tighter">₹{record.min_price}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">{t.label_max_price}</span>
                    <span className="font-black text-[#00E599] text-xl tracking-tighter">₹{record.max_price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {records.length === 0 && !isLoading && !error && (
         <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10 backdrop-blur-md">
            <TrendingUp className="h-24 w-24 mx-auto mb-6 opacity-10 text-white" />
            <p className="text-2xl font-black text-white/20 uppercase tracking-[0.2em]">{t.empty_mandi_msg}</p>
         </div>
      )}
    </div>
  );
}
