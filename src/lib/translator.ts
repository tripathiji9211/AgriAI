const GROQ_API_KEY = process.env.OPENSOURCE_API_KEY;

export async function translateText(text: string, targetLang: string) {
  if (!GROQ_API_KEY) {
    console.warn("No translation API key found. Falling back to original text.");
    return text;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text to ${targetLang}. 
            Only provide the translation itself, no explanations or extra text. 
            Maintain the tone and formatting of the original text.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Translation Error (Groq):", error);
    return text;
  }
}
