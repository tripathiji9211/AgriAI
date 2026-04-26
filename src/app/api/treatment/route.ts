import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const apiKey = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { disease_name, severity, langCode } = await req.json();

    if (!disease_name || !severity) {
      return NextResponse.json({ error: 'Disease name and severity are required' }, { status: 400 });
    }

    if (!apiKey) {
      // Mock Response Fallback if no Anthropic key is provided
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        organic: [
          { name: "Neem Oil Extract", ecoScore: 9, method: "Foliar spray mixed with mild soap", frequency: "Weekly", cost: "$5/acre" },
          { name: "Bacillus subtilis", ecoScore: 10, method: "Soil drench or foliar spray", frequency: "Bi-weekly", cost: "$12/acre" },
          { name: "Copper Fungicide", ecoScore: 6, method: "Spray on affected areas", frequency: "Every 7-10 days", cost: "$8/acre" }
        ],
        chemical: [
          { name: "Chlorothalonil", impactWarning: "High aquatic toxicity. Do not apply near water sources.", dosage: "2 pints per acre", safety: "Wear full protective gear. 12-hour re-entry interval." },
          { name: "Mancozeb", impactWarning: "Toxic to fish and invertebrates.", dosage: "1.5 lbs per acre", safety: "Avoid inhalation. 24-hour re-entry interval." }
        ],
        preventive: [
          "Implement crop rotation with non-host families every 3 years.",
          "Increase plant spacing to improve air circulation.",
          "Use drip irrigation instead of overhead watering to keep foliage dry.",
          "Remove and destroy infected crop debris post-harvest."
        ]
      });
    }

    const systemPrompt = getLangPrompt(langCode) + "You are an expert agricultural botanist. Respond strictly with valid JSON. Do not include markdown formatting or extra text.";
    const userPrompt = `Given ${disease_name} detected at ${severity} severity, provide eco-friendly treatment recommendations prioritizing biological/organic solutions. Respond in JSON format with this exact structure:
    {
      "organic": [ { "name": "", "ecoScore": number (1-10), "method": "", "frequency": "", "cost": "" } ],
      "chemical": [ { "name": "", "impactWarning": "", "dosage": "", "safety": "" } ],
      "preventive": [ "string" ]
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
    
    // Parse JSON safely in case Claude adds markdown
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Treatment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
