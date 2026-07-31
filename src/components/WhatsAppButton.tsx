"use client";

import React from "react";

export default function WhatsAppButton() {
  const phoneNumber = "6285600436463"; // Official Bakso Pak Mul WhatsApp Number
  const message = encodeURIComponent(
    "Halo CS Bakso Pak Mul 👋, saya ingin bertanya mengenai produk bakso, stok, dan pemesanan."
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip Badge */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 bg-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 text-xs font-bold hover:scale-105 transition-all group"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Chat CS Pak Mul</span>
      </a>

      {/* WhatsApp Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp CS Bakso Pak Mul"
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group cursor-pointer"
      >
        <span className="material-symbols-outlined text-3xl">chat</span>
        
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
        </span>
      </a>
    </div>
  );
}
