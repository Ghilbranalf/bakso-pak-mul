"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Halo! 👋 Selamat datang di Bakso Pak Mul. Ada yang bisa saya bantu seputar bahan bakso, mie ayam, ongkir, atau cara pemesanan?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append user message
    setMessages((prev) => [...prev, { sender: "user", text: userText, time: currentTime }]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      const botReply = data.reply || "Maaf, saat ini asisten AI sedang sibuk. Silakan hubungi WA CS kami.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Maaf, kendala jaringan. Silakan hubungi CS kami via WhatsApp.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWA = () => {
    const phoneNumber = "6281298980252";
    const waText = encodeURIComponent(
      "Halo CS Bakso Pak Mul 👋, saya ingin konsultasi pemesanan bahan bakso & mie ayam."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${waText}`, "_blank");
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[60] flex flex-col items-end">
      {/* Interactive Chatbot Modal Bubble */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200 flex flex-col h-[460px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#51000d] to-[#7a0019] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-[#51000d] flex items-center justify-center font-black text-lg border-2 border-white shadow-sm">
                  🍜
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight">AI CS Bakso Pak Mul</h3>
                <p className="text-[10px] text-amber-200 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online 24/7 • Responsif
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#51000d] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-gray-500 text-xs">
                  <span className="w-2 h-2 bg-[#51000d] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#51000d] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-[#51000d] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[10px] text-gray-400 ml-1">Mengetik...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Direct WhatsApp Callout Banner */}
          <div className="bg-emerald-50 border-t border-b border-emerald-100 px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold text-emerald-900">
            <span>Butuh bantuan admin langsung?</span>
            <button
              onClick={handleOpenWA}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Chat WA Admin</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </button>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white flex items-center gap-2 border-t border-gray-100">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pertanyaan Anda..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:border-[#51000d] focus:bg-white outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-[#51000d] hover:bg-[#7a0019] disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="flex items-center gap-2.5">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden md:flex items-center gap-2 bg-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 text-xs font-bold hover:scale-105 transition-all cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Chat CS Pak Mul</span>
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Tutup atau Buka Chatbot CS Bakso Pak Mul"
          className="w-14 h-14 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl">
            {isOpen ? "close" : "forum"}
          </span>

          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
