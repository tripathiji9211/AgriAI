import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const apiKey = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { sensor, value, crop_type, langCode } = await req.json();

    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({
        alert: `[MOCK ALERT] ${sensor} reading is critically high at ${value}. For ${crop_type}, this rapidly accelerates fungal growth like powdery mildew. Immediate action: Activate ventilation fans or apply preventive bio-fungicide immediately.`
      });
    }

    const systemPrompt = getLangPrompt(langCode) + "You are an automated agricultural IoT monitoring AI. Provide short, urgent, and actionable responses (max 2-3 sentences).";
    const userPrompt = `Sensor alert: ${sensor} reading is ${value}. What disease risks does this create for ${crop_type}? Give immediate action steps.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!res.ok) throw new Error(`Anthropic API error: ${await res.text()}`);
    const data = await res.json();
    return NextResponse.json({ alert: data.content[0].text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
