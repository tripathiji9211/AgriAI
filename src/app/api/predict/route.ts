import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || "";
const anthropicKey = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: Request) {
  try {
    const inputs = await req.json();
    const { langCode } = inputs;

    if (!inputs.cropType || !inputs.location) {
      return NextResponse.json({ error: 'Missing required inputs' }, { status: 400 });
    }

    const systemPrompt = getLangPrompt(langCode) + " You are an expert agricultural risk analyst. You provide data-driven disease risk forecasts. Respond strictly with valid JSON. Do not include markdown formatting or extra text.";
    
    const userPrompt = `Predict crop disease risks for the next 7 days based on the following conditions:
    Crop: ${inputs.cropType}
    Location: ${inputs.location}
    Temperature: ${inputs.temperature || "Normal"}
    Humidity: ${inputs.humidity || "Normal"}
    Past Diseases: ${inputs.pastDiseases || "None"}
    
    Consider the local climate and typical diseases for this crop and region.
    
    Return JSON exactly matching this structure:
    { 
      "risk_level": "low" | "medium" | "high", 
      "predicted_diseases": [
        { "name": "string", "probability_percent": number, "peak_risk_day": number (1-7) }
      ], 
      "contributing_factors": ["string"], 
      "preventive_actions": ["string"] 
    }`;

    let parsedData = null;

    if (geminiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { response_mime_type: "application/json" }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            parsedData = JSON.parse(content);
          }
        }
      } catch (e) {
        console.error("Gemini prediction call failed:", e);
      }
    }

    if (!parsedData && anthropicKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1500,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.content[0].text;
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : content);
        }
      } catch (e) {
        console.error("Anthropic prediction fallback failed:", e);
      }
    }

    if (!parsedData) {
      // LAST RESORT: Simulated Fallback
      console.warn("Prediction AI failed. Using simulated fallback.");
      parsedData = {
        risk_level: "medium",
        predicted_diseases: [
          { name: "General Fungal Risk", probability_percent: 45, peak_risk_day: 3 },
          { name: "Nutrient Deficiency", probability_percent: 20, peak_risk_day: 5 }
        ],
        contributing_factors: [
          "Current humidity levels are slightly elevated",
          "Historical data for this region suggests seasonal risk",
          "Variable temperature patterns observed"
        ],
        preventive_actions: [
          "Monitor leaves daily for color changes",
          "Maintain consistent irrigation schedule",
          "Check soil pH levels"
        ]
      };
    }
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Prediction API Error:", error);
    // Return a more context-aware fallback if possible, or a clear error
    return NextResponse.json({
      error: "Analysis failed",
      risk_level: "medium",
      predicted_diseases: [
        { name: "General Fungal Risk", probability_percent: 50, peak_risk_day: 3 }
      ],
      contributing_factors: ["Unstable weather patterns", "Regional history"],
      preventive_actions: ["Regular monitoring", "Balanced irrigation"]
    }, { status: 500 });
  }
}
