"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Image as ImageIcon, Upload, CheckCircle2, AlertTriangle, Leaf, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleScan = () => {
    if (!file) return;
    setIsScanning(true);

    // Mock API call for disease detection
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        disease: "Early Blight",
        confidence: 94.2,
        severity: "Moderate",
        recommendations: [
          "Remove and destroy infected lower leaves immediately.",
          "Apply organic Neem Oil spray (2 tbsp per gallon of water).",
          "Ensure proper air circulation and avoid overhead watering.",
        ]
      });
    }, 2500);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Plant Disease Scanner</h1>
        <p className="text-gray-500">Upload a clear photo of the affected leaf for instant AI diagnosis.</p>
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
                    Cancel
                  </Button>
                  <Button onClick={handleScan} disabled={isScanning} className="bg-green-600 hover:bg-green-700">
                    {isScanning ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Camera className="mr-2 h-4 w-4" /> Scan Disease</>
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
                  <h3 className="font-semibold text-lg">Upload an Image</h3>
                  <p className="text-sm text-gray-500">Take a photo or upload from gallery</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700">
                    <ImageIcon className="mr-2 h-4 w-4" /> Choose File
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" /> Open Camera
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
              <h2 className="text-xl font-bold">Detection Results</h2>
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
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Identified Disease</p>
                    <h3 className="text-2xl font-bold text-gray-900">{result.disease}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-green-700">{result.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Severity Level</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 mt-1">
                      {result.severity}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <div className="bg-green-50 border-b border-green-100 p-4 flex items-center gap-3">
              <Leaf className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-green-900">Eco-Friendly Treatment Plan</h2>
            </div>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {result.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
              Scan Another Crop
            </Button>
            <Link href="/advisor">
              <Button className="bg-green-600 hover:bg-green-700">
                Ask Advisor for Help
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
