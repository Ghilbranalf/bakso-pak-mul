"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide customer WhatsApp CS chatbot on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Halo! Selamat datang di Bakso Pak Mul. Ada yang bisa kami bantu seputar stok bahan bakso, mie ayam, atau pemesanan?",
      time: "12:00",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set accurate local client time after hydration
    setMessages([
      {
        sender: "bot",
        text: "Halo! Selamat datang di Bakso Pak Mul Kramat Jati. Ada yang bisa kami bantu seputar stok bahan bakso, mie ayam, atau pemesanan?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

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
      "Halo CS Bakso Pak Mul, saya ingin konsultasi pemesanan bahan bakso & mie ayam."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${waText}`, "_blank");
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[60] flex flex-col items-end">
      {/* Interactive Chatbot Modal Bubble */}
      {isOpen && (
        <div className="w-[330px] sm:w-[360px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200 flex flex-col h-[440px]">
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                CS
              </div>
              <div>
                <h3 className="text-xs font-bold">Layanan Pelanggan</h3>
                <p className="text-[10px] text-slate-400">Bakso Pak Mul Kramat Jati</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-red-600 text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-500 text-xs shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Direct WhatsApp Callout Banner */}
          <div className="bg-emerald-50 border-t border-b border-emerald-100 px-3 py-2 flex items-center justify-between text-[11px] text-emerald-900 font-medium">
            <span>Bicara dengan admin via WhatsApp?</span>
            <button
              onClick={handleOpenWA}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Chat WA</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </button>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-white flex items-center gap-2 border-t border-slate-100">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan Anda..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-100 border border-transparent focus:border-slate-300 focus:bg-white text-xs outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden md:flex items-center gap-2 bg-white text-slate-800 px-3.5 py-2 rounded-full shadow-md border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Bantuan CS</span>
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Tutup atau Buka Chatbot CS Bakso Pak Mul"
          className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer relative"
        >
          <span className="material-symbols-outlined text-2xl">
            {isOpen ? "close" : "chat"}
          </span>

          {!isOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </div>
    </div>
  );
}
