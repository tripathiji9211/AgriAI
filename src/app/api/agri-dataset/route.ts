import { NextResponse } from 'next/server';

// Simulated massive dataset metadata based on PlantVillage and Kaggle agricultural data
const crops = ["Rice", "Wheat", "Tomato", "Potato", "Corn", "Grape", "Apple", "Pepper", "Strawberry"];
const conditions = ["Healthy", "Early Blight", "Late Blight", "Leaf Spot", "Rust", "Yellow Leaf Curl Virus", "Bacterial Spot"];

export async function GET() {
  // Generate 50 unique real-time "Global Feed" records from a simulated pool of 50,000+
  const records = Array.from({ length: 50 }).map((_, i) => {
    const crop = crops[Math.floor(Math.random() * crops.length)];
    const condition = Math.random() > 0.7 ? conditions[Math.floor(Math.random() * (conditions.length - 1) + 1)] : "Healthy";
    const confidence = (85 + Math.random() * 14).toFixed(1);
    
    return {
      id: `AGRI-DB-${10000 + i + Math.floor(Math.random() * 40000)}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      crop,
      condition,
      confidence: `${confidence}%`,
      location: ["Punjab, IN", "Iowa, US", "Maharashtra, IN", "Nairobi, KE", "Sichuan, CN", "Almeria, ES"][Math.floor(Math.random() * 6)],
      severity: condition === "Healthy" ? "None" : (Math.random() > 0.5 ? "Moderate" : "High")
    };
  });

  return NextResponse.json({
    total_records: 54231, // Simulated total dataset size
    last_updated: new Date().toISOString(),
    feed: records
  });
}
