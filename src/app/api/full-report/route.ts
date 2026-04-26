import { NextResponse } from 'next/server';
import { getLangPrompt, langMap } from '@/lib/langHelper';

const apiKey = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { crop, location, history, metrics, langCode } = await req.json();

    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        report: `# Comprehensive Farm Health Report\n\n**Crop:** ${crop}\n**Location:** ${location}\n\n## 1. Disease History & Treatment Effectiveness\nOver the past season, we tracked Early Blight (Moderate severity) and Powdery Mildew. The application of organic Neem Oil achieved an 85% success rate in halting fungal spread.\n\n## 2. Sustainability Score\nYour current Farm Health Score is 88/100, driven by a 42% reduction in synthetic pesticide usage and the deployment of 15 eco-treatments.\n\n## 3. Recommendations\nContinue focusing on soil moisture management to prevent recurring blight. Introduce cover cropping next season to restore nitrogen naturally.`
      });
    }

    const systemPrompt = getLangPrompt(langCode) + "You are a senior agricultural data analyst. Generate a structured, professional markdown report.";
    const selectedLanguage = langMap[langCode] || "English";
    const userPrompt = `Generate a comprehensive farm health report in ${selectedLanguage}. All section headings, analysis, and recommendations must be in ${selectedLanguage}. Create a comprehensive farm health report for a farmer growing ${crop} in ${location}. Include: disease history (${JSON.stringify(history)}), treatment effectiveness, sustainability score (${JSON.stringify(metrics)}), and future recommendations. Format as a structured report with headers.`;

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

    if (!res.ok) throw new Error(`Anthropic API error`);
    const data = await res.json();
    return NextResponse.json({ report: data.content[0].text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
