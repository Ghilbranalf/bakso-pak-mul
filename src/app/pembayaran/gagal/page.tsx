"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function FailedContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("order_id") || searchParams.get("id") || "";
  
  const { totalPrice, items } = useCart();
  const [currentDate, setCurrentDate] = useState("");
  const [realOrder, setRealOrder] = useState<any | null>(null);

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

    if (orderIdFromUrl) {
      fetch(`/api/orders/${encodeURIComponent(orderIdFromUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) {
            setRealOrder(data.order);
          }
        })
        .catch((e) => console.error("Error fetching order in failed page:", e));
    }
  }, [orderIdFromUrl]);

  const formatPrice = (price: number) => {
    return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const displayOrderNumber = realOrder?.orderNumber || orderIdFromUrl || "#BPM-892910";
  const displayTotal = realOrder?.finalTotal || (items.length > 0 ? totalPrice + 15000 : 75000);

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
          
          {/* Icon & Header with Animated Warning Badge */}
          <div className="mb-8 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 to-[#51000d] text-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-600/30 ring-8 ring-red-100 scale-110">
              <span className="material-symbols-outlined text-6xl font-black">gpp_maybe</span>
            </div>
            <span className="text-[11px] uppercase tracking-widest font-black bg-red-100 text-red-800 px-4 py-1.5 rounded-full border border-red-200 shadow-sm">
              ⚠️ Pembayaran Dibatalkan / Kadaluwarsa
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#51000d] tracking-tight mt-4">
              Pembayaran Belum Berhasil
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">
              Maaf, transaksi Anda belum dapat diselesaikan. Jangan khawatir, Anda dapat mencoba kembali metode pembayaran lainnya.
            </p>
          </div>

          {/* Failed Summary Glass Card */}
          <div className="bg-white/85 backdrop-blur-xl border border-red-100 shadow-lg rounded-2xl p-6 text-left mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">ID Pesanan</p>
                <p className="text-base font-black text-gray-900">{displayOrderNumber}</p>
              </div>
              <span className="material-symbols-outlined text-red-600 bg-red-50 p-2.5 rounded-full text-xl">
                error_outline
              </span>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Tanggal</span>
                <span className="text-gray-900 font-semibold">{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Status Transaksi</span>
                <span className="text-red-600 font-bold">Waktu Habis / Pembayaran Gagal</span>
              </div>
              <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                <span className="text-gray-500 font-medium">Total Tagihan</span>
                <span className="text-lg font-extrabold text-gray-900">Rp {formatPrice(displayTotal)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/transaksi/${displayOrderNumber}`}
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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Memuat rincian transaksi...</div>}>
      <FailedContent />
    </Suspense>
  );
}
