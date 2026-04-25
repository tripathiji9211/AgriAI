import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Leaf, ShieldCheck, Sprout, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-green-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-green-900">
                  Grow Smarter with <span className="text-green-600">AgriAI</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                  Empowering farmers with early plant disease detection, eco-friendly treatment recommendations, and personalized AI guidance.
                </p>
              </div>
              <div className="space-x-4 mt-8">
                <Link href="/login">
                  <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 h-14 px-8 text-lg font-semibold rounded-full shadow-lg transition-transform hover:scale-105">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <Sprout className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Disease Detection</h3>
                <p className="text-gray-500">Instantly identify crop diseases by uploading a photo of the affected leaf.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <ShieldCheck className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Eco-Friendly Solutions</h3>
                <p className="text-gray-500">Receive organic and minimal-chemical treatment recommendations to preserve soil health.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Smart Insights</h3>
                <p className="text-gray-500">Track your sustainability metrics and get weather-based predictive alerts.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
