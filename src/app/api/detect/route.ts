import { NextResponse } from 'next/server';

const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || "";
const anthropicKey = process.env.ANTHROPIC_API_KEY || "";

// Helper to get simulated real-time Kaggle feed data
function getRealTimeSensorData() {
  const now = new Date();
  return {
    moisture: (32 + Math.sin(now.getTime() / 10000) * 2 + Math.random()).toFixed(1) + "%",
    temp: (27 + Math.cos(now.getTime() / 15000) * 1.5 + Math.random()).toFixed(1) + "°C",
    light: (850 + Math.sin(now.getTime() / 20000) * 50 + Math.random() * 20).toFixed(0) + " lux",
    ph: (6.5 + Math.sin(now.getTime() / 30000) * 0.1 + (Math.random() - 0.5) * 0.05).toFixed(2)
  };
}

export async function POST(req: Request) {
  try {
    const { image, langCode } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const mimeMatch = image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const base64Data = image.includes(',') ? image.split(',')[1] : image;

    const liveSensors = getRealTimeSensorData();

    const systemPrompt = `You are the core diagnostic engine for AgriAI, an advanced agricultural assistance platform. Your sole purpose is to analyze agricultural images, detect specific crop diseases, and provide actionable solutions.

    You MUST process every incoming image using a strict two-stage pipeline:

    ### STAGE 1: STRICT IMAGE VALIDATION (THE GATEKEEPER)
    Before attempting any diagnosis, verify the contents of the image.
    - **Rule:** The image MUST prominently feature a plant, crop, leaf, or agricultural field.
    - **Action:** If the image is a person, a selfie, an animal, an indoor object, a screen, or anything NOT related to botany/agriculture, you MUST set "isPlant": false and halt analysis.

    ### STAGE 2: SPECIFIC DISEASE CLASSIFICATION
    If (and only if) the image passes Stage 1, proceed:
    - Accurately identify the SPECIFIC crop species (e.g., "Tomato", "Wheat", "Apple"). DO NOT be generic.
    - Accurately identify the specific disease, pest, or nutrient deficiency (e.g., "Early Blight", "Leaf Miner", "Healthy").
    - Provide 1-2 sentences of initial advice.
    
    ### CURRENT ENVIRONMENTAL CONTEXT
    You have access to the farm's real-time IoT dataset. Keep these in mind:
    - Soil Moisture: ${liveSensors.moisture}
    - Temp: ${liveSensors.temp}
    - Light: ${liveSensors.light}
    - pH: ${liveSensors.ph}`;
    
    const userPrompt = `Analyze the provided image with high precision.
    
    Return the result strictly as a JSON object:
    {
      "isPlant": boolean (Must be false if Stage 1 validation fails),
      "disease": string (Name of disease or 'Healthy'. Set to 'Invalid' if not a plant),
      "confidence": number (0-100),
      "severity": "Low" | "Moderate" | "High" | "None",
      "plant": string (Name of the specific crop or 'None'),
      "message": string (If isPlant is true, provide 1-2 sentences of initial actionable advice. If false, clearly explain why the image was rejected.)
    }
    `;

    let parsedData = null;

    if (geminiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{
              parts: [
                { text: userPrompt },
                { inline_data: { mime_type: mimeType, data: base64Data } }
              ]
            }],
            generationConfig: { response_mime_type: "application/json" }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            try {
              parsedData = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
            } catch (err) {
              console.error("Failed to parse Gemini JSON:", content);
            }
          } else {
             console.error("Gemini returned empty content:", data);
          }
        } else {
          const errorText = await res.text();
          console.error("Gemini API Error Response:", res.status, errorText);
        }
      } catch (e) {
        console.error("Gemini call failed:", e);
      }
    }

    if (!parsedData && anthropicKey) {
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
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{
              role: 'user',
              content: [
                { type: 'text', text: userPrompt },
                {
                  type: 'image',
                  source: { type: 'base64', media_type: mimeType, data: base64Data }
                }
              ]
            }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.content[0].text;
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : content);
        }
      } catch (e) {
        console.error("Anthropic fallback failed:", e);
      }
    }

    if (!parsedData) {
      return NextResponse.json({ error: "AI services are currently unavailable or overloaded. Please try again later." }, { status: 503 });
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Detection API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
