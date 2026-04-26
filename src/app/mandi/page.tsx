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
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#0f4c3a]">{t.mandi_title}</h1>
        <p className="text-gray-500 text-lg font-sans">{t.mandi_desc}</p>
      </div>

      {/* Search & Filters Section */}
      <Card className="border border-green-100 shadow-sm bg-white rounded-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{t.label_state}</label>
              <input 
                type="text" 
                placeholder={t.placeholder_state} 
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f4c3a] focus:border-transparent focus:outline-none transition-all bg-gray-50/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{t.label_district}</label>
              <input 
                type="text" 
                placeholder={t.placeholder_district} 
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f4c3a] focus:border-transparent focus:outline-none transition-all bg-gray-50/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{t.label_crop}</label>
              <input 
                type="text" 
                placeholder={t.placeholder_crop} 
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f4c3a] focus:border-transparent focus:outline-none transition-all bg-gray-50/50"
              />
            </div>
          </div>
          
          <Button 
            onClick={fetchPrices} 
            disabled={isLoading || (!state && !district && !commodity)}
            className="w-full md:w-auto h-12 px-8 text-base font-semibold bg-[#0f4c3a] hover:bg-[#0a3629] text-white rounded-xl shadow-md transition-all active:scale-95"
          >
            {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t.btn_fetching_prices}</> : <><Search className="w-5 h-5 mr-2" /> {t.btn_search_prices}</>}
          </Button>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-gray-100">
              <CardHeader className="space-y-2 pb-2">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="h-16 bg-green-50 rounded-xl"></div>
                <div className="flex justify-between border-t pt-3">
                   <div className="h-10 bg-gray-100 rounded w-1/3"></div>
                   <div className="h-10 bg-gray-100 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Data Display Grid */}
      {records.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
          {records.map((record, idx) => (
            <Card key={idx} className="border-t-4 border-t-[#0f4c3a] hover:shadow-xl transition-shadow bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 bg-gray-50/50">
                <CardTitle className="text-xl font-bold font-serif text-[#0f4c3a] flex justify-between items-center">
                  <span className="truncate pr-2">{record.commodity}</span>
                  <span className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-full shadow-sm shrink-0">
                    {record.arrival_date}
                  </span>
                </CardTitle>
                <div className="flex items-center text-gray-500 text-sm mt-2 font-medium">
                  <MapPin className="h-4 w-4 mr-1 text-[#0f4c3a]" />
                  {record.market}, {record.district}
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <div className="bg-green-50/80 p-4 rounded-xl flex items-center justify-between border border-green-100/50">
                  <span className="text-green-800 font-semibold text-sm">{t.label_modal_price}</span>
                  <span className="text-2xl font-bold text-[#0f4c3a]">₹{record.modal_price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">{t.label_min_price}</span>
                    <span className="font-semibold text-gray-700 text-lg">₹{record.min_price}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">{t.label_max_price}</span>
                    <span className="font-semibold text-green-700 text-lg">₹{record.max_price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {records.length === 0 && !isLoading && !error && (
         <div className="text-center py-24 text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-30 text-[#0f4c3a]" />
            <p className="text-lg font-medium text-gray-500">{t.empty_mandi_msg}</p>
         </div>
      )}
    </div>
  );
}
