import { NextResponse } from 'next/server';
import { getLangPrompt } from '@/lib/langHelper';

const apiKey = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: Request) {
  try {
    const inputs = await req.json();
    const langCode = inputs.langCode;
    const metrics = inputs;

    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        report: `Excellent progress this month! You've successfully reduced pesticide usage by ${metrics.pesticideReduction}% and deployed ${metrics.ecoTreatments} eco-friendly treatments. This proactive approach has prevented approximately ${metrics.co2Saved}kg of CO2 emissions from chemical manufacturing and transport. Your Farm Health Score is standing strong at ${metrics.healthScore}/100.\n\nTo improve further, consider rotating your crops next season to naturally break pest cycles and focusing on building soil organic matter to reach a perfect 100 Health Score.`
      });
    }

    const systemPrompt = getLangPrompt(langCode) + "You are an agricultural sustainability expert.";
    const userPrompt = `Summarize this farmer's sustainability performance based on these metrics: ${JSON.stringify(metrics)}. Provide a short, encouraging 2-paragraph text summary and suggest one major improvement.`;

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
    return NextResponse.json({ report: data.content[0].text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
