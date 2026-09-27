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
      const res = await fetch(
        `/api/orders/track?query=${encodeURIComponent(queryToSearch.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Pesanan tidak ditemukan");
        setOrderData(null);
      } else {
        setOrderData(data.order);
      }
    } catch (e) {
      setErrorMsg("Terjadi kendala jaringan. Silakan coba beberapa saat lagi.");
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

  // Live Auto Polling
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (orderData && orderData.id) {
      interval = setInterval(() => {
        fetchTracking(orderData.id || searchId);
      }, 7000);
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
    return 1;
  };

  const activeStep = orderData ? getStepState(orderData.status) : 0;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans flex flex-col antialiased selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header Title */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase">
            <span className="w-5 h-[1px] bg-[#7a0019]" />
            <span>Pantau Status Pengiriman</span>
            <span className="w-5 h-[1px] bg-[#7a0019]" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
            Lacak Pesanan Anda
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-normal">
            Masukkan Nomor ID Pesanan Anda untuk memantau status peracikan bahan baku, pembayaran, dan kurir pengiriman secara langsung.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-stone-200/80 mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                search
              </span>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Contoh: #ORD-2024-BPM-892"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#7a0019] focus:bg-white transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#51000d] hover:bg-[#7a0019] text-white font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memeriksa...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">travel_explore</span>
                  <span>Lacak Pesanan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center mb-10">
            <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">error_meds</span>
            </div>
            <h3 className="font-display text-base font-bold text-rose-950 mb-1">
              Pesanan Tidak Ditemukan
            </h3>
            <p className="text-xs text-rose-700 max-w-md mx-auto">{errorMsg}</p>
          </div>
        )}

        {/* Tracking Results Card */}
        {orderData && (
          <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden">
            {/* Top Info Banner */}
            <div className="bg-gradient-to-r from-[#3a0009] via-[#51000d] to-[#3a0009] p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-white/10 px-3 py-1 rounded-md border border-white/10">
                  ID Pesanan Terverifikasi
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2">
                  {orderData.orderNumber}
                </h2>
                <p className="text-xs text-stone-300 mt-1">
                  Tanggal Pemesanan:{" "}
                  {new Date(orderData.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-300 block font-medium">Total Pembayaran</span>
                <span className="font-display text-2xl sm:text-3xl font-bold text-amber-200">
                  Rp {formatPrice(orderData.finalTotal)}
                </span>
              </div>
            </div>

            {/* Stepper Status Timeline */}
            <div className="p-6 sm:p-10 border-b border-stone-200/80">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a0019] mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">timeline</span>
                <span>Perjalanan Status Pesanan</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {/* Step 1 */}
                <div
                  className={`flex md:flex-col items-center gap-4 text-left md:text-center ${
                    activeStep >= 1 ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                      activeStep >= 1
                        ? "bg-[#51000d] text-white ring-4 ring-amber-100"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-stone-900">
                      Pesanan Tercatat
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Diterima oleh sistem kios
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className={`flex md:flex-col items-center gap-4 text-left md:text-center ${
                    activeStep >= 2 ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                      activeStep >= 2
                        ? "bg-emerald-700 text-white ring-4 ring-emerald-100"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">verified</span>
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-stone-900">
                      Pembayaran Sah
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Transaksi terverifikasi
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  className={`flex md:flex-col items-center gap-4 text-left md:text-center ${
                    activeStep >= 3 ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                      activeStep >= 3
                        ? "bg-blue-700 text-white ring-4 ring-blue-100"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">soup_kitchen</span>
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-stone-900">
                      Pengolahan Kios
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Dikemas dingin &amp; tersegel
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div
                  className={`flex md:flex-col items-center gap-4 text-left md:text-center ${
                    activeStep >= 4 ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                      activeStep >= 4
                        ? "bg-amber-600 text-white ring-4 ring-amber-100"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-stone-900">
                      Pengiriman / Selesai
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Diantar ke alamat tujuan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details & Product Items */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Customer & Delivery Info */}
              <div className="bg-[#faf7f2] p-6 rounded-xl border border-stone-200/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#7a0019]">
                    person_pin_circle
                  </span>
                  <span>Informasi Pengiriman</span>
                </h4>

                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Nama Penerima</span>
                  <span className="text-sm font-bold text-stone-900">{orderData.customerName}</span>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Nomor WhatsApp / Telp</span>
                  <span className="text-sm font-bold text-stone-900">{orderData.phone}</span>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Alamat Tujuan</span>
                  <span className="text-sm font-normal text-stone-800 leading-relaxed block">
                    {orderData.address}, {orderData.city}, {orderData.province}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Metode Pembayaran</span>
                  <span className="inline-block mt-1 px-3 py-1 bg-white text-stone-800 text-xs font-semibold rounded-md border border-stone-200 shadow-2xs">
                    {orderData.paymentType || "MIDTRANS ONLINE"}
                  </span>
                </div>
              </div>

              {/* Right Column: Ordered Items List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#7a0019]">
                    inventory_2
                  </span>
                  <span>Daftar Produk Pesanan ({orderData.items?.length || 0})</span>
                </h4>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {orderData.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 bg-[#faf7f2] p-3 rounded-xl border border-stone-200/70"
                    >
                      <img
                        src={item.product?.image || "/images/hero-banner.webp"}
                        alt={item.product?.name || "Produk"}
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-stone-200"
                      />
                      <div className="flex-grow min-w-0">
                        <h5 className="font-display text-xs font-bold text-stone-900 truncate">
                          {item.product?.name || "Produk Bakso Pak Mul"}
                        </h5>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {item.quantity} x Rp {formatPrice(item.priceAtTime || item.product?.price || 0)}
                        </p>
                      </div>
                      <span className="font-display text-xs font-bold text-[#51000d] shrink-0">
                        Rp {formatPrice((item.priceAtTime || item.product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/6281298980252?text=${encodeURIComponent(
                      `Halo CS Bakso Pak Mul, saya ingin menanyakan status pesanan saya:\n\nID Pesanan: ${orderData.orderNumber}\nNama: ${orderData.customerName}\n\nTerima kasih!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>Tanyakan Status via WhatsApp Kios</span>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#7a0019] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
