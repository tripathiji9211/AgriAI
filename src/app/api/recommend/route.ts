import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { n, p, k, ph, state, soilType } = await req.json();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Call the Python ML Backend
    const backendUrl = process.env.ML_BACKEND_URL || "http://127.0.0.1:8000";
    
    // Smart Simulation Logic: Deciding crop based on State, Soil, and NPK
    // This ensures that even if ML backend is unreachable, the prototype provides logical results.
    let recommended_crop = "";

    const soil = soilType?.toLowerCase() || "";
    const reg = state?.toLowerCase() || "";

    if (soil.includes("black")) {
      recommended_crop = (n > 60) ? "cotton" : "soybean";
    } else if (soil.includes("laterite")) {
      recommended_crop = "coffee";
    } else if (soil.includes("alluvial")) {
      if (reg.includes("punjab") || reg.includes("haryana")) {
        recommended_crop = "wheat";
      } else {
        recommended_crop = "rice";
      }
    } else if (soil.includes("red")) {
      recommended_crop = (ph < 6) ? "grapes" : "mustard";
    } else {
      recommended_crop = "maize"; // Default
    }

    // Try the actual ML backend if available to override simulation
    try {
      const mlResponse = await fetch(`${backendUrl}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: n, P: p, K: k,
          temperature: 25.0, 
          humidity: 80.0,
          ph: ph,
          rainfall: 200.0
        }),
        signal: AbortSignal.timeout(1000) // Don't hang if backend is slow
      });

      if (mlResponse.ok) {
         const data = await mlResponse.json();
         if (data.recommended_crop) recommended_crop = data.recommended_crop;
      }
    } catch (e) {
      // Stay with simulated logic
    }

    // Map predicted crop to rich UI metadata
    const cropMetadata: Record<string, any> = {
      rice: { name: "Rice (Kharif)", sowing_time: "June - July", icon: "🌾", tip: "Requires high water and alluvial soil. Keep fields submerged." },
      maize: { name: "Maize", sowing_time: "June - July", icon: "🌽", tip: "Ensure good drainage. High Nitrogen required for cob development." },
      wheat: { name: "Wheat (Rabi)", sowing_time: "October - November", icon: "🌾", tip: "Thrives in Punjab/Haryana alluvial soil. Requires cool climate." },
      cotton: { name: "Cotton", sowing_time: "June - July", icon: "☁️", tip: "Black soil is best for moisture retention. Control for pests." },
      soybean: { name: "Soybean", sowing_time: "June", icon: "🌱", tip: "Excellent for black soil. Nodule formation needs Phosphorus." },
      mustard: { name: "Mustard", sowing_time: "September - October", icon: "🌼", tip: "Good for red/sandy soils. Add Sulphur for better oil yield." },
      coffee: { name: "Coffee", sowing_time: "May - June", icon: "☕", tip: "Red laterite soil is ideal. High altitude/shade preferred." },
      jute: { name: "Jute", sowing_time: "March - May", icon: "🎋", tip: "High humidity and alluvial soil required for fiber quality." },
      grapes: { name: "Grapes", sowing_time: "January - February", icon: "🍇", tip: "Suitable for well-drained red soils in Maharashtra region." }
    };

    const result = cropMetadata[recommended_crop.toLowerCase()] || {
      name: recommended_crop.charAt(0).toUpperCase() + recommended_crop.slice(1),
      sowing_time: "Consult local calendar",
      icon: "🌱",
      tip: "Recommendation based on simulated soil-region analysis."
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
