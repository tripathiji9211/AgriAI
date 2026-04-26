import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const apiKey = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: Request) {
  try {
    const inputs = await req.json();
    const { langCode } = inputs;

    if (!inputs.cropType || !inputs.location) {
      return NextResponse.json({ error: 'Missing required inputs' }, { status: 400 });
    }

    if (!apiKey) {
      // Mock Response Fallback if no Anthropic key is provided
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        risk_level: "high",
        predicted_diseases: [
          { name: "Late Blight", probability_percent: 85, peak_risk_day: 4 },
          { name: "Powdery Mildew", probability_percent: 40, peak_risk_day: 2 }
        ],
        contributing_factors: [
          "High continuous humidity (>85%) over the last 48 hours",
          "Optimal temperature range for fungal spore germination (65-75°F)",
          "History of late blight in the region during this season"
        ],
        preventive_actions: [
          "Apply a protective fungicide immediately before rain events",
          "Ensure maximal airflow by pruning lower canopy",
          "Monitor daily for early symptoms (water-soaked spots)"
        ]
      });
    }

    const systemPrompt = getLangPrompt(langCode) + "You are an expert agricultural risk analyst. Respond strictly with valid JSON. Do not include markdown formatting or extra text.";
    const userPrompt = `Given these crop conditions: ${JSON.stringify(inputs)}, predict disease risks for the next 7 days. Return JSON exactly matching this structure:
    { 
      "risk_level": "low" | "medium" | "high", 
      "predicted_diseases": [{"name": "string", "probability_percent": number, "peak_risk_day": number (1-7)}], 
      "contributing_factors": ["string"], 
      "preventive_actions": ["string"] 
    }`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
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

    if (!res.ok) {
      throw new Error(`Anthropic API error: ${await res.text()}`);
    }

    const data = await res.json();
    const content = data.content[0].text;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Prediction API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
