import { NextResponse } from 'next/server';
import { getLangPrompt, langMap } from '@/lib/langHelper';

const groqKey = process.env.OPENSOURCE_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { message, history, detection_history, langCode } = await req.json();

    if (!groqKey) {
      // Mock Response Fallback if no Groq key is provided (Common in Vercel preview/initial setup)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const lowerMsg = message.toLowerCase();
      let response = "I'm currently in basic mode because the API key is not configured. However, I can still provide general agricultural advice.";
      
      if (lowerMsg.includes("disease") || lowerMsg.includes("blight")) {
        response = "For diseases like blight, ensure good air circulation and avoid overhead watering. Use organic copper-based sprays if needed.";
      } else if (lowerMsg.includes("soil") || lowerMsg.includes("fertilizer")) {
        response = "To improve soil health, consider crop rotation and adding organic compost or neem cake. Testing your soil's pH is also recommended.";
      } else if (lowerMsg.includes("harvest")) {
        response = "Harvest timing depends on the crop. For grains, wait until moisture levels are around 15-20% and the color is golden yellow.";
      }
      
      return NextResponse.json({ response });
    }

    const detections = detection_history ? detection_history.join(", ") : "None recently";
    const selectedLangName = langMap[langCode] || "English";
    
    const knowledgeBase = `
    AgriAI Expert Knowledge (Indian Agriculture):
    - Kharif Crops (Sown June-July): Rice, Maize, Cotton, Soybean, Groundnut.
    - Rabi Crops (Sown Oct-Nov): Wheat, Mustard, Gram (Chana), Barley.
    - Zaid Crops (Summer): Watermelon, Muskmelon, Cucumber.
    - Harvesting Indicators: Rice (Golden yellow color, 20% moisture), Wheat (Grains hard and dry, straw yellow).
    - Soil Health: Focus on Bio-fertilizers, Neem Cake, and Crop Rotation.
    `;

    const systemPrompt = getLangPrompt(langCode) + `You are AgriAI, a specialized AI advisor for Indian farmers. 
    You use the Mistral 7B Instruct model for high-precision responses.
    
    Your knowledge base:
    ${knowledgeBase}
    
    Guidelines:
    1. Respond primarily in ${selectedLangName}.
    2. Be concise and practical.
    3. Suggest eco-friendly and organic solutions (like Neem oil, Cow urine based pesticides) as the first priority.
    4. You know about the farmer's recent detections: [${detections}]. Use this context if relevant.
    5. Speak as a trusted companion, not a cold machine.
    `;

    // Map history to Groq format
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...history.filter((m: any) => m.id !== "welcome").map((msg: any) => ({
        role: msg.sender === "bot" ? "assistant" : "user",
        content: msg.text
      }))
    ];

    // Ensure the last message is the current user message if not already in history
    if (groqMessages[groqMessages.length - 1].role !== "user") {
      groqMessages.push({ role: "user", content: message });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Groq API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await res.json();
    return NextResponse.json({ response: data.choices[0].message.content });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
