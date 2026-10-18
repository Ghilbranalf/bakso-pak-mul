"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("order_id") || searchParams.get("id") || "";
  
  const { totalPrice, items } = useCart();
  const [customerName, setCustomerName] = useState("");
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

    try {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("user");
        const savedAddr = localStorage.getItem("user_saved_address");
        if (savedUser) {
          const u = JSON.parse(savedUser);
          setCustomerName(u.name || u.full_name || u.email || "");
        } else if (savedAddr) {
          const a = JSON.parse(savedAddr);
          setCustomerName(a.fullName || a.name || "");
        }
      }
    } catch (e) {}

    if (orderIdFromUrl) {
      fetch(`/api/orders/${encodeURIComponent(orderIdFromUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) {
            setRealOrder(data.order);
          }
        })
        .catch((e) => console.error("Error fetching order in success page:", e));
    }
  }, [orderIdFromUrl]);

  const formatPrice = (price: number) => {
    return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const displayOrderNumber = realOrder?.orderNumber || orderIdFromUrl || "#BPM-892910";
  const displayTotal = realOrder?.finalTotal || (items.length > 0 ? totalPrice + 15000 : 75000);
  const displayName = realOrder?.customerName || customerName || "Pelanggan Bakso Pak Mul";

  const itemsFormatted = realOrder?.items?.length > 0
    ? realOrder.items.map((it: any) => `• ${it.product?.name || "Produk"} (${it.quantity} ${it.product?.unit || "bks"})`).join("\n")
    : (items.length > 0 ? items.map((it) => `• ${it.name} (${it.quantity} ${it.unit || "bks"})`).join("\n") : "• Paket Bakso Super Premium (1 bks)");

  const waMessage = encodeURIComponent(
    `Halo CS Bakso Pak Mul, saya baru saja menyelesaikan pembayaran LUNAS:\n\nAtas Nama: ${displayName}\nID Pesanan: ${displayOrderNumber}\n\nRincian Produk Pesanan:\n${itemsFormatted}\n\nTotal Pembayaran: Rp ${formatPrice(displayTotal)}\n\nMohon segera diproses dan dikirim ya Pak Mul, terima kasih!`
  );
  const waUrl = `https://wa.me/6281298980252?text=${waMessage}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && waUrl) {
        window.open(waUrl, "_blank");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [waUrl]);

  return (
    <div className="bg-[#faf8f5] text-[#1c1917] min-h-[100dvh] flex flex-col antialiased selection:bg-[#7a0019] selection:text-white font-sans">
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative">
        {/* Success Canvas */}
        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          
          {/* Icon & Header */}
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </div>
            <span className="text-xs font-semibold text-emerald-800 block mb-2">
              Transaksi Terverifikasi Lunas
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-bold uppercase text-[#1c1917] tracking-tight">
              Pembayaran Berhasil
            </h1>
            <p className="font-editorial text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
              Terima kasih! Pesanan Bakso Pak Mul Anda telah berhasil dikonfirmasi dan otomatis tercatat di sistem kami.
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 text-left mb-8">
            <div className="flex justify-between items-center pb-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-stone-500 mb-0.5">ID Pesanan</p>
                <p className="text-base font-bold text-stone-900 font-headline">{displayOrderNumber}</p>
              </div>
              <span className="material-symbols-outlined text-[#7a0019] bg-stone-100 p-2.5 rounded-xl text-xl">
                receipt_long
              </span>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Pemesan</span>
                <span className="text-stone-900 font-semibold">{displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Tanggal Transaksi</span>
                <span className="text-stone-900 font-medium">{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Metode Pembayaran</span>
                <span className="text-emerald-700 font-semibold">Midtrans Online / COD</span>
              </div>
              <div className="flex justify-between pt-3 mt-3 bg-stone-50 p-3 rounded-lg">
                <span className="text-stone-500 font-medium">Total Pembayaran</span>
                <span className="font-headline text-lg font-bold text-[#7a0019]">Rp {formatPrice(displayTotal)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-700 text-white font-semibold text-sm py-3.5 px-6 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Kirim Rincian ke WhatsApp Pak Mul</span>
              <span className="material-symbols-outlined text-base">chat</span>
            </a>
            
            <Link
              href={`/transaksi/${displayOrderNumber}`}
              className="bg-[#7a0019] text-white font-semibold text-sm py-3.5 px-6 rounded-xl hover:bg-[#51000d] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lihat Detail Nota Pesanan</span>
            </Link>

            <Link
              href="/"
              className="bg-white text-stone-700 border border-stone-200 font-semibold text-sm py-3.5 px-6 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center cursor-pointer"
            >
              Kembali ke Beranda
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center text-gray-500">Memuat rincian transaksi...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
