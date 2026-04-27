import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { n, p, k, ph, state, soilType } = await req.json();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Call the Python ML Backend
    const backendUrl = process.env.ML_BACKEND_URL || "http://127.0.0.1:8000";
    
    let recommended_crop = "wheat"; // Fallback default
    
    try {
      const mlResponse = await fetch(`${backendUrl}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: n, P: p, K: k,
          temperature: 25.0, // Defaults or from weather API
          humidity: 80.0,
          ph: ph,
          rainfall: 200.0
        })
      });

      if (!mlResponse.ok) {
         console.warn("ML Backend returned error. Ensure FastAPI is running on port 8000.");
      } else {
         const data = await mlResponse.json();
         recommended_crop = data.recommended_crop;
      }
    } catch (fetchError) {
      console.warn("ML Backend unreachable. Ensure FastAPI is running on port 8000. Using fallback.");
    }

    // Map predicted crop to rich UI metadata
    const cropMetadata: Record<string, any> = {
      rice: { name: "Rice (Kharif)", sowing_time: "June - July", icon: "🌾", tip: "High water requirement. Ensure 2-3 inches of standing water." },
      maize: { name: "Maize", sowing_time: "June - July", icon: "🌽", tip: "Ensure good drainage. High Nitrogen required." },
      wheat: { name: "Wheat (Rabi)", sowing_time: "October - November", icon: "🌾", tip: "Requires cool weather. 4-5 irrigations needed." },
      cotton: { name: "Cotton", sowing_time: "June - July", icon: "☁️", tip: "Black soil is best. Control for pink bollworm." },
      soybean: { name: "Soybean", sowing_time: "June", icon: "🌱", tip: "Nodule formation needs Phosphorus." },
      mustard: { name: "Mustard", sowing_time: "September - October", icon: "🌼", tip: "Add Sulphur for better oil yield." },
      coffee: { name: "Coffee", sowing_time: "May - June", icon: "☕", tip: "Shade-grown is better. Red laterite soil is ideal." },
      jute: { name: "Jute", sowing_time: "March - May", icon: "🎋", tip: "High humidity and alluvial soil required." },
      grapes: { name: "Grapes", sowing_time: "January - February", icon: "🍇", tip: "Requires pruning and fungal management." }
    };

    const result = cropMetadata[recommended_crop.toLowerCase()] || {
      name: recommended_crop.charAt(0).toUpperCase() + recommended_crop.slice(1),
      sowing_time: "Consult local calendar",
      icon: "🌱",
      tip: "General recommendation based on soil parameters."
    };

    const recommendations = [
      {
        name: result.name,
        sowing_time: result.sowing_time,
        fertilizer_gap: result.tip,
        icon: result.icon
      }
    ];

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error("Recommend API Error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
