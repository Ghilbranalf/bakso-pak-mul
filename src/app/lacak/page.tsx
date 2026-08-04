"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("id") || "";
  
  const [searchId, setSearchId] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);

  const fetchTracking = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(queryToSearch.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Pesanan tidak ditemukan");
        setOrderData(null);
      } else {
        setOrderData(data.order);
      }
    } catch (e) {
      setErrorMsg("Terjadi kesalahan jaringan. Coba beberapa saat lagi.");
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  // Live Auto Polling (Setiap 5 detik otomatis update data jika pengguna sedang membuka lacak pesanan)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (orderData && orderData.id) {
      interval = setInterval(() => {
        fetchTracking(orderData.id || searchId);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderData, searchId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(searchId);
  };

  const formatPrice = (price: number) => {
    return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Determine active step (1-4)
  const getStepState = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "COMPLETED" || s === "DELIVERED" || s === "SELESAI") return 4;
    if (s === "PROCESSING" || s === "SHIPPED" || s === "DIPROSES") return 3;
    if (s === "PAID" || s === "LUNAS" || s === "SETTLEMENT") return 2;
    return 1; // PENDING / CREATED
  };

  const activeStep = orderData ? getStepState(orderData.status) : 0;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1c1c] font-sans flex flex-col antialiased selection:bg-[#7a0019] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Lacak Pesanan Bakso Pak Mul
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl mx-auto">
            Masukkan Nomor ID Pesanan Anda untuk memantau status pembuatan, pembayaran, dan pengiriman secara real-time.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100 mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Contoh: #ORD-2024-BPM-892"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:bg-white transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#51000d] to-[#7a0019] text-white font-extrabold px-8 py-4 rounded-2xl text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Memeriksa...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">travel_explore</span>
                  Lacak Sekarang
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center animate-fadeIn mb-10">
            <div className="w-14 h-14 bg-red-100 text-[#7a0019] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">error_meds</span>
            </div>
            <h3 className="text-base font-extrabold text-red-900 mb-1">Pesanan Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto">{errorMsg}</p>
          </div>
        )}

        {/* Tracking Results Card */}
        {orderData && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
            {/* Top Info Banner */}
            <div className="bg-gradient-to-r from-[#51000d] to-[#7a0019] p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  ID Pesanan Terverifikasi
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2">{orderData.orderNumber}</h2>
                <p className="text-xs text-red-100 mt-1">
                  📅 Tanggal: {new Date(orderData.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-red-200 block font-medium">Total Tagihan</span>
                <span className="text-2xl font-black text-white">Rp {formatPrice(orderData.finalTotal)}</span>
              </div>
            </div>

            {/* Stepper Status Timeline */}
            <div className="p-6 sm:p-10 border-b border-gray-100">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-400 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#7a0019]">timeline</span>
                Status Perjalanan Pesanan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {/* Step 1: Pesanan Dibuat */}
                <div className={`flex md:flex-col items-center gap-4 text-left md:text-center relative z-10 ${activeStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-md ${activeStep >= 1 ? 'bg-gradient-to-tr from-[#51000d] to-[#7a0019] text-white ring-4 ring-red-100' : 'bg-gray-100 text-gray-400'}`}>
                    <span className="material-symbols-outlined text-2xl">receipt_long</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">Pesanan Dibuat</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Sistem telah mencatat pesanan Anda</p>
                  </div>
                </div>

                {/* Step 2: Pembayaran Lunas */}
                <div className={`flex md:flex-col items-center gap-4 text-left md:text-center relative z-10 ${activeStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-md ${activeStep >= 2 ? 'bg-gradient-to-tr from-green-600 to-emerald-500 text-white ring-4 ring-green-100' : 'bg-gray-100 text-gray-400'}`}>
                    <span className="material-symbols-outlined text-2xl">verified</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">Pembayaran Terverifikasi</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Transaksi lunas via Midtrans/COD</p>
                  </div>
                </div>

                {/* Step 3: Pengolahan Dapur */}
                <div className={`flex md:flex-col items-center gap-4 text-left md:text-center relative z-10 ${activeStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-md ${activeStep >= 3 ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400'}`}>
                    <span className="material-symbols-outlined text-2xl">cooking</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">Pengolahan Dapur</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Dapur Pak Mul menyiapkan & mengemas</p>
                  </div>
                </div>

                {/* Step 4: Dalam Pengiriman / Selesai */}
                <div className={`flex md:flex-col items-center gap-4 text-left md:text-center relative z-10 ${activeStep >= 4 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-md ${activeStep >= 4 ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white ring-4 ring-amber-100' : 'bg-gray-100 text-gray-400'}`}>
                    <span className="material-symbols-outlined text-2xl">local_shipping</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">Pengiriman / Selesai</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Pesanan dikirimkan ke alamat Anda</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details & Product Items */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Customer & Delivery Info */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#7a0019]">person_pin_circle</span>
                  Informasi Penerima & Alamat
                </h4>

                <div>
                  <span className="text-xs text-gray-400 block">Nama Pemesan</span>
                  <span className="text-sm font-bold text-gray-900">{orderData.customerName}</span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block">Nomor Telepon/WhatsApp</span>
                  <span className="text-sm font-bold text-gray-900">{orderData.phone}</span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block">Alamat Tujuan Pengiriman</span>
                  <span className="text-sm font-semibold text-gray-800 leading-relaxed block">
                    {orderData.address}, {orderData.city}, {orderData.province}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block">Metode Pembayaran</span>
                  <span className="inline-block mt-1 px-3 py-1 bg-white text-gray-800 text-xs font-bold rounded-lg border border-gray-200 shadow-sm">
                    💳 {orderData.paymentType || "MIDTRANS ONLINE"}
                  </span>
                </div>
              </div>

              {/* Right Column: Ordered Items List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#7a0019]">inventory_2</span>
                  Daftar Produk Pesanan ({orderData.items?.length || 0})
                </h4>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {orderData.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <img
                        src={item.product?.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60"}
                        alt={item.product?.name || "Produk"}
                        className="w-14 h-14 object-contain bg-white rounded-xl p-1 border border-gray-200"
                      />
                      <div className="flex-grow">
                        <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{item.product?.name || "Produk Bakso Pak Mul"}</h5>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {item.quantity} x Rp {formatPrice(item.priceAtTime || item.product?.price || 0)}
                        </p>
                      </div>
                      <span className="text-xs font-black text-[#51000d]">
                        Rp {formatPrice((item.priceAtTime || item.product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Direct WhatsApp CS Support */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/6281298980252?text=${encodeURIComponent(`Halo CS Bakso Pak Mul 👋, saya ingin menanyakan status pesanan saya:\n\n📦 ID Pesanan: ${orderData.orderNumber}\n👤 Nama: ${orderData.customerName}\n\nMohon bantuannya ya Pak Mul, terima kasih!`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    Tanyakan CS via WhatsApp (+62 812-9898-0252)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function LacakPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Memuat tracker pesanan...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
