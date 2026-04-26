import { NextResponse } from 'next/server';
import { bhashiniTTS, bhashiniASR } from '@/lib/bhashini';
import { translateText } from '@/lib/translator';

export async function POST(req: Request) {
  try {
    const { action, text, sourceLang, targetLang, lang, gender, audioBase64 } = await req.json();

    if (action === "translate") {
      const translatedText = await translateText(text, targetLang);
      return NextResponse.json({ translatedText });
    }

    if (action === "tts") {
      const audioData = await bhashiniTTS(text, lang, gender);
      return NextResponse.json({ audioData });
    }

    if (action === "asr") {
      const transcribedText = await bhashiniASR(audioBase64, lang);
      return NextResponse.json({ transcribedText });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Bhashini API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
