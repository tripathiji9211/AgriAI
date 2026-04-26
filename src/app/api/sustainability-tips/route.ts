import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const apiKey = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { langCode } = await req.json().catch(() => ({}));

    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json([
        { tip: "Integrate nitrogen-fixing cover crops like clover between primary planting seasons.", score: 9 },
        { tip: "Implement localized drip irrigation to reduce water runoff and fungal disease risk.", score: 8 },
        { tip: "Create a 5ft native wildflower buffer zone around the field perimeter to attract predatory insects.", score: 10 },
        { tip: "Transition 20% of your synthetic fertilizer usage to high-quality compost or vermicompost.", score: 9 },
        { tip: "Leave crop residues on the field post-harvest to improve soil organic carbon levels.", score: 8 }
      ]);
    }

    const systemPrompt = getLangPrompt(langCode) + "You are an agricultural sustainability expert. Return valid JSON only. Do not include markdown formatting or extra text.";
    const userPrompt = `Give 5 actionable sustainability tips for a farmer who has been using AgriAI for eco-friendly disease management. Keep tips specific and measurable. Return JSON exactly matching this structure:
    [
      { "tip": "string describing the action", "score": number (1-10) }
    ]`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!res.ok) throw new Error(`Anthropic API error: ${await res.text()}`);
    const data = await res.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    return NextResponse.json(JSON.parse(jsonMatch ? jsonMatch[0] : content));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
