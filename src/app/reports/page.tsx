"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Sprout, BadgeDollarSign, HeartPulse, Loader2 } from "lucide-react";
import { useGlobalLanguage } from "@/lib/LanguageContext";
import { langMap } from "@/lib/langHelper";

export default function ReportsPage() {
  const { lang, t } = useGlobalLanguage();
  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/full-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: "Tomato",
          location: "Pune, Maharashtra",
          history: ["Early Blight (Moderate)"],
          metrics: { healthScore: 88, pesticideReduction: 42, ecoTreatments: 15 },
          langCode: lang
        })
      });
      const data = await res.json();
      setReport(data.report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    document.title = `${t.report_title} - AgriAI`;
    window.print();
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8 print:p-0 print:m-0">
      {/* Hide on print */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.reports_ecosystem}</h1>
            <p className="text-gray-500">{t.reports_desc}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-[#0f4c3a] hover:bg-[#0a3629]">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sprout className="mr-2 h-4 w-4" />}
              {t.btn_generate_full_report}
            </Button>
            {report && (
              <Button onClick={handlePrint} variant="outline" className="border-[#0f4c3a] text-[#0f4c3a]">
                <FileDown className="mr-2 h-4 w-4" /> {t.btn_download_pdf}
              </Button>
            )}
          </div>
        </div>

        {/* Impact Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-green-50/50 border-green-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg text-green-600"><Sprout className="h-6 w-6"/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t.label_crops_saved}</p>
                <h3 className="text-2xl font-bold text-gray-900">~2.4 Tons</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><HeartPulse className="h-6 w-6"/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t.label_chemical_reduction}</p>
                <h3 className="text-2xl font-bold text-gray-900">42%</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg text-amber-600"><BadgeDollarSign className="h-6 w-6"/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t.label_income_boost}</p>
                <h3 className="text-2xl font-bold text-gray-900">+15.5%</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Printable Report Area */}
      {report && (
        <Card className="print:shadow-none print:border-none print:m-0 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 print:bg-transparent">
            <CardTitle className="text-2xl text-[#0f4c3a]">{t.report_title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{t.report_generated} {langMap[lang] || "English"}</p>
          </CardHeader>
          <CardContent className="p-8 max-w-none">
            {report.split('\\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-[#0f4c3a]">{line.replace('## ', '')}</h2>;
              if (line.startsWith('**')) return <p key={i} className="mb-2"><strong>{line.replace(/\\*\\*/g, '')}</strong></p>;
              if (line.trim() === '') return <div key={i} className="h-2"></div>;
              return <p key={i} className="mb-2 text-gray-700 leading-relaxed">{line.replace(/\\*\\*/g, '')}</p>;
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
