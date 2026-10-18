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
    <div className="bg-[#faf8f5] text-[#1c1917] min-h-screen flex flex-col antialiased selection:bg-[#7a0019] selection:text-white font-sans">
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative">
        {/* Failed Canvas */}
        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          
          {/* Icon & Header */}
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#7a0019] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <span className="material-symbols-outlined text-3xl">error_outline</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800 block mb-2">
              Transaksi Belum Selesai
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-bold uppercase text-[#1c1917] tracking-tight">
              Pembayaran Belum Berhasil
            </h1>
            <p className="font-editorial text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
              Maaf, transaksi Anda belum dapat diselesaikan. Jangan khawatir, Anda dapat mencoba kembali metode pembayaran lainnya.
            </p>
          </div>

          {/* Failed Summary Card */}
          <div className="bg-white border border-stone-200 shadow-xs rounded-2xl p-6 text-left mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-4">
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">ID Pesanan</p>
                <p className="text-base font-bold text-stone-900 font-headline">{displayOrderNumber}</p>
              </div>
              <span className="material-symbols-outlined text-stone-600 bg-stone-100 p-2.5 rounded-xl text-xl">
                receipt_long
              </span>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Tanggal</span>
                <span className="text-stone-900 font-medium">{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Status Transaksi</span>
                <span className="text-red-700 font-semibold">Waktu Habis / Pembayaran Gagal</span>
              </div>
              <div className="flex justify-between pt-3 mt-3 border-t border-stone-100">
                <span className="text-stone-500 font-medium">Total Tagihan</span>
                <span className="font-headline text-lg font-bold text-stone-900">Rp {formatPrice(displayTotal)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/transaksi/${displayOrderNumber}`}
              className="bg-[#7a0019] text-white font-bold text-xs py-3.5 px-6 rounded-xl hover:bg-[#51000d] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>Coba Pembayaran Lagi</span>
              <span className="material-symbols-outlined text-base">refresh</span>
            </Link>
            <Link
              href="/"
              className="bg-white text-stone-700 border border-stone-200 font-bold text-xs py-3.5 px-6 rounded-xl hover:bg-stone-50 transition-colors shadow-xs flex items-center justify-center cursor-pointer uppercase tracking-wider"
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
