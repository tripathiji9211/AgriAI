export const langMap: Record<string, string> = {
  en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu", kn: "Kannada", 
  mr: "Marathi", pa: "Punjabi", gu: "Gujarati", bn: "Bengali", ur: "Urdu"
};

export const getLangPrompt = (langCode: string | undefined) => {
  if (!langCode || langCode === 'en') return "";
  const selectedLanguage = langMap[langCode] || "English";
  return `The user's preferred language is ${selectedLanguage} (language code: ${langCode}). All your responses, explanations, treatment names, and recommendations MUST be written in ${selectedLanguage}. If the language uses a non-Latin script (Hindi, Tamil, Telugu, Kannada, Marathi, Punjabi, Gujarati, Bengali, Urdu), write entirely in that script — do not mix with English except for scientific names (e.g. Alternaria blight). For Urdu, use Nastaliq-friendly text. `;
};
