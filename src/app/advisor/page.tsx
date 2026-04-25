"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, CheckCheck, MoreVertical, Phone, Video, ArrowLeft, Mic } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm AgriAI. How can I help you with your crops today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newUserMsg.text, history: messages })
      });
      
      const data = await res.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Sorry, I couldn't process that.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Network error. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-w-2xl mx-auto bg-[#efeae2] relative shadow-lg">
      {/* WhatsApp Style Header */}
      <div className="bg-[#075e54] text-white flex items-center p-3 shadow-md z-10 sticky top-0">
        <Link href="/dashboard" className="mr-2 md:hidden">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
          <Bot className="h-6 w-6 text-[#075e54]" />
        </div>
        <div className="ml-3 flex-1">
          <h1 className="font-semibold text-lg leading-tight">AgriAI Advisor</h1>
          <p className="text-xs text-white/80">Online • Mistral Powered</p>
        </div>
        <div className="flex items-center gap-4 text-white">
          <Video className="h-5 w-5 cursor-pointer" />
          <Phone className="h-5 w-5 cursor-pointer" />
          <MoreVertical className="h-5 w-5 cursor-pointer" />
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://i.ibb.co/3mTbX6z/whatsapp-bg.png')] bg-cover"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[80%] rounded-lg p-2.5 shadow-sm relative ${
                msg.sender === "user" ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"
              }`}
            >
              <p className="text-sm text-gray-800 break-words pr-8">{msg.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-blue-500" />}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f0f0] p-2 flex items-end gap-2 shrink-0">
        <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 shadow-sm min-h-[44px]">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder="Ask about crops, fertilizers..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Mic className="h-5 w-5 text-gray-500 cursor-pointer hover:text-[#075e54] transition-colors ml-2" />
        </div>
        <button 
          onClick={handleSend}
          className="h-11 w-11 bg-[#128c7e] rounded-full flex items-center justify-center text-white shadow-sm shrink-0 hover:bg-[#075e54] transition-colors"
        >
          <Send className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}
