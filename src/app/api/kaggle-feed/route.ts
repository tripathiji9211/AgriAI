import { NextResponse } from 'next/server';

export async function GET() {
  // Simulating a live feed from a Kaggle-sourced dataset 
  // (e.g., "Smart Agriculture Sensor Data" or "IOT_Agri_Sensor_V2")
  
  const now = new Date();
  const timestamp = now.toLocaleTimeString();
  
  // Simulation logic: Oscillation around realistic base values
  // These metrics represent common data points in Kaggle agriculture datasets
  const metrics = [
    { 
      id: "moisture", 
      label: "Soil Moisture", 
      value: (32 + Math.sin(now.getTime() / 10000) * 2 + Math.random()).toFixed(1), 
      unit: "%", 
      status: "Optimal",
      source: "Kaggle: smart-farming-dataset-v1"
    },
    { 
      id: "temp", 
      label: "Ambient Temp", 
      value: (27 + Math.cos(now.getTime() / 15000) * 1.5 + Math.random()).toFixed(1), 
      unit: "°C", 
      status: "Normal",
      source: "Kaggle: weather-sensor-data"
    },
    { 
      id: "light", 
      label: "Solar Intensity", 
      value: (850 + Math.sin(now.getTime() / 20000) * 50 + Math.random() * 20).toFixed(0), 
      unit: "lux", 
      status: "Good",
      source: "Kaggle: iot-agri-telemetry"
    },
    { 
      id: "ph", 
      label: "Soil pH", 
      value: (6.5 + Math.sin(now.getTime() / 30000) * 0.1 + (Math.random() - 0.5) * 0.05).toFixed(2), 
      unit: "pH", 
      status: "Neutral",
      source: "Kaggle: soil-quality-dataset"
    }
  ];

  return NextResponse.json({
    feed_name: "Kaggle Live Agri-Telemetry Feed",
    connected: true,
    last_sync: timestamp,
    data: metrics
  });
}
