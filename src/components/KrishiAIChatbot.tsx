"use client";

import { useState, useRef } from "react";
import { X, Send, Sprout, Mic, Volume2, Loader2, Languages } from "lucide-react";
import { useGlobalLanguage } from "@/lib/LanguageContext";

interface Message {
  id: string;
  text: string;
  translatedText?: string;
  sender: "user" | "bot";
  timestamp: string;
}

// Language code mapping for Web Speech API
const langCodeMap: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
  kn: 'kn-IN', mr: 'mr-IN', pa: 'pa-IN', gu: 'gu-IN',
  bn: 'bn-IN', ml: 'ml-IN'
};

export default function KrishiAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { lang, t } = useGlobalLanguage();

  const startVoiceInput = async () => {
    if (isListening) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setIsListening(false);
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          try {
            const res = await fetch("/api/bhashini", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "asr", audioBase64: base64Audio, lang })
            });
            const { transcribedText } = await res.json();
            if (transcribedText) {
              setInputValue(transcribedText);
            }
          } catch (err) {
            console.error("Bhashini ASR Error:", err);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access for voice input.");
    }
  };

  const handleSpeak = async (text: string, msgId: string) => {
    if (isPlaying === msgId) {
      const existingAudio = document.getElementById(`audio-${msgId}`) as HTMLAudioElement;
      if (existingAudio) {
        existingAudio.pause();
        setIsPlaying(null);
        return;
      }
    }

    setIsPlaying(msgId);
    try {
      const res = await fetch("/api/bhashini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tts", text, lang })
      });
      const { audioData, error } = await res.json();
      if (error) throw new Error(error);

      const audio = new Audio(audioData);
      audio.id = `audio-${msgId}`;
      audio.onended = () => setIsPlaying(null);
      audio.play();
    } catch (err) {
      console.error(err);
      setIsPlaying(null);
    }
  };

  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: t.bot_welcome_msg || "Hello! I'm AgriAI. How can I help you with your crops today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleTranslate = async (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg || msg.translatedText) return;

    setIsTranslating(msgId);
    try {
      const targetLang = lang === 'en' ? 'hi' : 'en'; // Simple logic: toggle between English and Hindi, or handle specifically
      const res = await fetch("/api/bhashini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "translate", 
          text: msg.text, 
          sourceLang: lang, 
          targetLang: targetLang 
        })
      });
      const { translatedText, error } = await res.json();
      if (error) throw new Error(error);

      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translatedText } : m));
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(null);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    setInputValue("");
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages, langCode: lang })
      });
      const data = await res.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }
  };

  const quickActions = [
    t.suggestion_diseases,
    t.suggestion_soil,
    t.suggestion_organic,
    t.suggestion_harvest
  ];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-[#0f4c3a] p-4 flex items-center justify-between text-white shadow-sm z-10">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg shadow-inner">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-wide">Farming Advisor</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-green-100 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4 flex-1 bg-gray-50/80 flex flex-col gap-5 max-h-[380px] overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-[#0f4c3a] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sprout className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`bg-white p-3.5 rounded-2xl ${msg.sender === 'bot' ? 'rounded-tl-sm' : 'rounded-tr-sm bg-green-50'} shadow-sm border border-gray-100 text-gray-700 text-sm leading-relaxed group relative flex-1`}>
                  <p>{msg.text}</p>
                  {msg.translatedText && (
                    <p className="mt-2 pt-2 border-t border-gray-100 italic text-gray-500 text-xs">
                      {msg.translatedText}
                    </p>
                  )}
                  
                  <div className="absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleSpeak(msg.text, msg.id)}
                      className="p-1.5 bg-white border border-gray-100 rounded-full shadow-sm text-gray-400 hover:text-[#0f4c3a] transition-colors"
                    >
                      {isPlaying === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => handleTranslate(msg.id)}
                      className="p-1.5 bg-white border border-gray-100 rounded-full shadow-sm text-gray-400 hover:text-[#0f4c3a] transition-colors"
                    >
                      {isTranslating === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pl-11">
              {quickActions.map((action, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(action)}
                  className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shadow-sm"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <button 
              onClick={startVoiceInput}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm border ${isListening ? 'bg-red-100 border-red-200 text-red-600 animate-pulse' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-green-600 hover:border-green-200 hover:bg-green-50'}`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              placeholder={isListening ? t.listening : t.placeholder_chat} 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c3a] focus:border-transparent transition-all"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="bg-[#0f4c3a] hover:bg-[#0a3629] w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 bg-white border-[3px] border-[#0f4c3a] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(15,76,58,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${isOpen ? 'scale-0 opacity-0 pointer-events-none absolute' : 'scale-100 opacity-100'}`}
      >
        <div className="w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/3d-farmer.png" alt="Farming Advisor Avatar" className="object-cover w-full h-full scale-110 mt-1" />
        </div>
      </button>
    </div>
  );
}
