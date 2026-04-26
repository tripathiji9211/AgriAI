"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Image as ImageIcon, Upload, CheckCircle2, AlertTriangle, Leaf, Loader2, WifiOff } from "lucide-react";
import Link from "next/link";
import { useGlobalLanguage } from "@/lib/LanguageContext";
import { savePendingScan } from "@/lib/idb";

export default function ScannerPage() {
  const { t, lang } = useGlobalLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [treatmentPlan, setTreatmentPlan] = useState<any>(null);
  const [isLoadingTreatment, setIsLoadingTreatment] = useState(false);
  const [activeTab, setActiveTab] = useState<"organic" | "chemical" | "preventive">("organic");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setTreatmentPlan(null);

    // If Offline, save to IndexedDB
    if (!navigator.onLine) {
      setIsScanning(false);
      try {
        await savePendingScan(file);
        setResult({
          disease: "Pending Sync",
          confidence: 0,
          severity: "Offline",
          offline: true
        });
      } catch (e) {
        alert("Failed to save offline scan.");
      }
      return;
    }

    // Mock API call for disease detection (Online)
    setTimeout(async () => {
      setIsScanning(false);
      const detectionResult = {
        disease: "Early Blight",
        confidence: 94.2,
        severity: "Moderate"
      };
      setResult(detectionResult);
      
      // Call Claude API for treatment
      setIsLoadingTreatment(true);
      try {
        const res = await fetch("/api/treatment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disease_name: detectionResult.disease, severity: detectionResult.severity, langCode: lang })
        });
        const data = await res.json();
        if (res.ok) {
           setTreatmentPlan(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingTreatment(false);
      }
    }, 2500);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t.scan_title}</h1>
        <p className="text-gray-500">{t.scan_desc}</p>
      </div>

      {!result ? (
        <Card className="border-2 border-dashed border-green-200 bg-green-50/50">
          <CardContent className="flex flex-col items-center justify-center p-10 min-h-[400px]">
            {preview ? (
              <div className="space-y-6 w-full flex flex-col items-center">
                <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Leaf preview" className="object-cover w-full h-full" />
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => { setFile(null); setPreview(null); }}>
                    {t.btn_cancel}
                  </Button>
                  <Button onClick={handleScan} disabled={isScanning} className="bg-green-600 hover:bg-green-700">
                    {isScanning ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.btn_analyzing}</>
                    ) : (
                      <><Camera className="mr-2 h-4 w-4" /> {t.btn_scan_disease}</>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Upload className="h-10 w-10 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{t.upload_heading}</h3>
                  <p className="text-sm text-gray-500">{t.upload_subheading}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700">
                    <ImageIcon className="mr-2 h-4 w-4" /> {t.btn_choose_file}
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" /> {t.btn_open_camera}
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-amber-200 bg-amber-50 overflow-hidden">
            <div className="bg-amber-500 text-white p-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold">{t.results_title}</h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {preview && (
                  <div className="relative rounded-lg overflow-hidden shadow-sm aspect-square max-w-[200px] mx-auto sm:mx-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Scanned Leaf" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 border-4 border-amber-500/50 rounded-lg"></div>
                  </div>
                )}
                {result.offline ? (
                  <div className="space-y-4 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-3 text-amber-700 bg-amber-100 p-4 rounded-xl border border-amber-200">
                      <WifiOff className="w-8 h-8 shrink-0" />
                      <p className="font-medium text-sm">{t.offline_msg}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{t.label_disease}</p>
                      <h3 className="text-2xl font-bold text-gray-900">{result.disease}</h3>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{t.label_confidence}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-green-700">{result.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{t.label_severity}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 mt-1">
                        {result.severity}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <div className="bg-green-50 border-b border-green-100 p-4 flex items-center gap-3">
              <Leaf className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-green-900">{t.treatment_plan_title}</h2>
            </div>
            <CardContent className="p-0">
              {isLoadingTreatment ? (
                <div className="p-12 flex flex-col items-center justify-center text-green-600">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>{t.generating_plan}</p>
                </div>
              ) : treatmentPlan ? (
                <div>
                  <div className="flex border-b border-gray-200 bg-gray-50/50">
                    <button onClick={() => setActiveTab("organic")} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "organic" ? "border-green-600 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>{t.organic_tab}</button>
                    <button onClick={() => setActiveTab("chemical")} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "chemical" ? "border-amber-500 text-amber-700 bg-amber-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>{t.chemical_tab}</button>
                    <button onClick={() => setActiveTab("preventive")} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "preventive" ? "border-blue-500 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>{t.preventive_tab}</button>
                  </div>
                  
                  <div className="p-6">
                    {activeTab === "organic" && (
                      <div className="space-y-6">
                        {treatmentPlan.organic.map((t: any, i: number) => {
                           const isRecommended = t.name === [...treatmentPlan.organic].sort((a,b) => b.ecoScore - a.ecoScore)[0]?.name;
                           return (
                             <div key={i} className={`p-4 rounded-xl border ${isRecommended ? "bg-green-50 border-green-200 ring-1 ring-green-500/20" : "bg-white border-gray-200"}`}>
                               <div className="flex justify-between items-start mb-3">
                                 <div>
                                   <div className="flex items-center gap-2">
                                     <h4 className="font-bold text-gray-900">{t.name}</h4>
                                     {isRecommended && <span className="text-[10px] uppercase tracking-wider font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">Recommended</span>}
                                   </div>
                                 </div>
                                 <div className="flex items-center gap-1 bg-green-100 px-2.5 py-1 rounded-md shrink-0">
                                   <Leaf className="h-3.5 w-3.5 text-green-700" />
                                   <span className="text-xs font-bold text-green-800">Score: {t.ecoScore}/10</span>
                                 </div>
                               </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                 <div><span className="font-medium text-gray-900">Method:</span> {t.method}</div>
                                 <div><span className="font-medium text-gray-900">Frequency:</span> {t.frequency}</div>
                                 <div className="sm:col-span-2"><span className="font-medium text-gray-900">Estimated Cost:</span> {t.cost}</div>
                               </div>
                             </div>
                           );
                        })}
                      </div>
                    )}

                    {activeTab === "chemical" && (
                      <div className="space-y-6">
                        <div className="bg-amber-100 text-amber-800 p-3 rounded-lg flex gap-3 text-sm border border-amber-200">
                          <AlertTriangle className="h-5 w-5 shrink-0" />
                          <p>{t.chemical_warning}</p>
                        </div>
                        {treatmentPlan.chemical.map((t: any, i: number) => (
                           <div key={i} className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
                             <h4 className="font-bold text-gray-900">{t.name}</h4>
                             <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100 font-medium">{t.impactWarning}</p>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                               <div><span className="font-medium text-gray-900">Dosage:</span> {t.dosage}</div>
                               <div><span className="font-medium text-gray-900">Safety:</span> {t.safety}</div>
                             </div>
                           </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "preventive" && (
                      <ul className="space-y-3">
                        {treatmentPlan.preventive.map((t: string, i: number) => (
                          <li key={i} className="flex gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm leading-relaxed">{t}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
              {t.btn_scan_another}
            </Button>
            <Link href="/advisor">
              <Button className="bg-green-600 hover:bg-green-700">
                {t.btn_ask_advisor}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
