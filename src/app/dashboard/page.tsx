import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Activity, Droplets, Thermometer, Wind, AlertTriangle, Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Overview</h1>
          <p className="text-gray-500">Welcome back! Here's your crop status today.</p>
        </div>
      </div>

      {/* Alert Section */}
      <Card className="bg-amber-50 border-l-4 border-l-amber-500 shadow-sm">
        <CardContent className="p-4 flex gap-4 items-start">
          <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">High Humidity Alert</h3>
            <p className="text-sm text-amber-700 mt-1">Weather conditions indicate an 85% risk of early blight in your tomato crop over the next 48 hours.</p>
            <Link href="/scanner">
              <Button variant="outline" size="sm" className="mt-3 bg-white text-amber-700 border-amber-300 hover:bg-amber-100">
                Scan Crop Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Droplets className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Soil Moisture</p>
            <h4 className="text-xl font-bold text-gray-900">32%</h4>
            <span className="text-xs text-amber-600">Needs watering</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
              <Thermometer className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Temperature</p>
            <h4 className="text-xl font-bold text-gray-900">28°C</h4>
            <span className="text-xs text-green-600">Optimal</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Sprout className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Crop Health</p>
            <h4 className="text-xl font-bold text-gray-900">Good</h4>
            <span className="text-xs text-green-600">+12% from last week</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <Activity className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Eco Score</p>
            <h4 className="text-xl font-bold text-gray-900">85/100</h4>
            <span className="text-xs text-green-600">Excellent</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-green-100 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tomato Leaf</p>
                    <p className="text-sm text-gray-500">Today, 09:41 AM</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-amber-100 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Potato Leaf</p>
                    <p className="text-sm text-gray-500">Yesterday, 14:30 PM</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Early Blight
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Pesticide Reduction</span>
                 <span className="font-medium text-green-600">-40% this month</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div className="bg-green-600 h-2 rounded-full w-[40%]"></div>
               </div>

               <div className="flex justify-between items-center text-sm mt-4">
                 <span className="text-gray-600">Water Efficiency</span>
                 <span className="font-medium text-blue-600">85% optimal</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div className="bg-blue-600 h-2 rounded-full w-[85%]"></div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
