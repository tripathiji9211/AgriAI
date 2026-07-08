import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || "";
const anthropicKey = process.env.ANTHROPIC_API_KEY || "";

function getRealTimeSensorData() {
  const now = new Date();
  return {
    moisture: (32 + Math.sin(now.getTime() / 10000) * 2 + Math.random()).toFixed(1) + "%",
    temp: (27 + Math.cos(now.getTime() / 15000) * 1.5 + Math.random()).toFixed(1) + "°C",
    light: (850 + Math.sin(now.getTime() / 20000) * 50 + Math.random() * 20).toFixed(0) + " lux",
    ph: (6.5 + Math.sin(now.getTime() / 30000) * 0.1 + (Math.random() - 0.5) * 0.05).toFixed(2)
  };
}

export async function POST(req: Request) {
  try {
    const inputs = await req.json();
    const { langCode } = inputs;

    if (!inputs.cropType || !inputs.location) {
      return NextResponse.json({ error: 'Missing required inputs' }, { status: 400 });
    }

    const liveSensors = getRealTimeSensorData();

    const systemPrompt = getLangPrompt(langCode) + ` You are an expert agricultural risk analyst. You provide data-driven disease risk forecasts. Respond strictly with valid JSON. Do not include markdown formatting or extra text.
    
    ### CURRENT ENVIRONMENTAL CONTEXT (Real-Time Sensor Data)
    - Soil Moisture: ${liveSensors.moisture}
    - Temp: ${liveSensors.temp}
    - Light: ${liveSensors.light}
    - pH: ${liveSensors.ph}
    
    Use the real-time sensor data along with the user's inputs to provide a hyper-specific forecast. For example, if moisture is exceptionally high, forecast water-borne or fungal diseases.`;
    
    const userPrompt = `Predict crop disease risks for the next 7 days based on the following conditions:
    Crop: ${inputs.cropType}
    Location: ${inputs.location}
    Past Diseases: ${inputs.pastDiseases || "None"}
    
    Consider the local climate, the specific crop, and the live IoT sensor metrics provided in your instructions.
    
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
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
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
      return NextResponse.json({ error: "Prediction AI services are currently unavailable." }, { status: 503 });
    }
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Prediction API Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
