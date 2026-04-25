import { NextResponse } from 'next/server';

const apiKey = process.env.OPENSOURCE_API_KEY || "";
const baseURL = process.env.OPENSOURCE_BASE_URL || "https://api.groq.com/openai/v1/chat/completions";
const modelName = process.env.OPENSOURCE_MODEL || "mistral-7b-instruct";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!apiKey) {
      // Mock response if no API key is provided
      const mockResponses = [
        "That's a great question about farming. To ensure healthy crops, I recommend rotating them every season.",
        "For organic pest control, consider using neem oil mixed with water. It's eco-friendly and highly effective.",
        "Based on the weather forecast, you should hold off on irrigation until tomorrow evening."
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({ 
        response: "[MOCK MISTRAL] " + randomResponse + "\n\n(Note: Set OPENSOURCE_API_KEY in .env.local to enable real AI)"
      });
    }

    const systemPrompt = `You are AgriAI, an expert agricultural advisor and botanist. 
    You help farmers diagnose plant diseases, suggest eco-friendly and organic treatments, 
    and provide sustainable farming advice. Be concise, practical, and farmer-friendly.
    Keep responses easy to understand.`;
    
    // Convert history to OpenAI message format
    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).filter((msg: any) => msg.text).map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: message }
    ];

    const res = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API returned ${res.status}: ${err}`);
    }

    const data = await res.json();
    return NextResponse.json({ response: data.choices[0].message.content });
    
  } catch (error: any) {
    console.error("Chatbot Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
