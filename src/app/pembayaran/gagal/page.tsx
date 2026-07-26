"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function PaymentFailedPage() {
  const { totalPrice, items } = useCart();
  const [currentDate, setCurrentDate] = useState("");

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
  }, []);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const finalTotal = items.length > 0
    ? Math.max(0, totalPrice + 150000 - (totalPrice > 500000 ? 100000 : 0))
    : 4500000;

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] min-h-screen flex flex-col antialiased selection:bg-red-600 selection:text-white font-sans">
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-300 mix-blend-multiply filter blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-200 mix-blend-multiply filter blur-[100px]"></div>
        </div>

        {/* Failed Canvas */}
        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          
          {/* Icon & Header */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-600/30 animate-in zoom-in duration-500">
              <span className="material-symbols-outlined text-5xl">close</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 tracking-tight">
              Pembayaran Gagal
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">
              Maaf, transaksi B2B Anda gagal atau dibatalkan.
            </p>
          </div>

          {/* Failed Summary Glass Card */}
          <div className="bg-white/85 backdrop-blur-xl border border-red-100 shadow-lg rounded-2xl p-6 text-left mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">ID Pesanan</p>
                <p className="text-base font-bold text-gray-900">#ORD-2024-BPM-892</p>
              </div>
              <span className="material-symbols-outlined text-red-600 bg-red-50 p-2.5 rounded-full text-xl">
                error_outline
              </span>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Tanggal</span>
                <span className="text-gray-900 font-semibold">{currentDate || "24 Okt 2024, 14:30 WIB"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Status</span>
                <span className="text-red-600 font-bold">Waktu Pembayaran Habis / Dibatalkan</span>
              </div>
              <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                <span className="text-gray-500 font-medium">Total Pembayaran</span>
                <span className="text-lg font-extrabold text-gray-900">Rp {formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pembayaran"
              className="bg-red-600 text-white font-bold text-xs py-4 px-8 rounded-xl hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider group"
            >
              <span>Coba Pembayaran Lagi</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                refresh
              </span>
            </Link>
            <Link
              href="/"
              className="bg-white text-gray-700 border border-gray-200 font-bold text-xs py-4 px-8 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider"
            >
              Kembali ke Beranda
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
