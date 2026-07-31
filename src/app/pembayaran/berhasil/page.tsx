"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function PaymentSuccessPage() {
  const { totalPrice, items } = useCart();
  const [currentDate, setCurrentDate] = useState("");

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const finalTotal = items.length > 0
    ? Math.max(0, totalPrice + 150000 - (totalPrice > 500000 ? 100000 : 0))
    : 4500000;

  const waMessage = encodeURIComponent(
    `Halo CS Bakso Pak Mul 👋, saya baru saja menyelesaikan pembayaran LUNAS untuk pesanan:\n\n📦 ID Pesanan: #ORD-2024-BPM-892\n💰 Total Pembayaran: Rp ${formatPrice(finalTotal)}\n\nMohon segera diproses dan dikirim ya Pak Mul, terima kasih!`
  );
  const waUrl = `https://wa.me/6281298980252?text=${waMessage}`;

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
    setCurrentDate(formatted);

    // Auto-open WhatsApp after 1.5 seconds so user gets immediate chat confirmation
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [waUrl]);

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] min-h-screen flex flex-col antialiased selection:bg-[#7a0019] selection:text-white font-sans">
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-200 mix-blend-multiply filter blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-100 mix-blend-multiply filter blur-[100px]"></div>
        </div>

        {/* Success Canvas */}
        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          
          {/* Icon & Header with Animated Badge */}
          <div className="mb-8 animate-bounce">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#51000d] to-[#7a0019] text-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-900/30 ring-8 ring-red-100 scale-110">
              <span className="material-symbols-outlined text-6xl font-black">task_alt</span>
            </div>
            <span className="text-[11px] uppercase tracking-widest font-black bg-green-100 text-green-800 px-4 py-1.5 rounded-full border border-green-200 shadow-sm">
              ✨ Transaksi Terverifikasi Lunas
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#51000d] tracking-tight mt-4">
              Pembayaran Berhasil!
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">
              Terima kasih! Pesanan Bakso Pak Mul Anda telah berhasil dikonfirmasi &amp; otomatis tercatat di sistem toko.
            </p>
          </div>

          {/* Order Summary Glass Card */}
          <div className="bg-white/85 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl p-6 text-left mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">ID Pesanan</p>
                <p className="text-base font-bold text-gray-900">#ORD-2024-BPM-892</p>
              </div>
              <span className="material-symbols-outlined text-[#7a0019] bg-red-100 p-2.5 rounded-full text-xl">
                receipt_long
              </span>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Tanggal</span>
                <span className="text-gray-900 font-semibold">{currentDate || "24 Okt 2024, 14:30 WIB"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Metode Pembayaran</span>
                <span className="text-gray-900 font-semibold">Transfer Bank - BCA</span>
              </div>
              <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                <span className="text-gray-500 font-medium">Total Pembayaran</span>
                <span className="text-lg font-extrabold text-[#51000d]">Rp {formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-extrabold text-xs py-4 px-8 rounded-xl hover:bg-[#1faa52] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider scale-105 active:scale-95 border border-emerald-400"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              <span>Kirim Bukti / Konfirmasi ke WhatsApp Pak Mul</span>
            </a>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/transaksi"
                className="bg-[#7a0019] text-white font-bold text-xs py-3.5 px-6 rounded-xl hover:bg-[#51000d] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider group"
              >
                <span>Lihat Status Pengiriman</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/"
                className="bg-white text-[#7a0019] border border-gray-200 font-bold text-xs py-3.5 px-6 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
