import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || "";
const anthropicKey = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { disease_name, severity, plant, langCode } = await req.json();

    if (!disease_name || !severity) {
      return NextResponse.json({ error: 'Disease name and severity are required' }, { status: 400 });
    }

    // Prepare the system prompt
    const systemPrompt = getLangPrompt(langCode) + " You are an expert agricultural botanist. Respond strictly with valid JSON. Do not include markdown formatting or extra text.";
    
    const userPrompt = `A ${plant || 'plant'} has been diagnosed with: ${disease_name} (Severity: ${severity}). 
    Provide comprehensive, eco-friendly treatment recommendations.
    
    If the plant is "Healthy", provide maintenance tips for keeping it that way.
    
    Return JSON exactly matching this structure:
    {
      "organic": [ 
        { "name": "string", "ecoScore": number (1-10), "method": "string", "frequency": "string", "cost": "string" } 
      ],
      "chemical": [ 
        { "name": "string", "impactWarning": "string", "dosage": "string", "safety": "string" } 
      ],
      "preventive": [ "string" ]
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
        console.error("Gemini treatment call failed:", e);
      }
    }

    if (!parsedData && anthropicKey) {
      // Fallback to Anthropic if Gemini failed but Anthropic is available
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
        console.error("Anthropic treatment fallback failed:", e);
      }
    }

    if (!parsedData) {
      // LAST RESORT: Simulated Fallback
      console.warn("Treatment AI failed. Using simulated fallback.");
      parsedData = {
        organic: [
          { name: "Neem Oil Spray", ecoScore: 10, method: "Spray on leaves", frequency: "Every 7 days", cost: "Low" },
          { name: "Garlic-Chili Extract", ecoScore: 9, method: "Foliar application", frequency: "Weekly", cost: "Minimal" }
        ],
        chemical: [
          { name: "Copper Fungicide", impactWarning: "Use sparingly", dosage: "2g per liter", safety: "Wear gloves" }
        ],
        preventive: [
          "Ensure proper plant spacing for airflow",
          "Avoid overhead watering to keep leaves dry",
          "Remove and destroy infected plant debris"
        ]
      };
    }
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Treatment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
