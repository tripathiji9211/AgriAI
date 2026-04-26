"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, CheckCheck, MoreVertical, Phone, Video, ArrowLeft, Mic, MicOff, Volume2, Loader2, Languages } from "lucide-react";
import Link from "next/link";

import { useGlobalLanguage } from "@/lib/LanguageContext";

interface Message {
  id: string;
  text: string;
  translatedText?: string;
  sender: "user" | "bot";
  timestamp: string;
}

const SUGGESTION_CHIPS = [
  "What diseases affect my crop?",
  "How to improve soil health?",
  "Organic pesticide recipe",
  "When to harvest?"
];

export default function AdvisorPage() {
  const { lang, t } = useGlobalLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  
  const SUGGESTION_CHIPS = [
    t.suggestion_diseases || "What diseases affect my crop?",
    t.suggestion_soil || "How to improve soil health?",
    t.suggestion_organic || "Organic pesticide recipe",
    t.suggestion_harvest || "When to harvest?"
  ];

  // Speech Recognition
  const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitRecognition : null;
  const recognition = useRef<any>(null);

  const inputRef = useRef(input);
  useEffect(() => { inputRef.current = input; }, [input]);

  const handleSendRef = useRef<any>(null);

  useEffect(() => {
    setMessages([{
      id: "welcome",
      text: t.bot_welcome_msg || "Hello! I'm AgriAI. How can I help you with your crops today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, [t.bot_welcome_msg]);

  const toggleListening = async () => {
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
          setIsTyping(true);
          try {
            const res = await fetch("/api/bhashini", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "asr", audioBase64: base64Audio, lang })
            });
            const { transcribedText } = await res.json();
            if (transcribedText) {
              setInput(transcribedText);
              handleSend(transcribedText);
            }
          } catch (err) {
            console.error("Bhashini ASR Error:", err);
          } finally {
            setIsTyping(false);
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

  const [isTranslating, setIsTranslating] = useState<string | null>(null);

  const handleTranslate = async (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg || msg.translatedText) return;

    setIsTranslating(msgId);
    try {
      const targetLang = lang === 'en' ? 'hi' : 'en';
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userText = textToSend;
    if (!textOverride) setInput("");
    setIsTyping(true);

    const userMsg: Message = {
      id: Date.now().toString(), text: userText, sender: "user", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userText, 
          history: currentHistory,
          langCode: lang,
          detection_history: ["Early Blight (Moderate)"] 
        })
      });
      
      const data = await res.json();
      const botResponseText = data.response || "Sorry, I couldn't process that.";
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(), text: botResponseText, sender: "bot", 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: t.err_network || "Network error. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-w-2xl mx-auto glass-panel relative shadow-2xl overflow-hidden border-x border-white/5">
      {/* Header */}
      <div className="glass-navbar text-white flex items-center p-4 z-10 shrink-0">
        <Link href="/dashboard" className="mr-2 md:hidden">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
          <Bot className="h-6 w-6 text-[#0f4c3a]" />
        </div>
        <div className="ml-3 flex-1 flex flex-col justify-center">
          <h1 className="font-semibold text-lg leading-none">{t.appName}</h1>
          <p className="text-[11px] text-white/80 mt-1">{t.bot_online_status}</p>
        </div>
        <div className="flex items-center gap-3 text-white">
          <MoreVertical className="h-5 w-5 cursor-pointer hidden sm:block" />
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-3.5 shadow-xl relative backdrop-blur-md ${
                msg.sender === "user" ? "bg-[#00E599]/20 border border-[#00E599]/30 rounded-tr-none text-white" : "bg-white/10 border border-white/10 rounded-tl-none text-white"
              }`}
            >
              <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
              {msg.translatedText && (
                <p className="mt-2 pt-2 border-t border-gray-100 italic text-gray-500 text-xs">
                  {msg.translatedText}
                </p>
              )}
              <div className="flex items-center justify-between gap-1 mt-1">
                {msg.sender === "bot" && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSpeak(msg.text, msg.id)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#0f4c3a] transition-colors"
                    >
                      {isPlaying === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => handleTranslate(msg.id)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#0f4c3a] transition-colors"
                    >
                      {isTranslating === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-[10px] text-white/40">{msg.timestamp}</span>
                  {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-blue-500" />}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl rounded-tl-none p-4 shadow-xl flex gap-1.5 items-center h-[40px] border border-white/10">
              <div className="w-2 h-2 bg-[#00E599] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#00E599] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-[#00E599] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area Wrapper */}
      <div className="bg-black/40 backdrop-blur-xl flex flex-col shrink-0 border-t border-white/5">
        
        {/* Suggestion Chips */}
        <div className="flex overflow-x-auto gap-2 p-3 whitespace-nowrap bg-transparent [&::-webkit-scrollbar]:hidden">
          {SUGGESTION_CHIPS.map((chip, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(chip)}
              className="bg-white/5 border border-white/10 text-white/80 text-xs px-4 py-2 rounded-full hover:bg-[#00E599]/20 hover:border-[#00E599]/30 hover:text-white transition-all shadow-lg shrink-0 backdrop-blur-md"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="p-2 flex items-end gap-2">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 glass-input rounded-full flex items-center px-5 py-2.5 shadow-inner min-h-[48px]">
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-sm"
                placeholder={t.placeholder_chat || "Ask AgriAI..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button 
                title={t.mic_label || "Voice Input"}
                onClick={toggleListening} 
                className={`ml-2 p-2 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-white/40 hover:text-[#00E599] hover:bg-white/5'}`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>
            {interimTranscript && (
              <div className="text-xs text-[#0f4c3a] font-medium mt-1.5 ml-4 italic animate-pulse">
                {interimTranscript}
              </div>
            )}
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="h-12 w-12 bg-[#00E599] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,229,153,0.3)] shrink-0 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <Send className="h-5 w-5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
