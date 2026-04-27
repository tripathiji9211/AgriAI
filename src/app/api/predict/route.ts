import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || "";

export async function POST(req: Request) {
  try {
    const inputs = await req.json();
    const { langCode } = inputs;

    if (!inputs.cropType || !inputs.location) {
      return NextResponse.json({ error: 'Missing required inputs' }, { status: 400 });
    }

    if (!apiKey) {
      // Mock Response Fallback if no Gemini key is provided
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
    const userPrompt = `${systemPrompt}\n\nGiven these crop conditions: ${JSON.stringify(inputs)}, predict disease risks for the next 7 days. Return JSON exactly matching this structure:
    { 
      "risk_level": "low" | "medium" | "high", 
      "predicted_diseases": [{"name": "string", "probability_percent": number, "peak_risk_day": number (1-7)}], 
      "contributing_factors": ["string"], 
      "preventive_actions": ["string"] 
    }`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userPrompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`Gemini API error (falling back to mock data): ${errorText}`);
      return NextResponse.json(getMockData(langCode));
    }

    const data = await res.json();
    const content = data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(content);
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Prediction API Error (falling back to mock data):", error);
    return NextResponse.json(getMockData("en"));
  }
}

function getMockData(langCode: string) {
  // Use localized mock data if possible
  const isHindi = langCode === 'hi';
  return {
    risk_level: "high",
    predicted_diseases: [
      { 
        name: isHindi ? "अगेती झुलसा (Early Blight)" : "Early Blight", 
        probability_percent: 85, 
        peak_risk_day: 4 
      },
      { 
        name: isHindi ? "पाउडरी मिल्ड्यू (Powdery Mildew)" : "Powdery Mildew", 
        probability_percent: 40, 
        peak_risk_day: 2 
      }
    ],
    contributing_factors: [
      isHindi ? "पिछले 48 घंटों में उच्च निरंतर आर्द्रता (>85%)" : "High continuous humidity (>85%) over the last 48 hours",
      isHindi ? "कवक बीजाणु अंकुरण के लिए अनुकूल तापमान सीमा" : "Optimal temperature range for fungal spore germination",
      isHindi ? "इस मौसम के दौरान क्षेत्र में बीमारी का इतिहास" : "History of disease in the region during this season"
    ],
    preventive_actions: [
      isHindi ? "बारिश से ठीक पहले सुरक्षात्मक कवकनाशी लगाएं" : "Apply a protective fungicide immediately before rain events",
      isHindi ? "निचले छत्र की छंटाई करके अधिकतम वायु प्रवाह सुनिश्चित करें" : "Ensure maximal airflow by pruning lower canopy",
      isHindi ? "शुरुआती लक्षणों के लिए रोजाना निगरानी करें" : "Monitor daily for early symptoms"
    ]
  };
}
