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
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917] font-sans flex flex-col antialiased selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-20 sm:pt-24">
        {/* ========================================================================= */}
        {/* ARTISAN HEADER BANNER                                                     */}
        {/* ========================================================================= */}
        <section className="relative bg-[#1c0306] text-white py-14 sm:py-20 overflow-hidden border-b border-[#420812]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,169,60,0.12)_0%,_transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e5a93c]/20 text-[#e5a93c] border border-[#e5a93c]/30 text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              <span>LIVE TRACKING PENGIRIMAN</span>
            </div>

            <div className="relative inline-block my-2">
              <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl uppercase text-white tracking-tight leading-tight">
                PANTAU STATUS PESANAN
              </h1>
              <span className="font-script text-3xl sm:text-5xl md:text-6xl text-[#fcd34d] absolute -top-4 sm:-top-7 right-0 rotate-[-5deg] pointer-events-none drop-shadow-md">
                Segar Sampai Tujuan
              </span>
            </div>

            <p className="max-w-xl mx-auto text-[#fef3c7] text-xs sm:text-sm mt-3 font-semibold leading-relaxed">
              Masukkan Nomor ID Pesanan untuk memantau status penggilingan bahan baku segar, verifikasi pembayaran, dan armada kurir pengiriman secara langsung.
            </p>
          </div>
        </section>

        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          {/* Search Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-stone-200 mb-10">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#51000d]">
                  search
                </span>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Masukkan Nomor Pesanan (Contoh: #ORD-2024-BPM-892)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-50 border-2 border-stone-200 text-xs sm:text-sm font-bold text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:border-[#7a0019] focus:bg-white transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306] font-black px-7 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#1c0306] border-t-transparent rounded-full animate-spin" />
                    <span>Memeriksa...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base font-bold">travel_explore</span>
                    <span>Lacak Pesanan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error State */}
          {errorMsg && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 text-center mb-10">
              <div className="w-12 h-12 bg-rose-100 text-[#51000d] rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold">
                <span className="material-symbols-outlined text-2xl">error</span>
              </div>
              <h3 className="font-headline text-lg uppercase text-[#51000d] mb-1">
                Pesanan Tidak Ditemukan
              </h3>
              <p className="text-xs text-[#2b1b17] max-w-md mx-auto font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Tracking Results Card */}
          {orderData && (
            <div className="bg-white rounded-3xl shadow-sm border-2 border-stone-200 overflow-hidden mb-10">
              {/* Top Info Banner */}
              <div className="bg-[#1c0306] p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#420812]">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#e5a93c] bg-[#e5a93c]/20 px-3 py-1 rounded-full border border-[#e5a93c]/30">
                    ID PESANAN TERVERIFIKASI
                  </span>
                  <h2 className="font-headline text-3xl sm:text-4xl mt-2 text-white">
                    {orderData.orderNumber}
                  </h2>
                  <p className="text-xs text-[#fef3c7] mt-1 font-medium">
                    Waktu Pesanan:{" "}
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
                  <span className="text-xs text-[#fef3c7] block font-bold">Total Pembayaran</span>
                  <span className="font-headline text-3xl sm:text-4xl text-[#e5a93c]">
                    Rp {formatPrice(orderData.finalTotal)}
                  </span>
                </div>
              </div>

              {/* Stepper Status Timeline */}
              <div className="p-6 sm:p-10 border-b border-stone-200">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#7a0019] mb-8 flex items-center gap-2">
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
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs ${
                        activeStep >= 1
                          ? "bg-[#51000d] text-[#e5a93c] ring-4 ring-amber-100"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">receipt_long</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm uppercase text-[#1c1917]">
                        Pesanan Tercatat
                      </h4>
                      <p className="text-[11px] text-[#51000d] font-semibold mt-0.5">
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
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs ${
                        activeStep >= 2
                          ? "bg-emerald-700 text-white ring-4 ring-emerald-100"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">verified</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm uppercase text-[#1c1917]">
                        Pembayaran Sah
                      </h4>
                      <p className="text-[11px] text-[#51000d] font-semibold mt-0.5">
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
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs ${
                        activeStep >= 3
                          ? "bg-amber-600 text-white ring-4 ring-amber-100"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">soup_kitchen</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm uppercase text-[#1c1917]">
                        Peracikan &amp; Kemas
                      </h4>
                      <p className="text-[11px] text-[#51000d] font-semibold mt-0.5">
                        Bahan baku segar disiapkan
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
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs ${
                        activeStep >= 4
                          ? "bg-emerald-800 text-white ring-4 ring-emerald-100"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm uppercase text-[#1c1917]">
                        Selesai / Terkirim
                      </h4>
                      <p className="text-[11px] text-[#51000d] font-semibold mt-0.5">
                        Pesanan tiba di tujuan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Summary & Delivery Info */}
              <div className="p-6 sm:p-10 space-y-6">
                <div>
                  <h4 className="font-headline text-base uppercase text-[#1c1917] mb-3">
                    Rincian Pesanan
                  </h4>
                  <div className="space-y-3">
                    {orderData.items?.map((it: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs sm:text-sm p-3.5 bg-[#faf7f2] rounded-2xl border border-stone-200"
                      >
                        <div>
                          <p className="font-headline text-sm uppercase text-[#1c1917]">
                            {it.product?.name || "Item Menu"}
                          </p>
                          <p className="text-[11px] text-[#51000d] font-semibold">
                            Jumlah: {it.quantity} {it.product?.unit || "Pack"}
                          </p>
                        </div>
                        <p className="font-headline text-base text-[#1c1917]">
                          Rp {formatPrice((it.priceAtTime || it.product?.price || 0) * it.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#51000d] font-bold block mb-1">Penerima &amp; Kontak:</span>
                    <p className="font-extrabold text-[#1c1917]">{orderData.customerName}</p>
                    <p className="text-[#2b1b17]">{orderData.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-[#51000d] font-bold block mb-1">Alamat Tujuan:</span>
                    <p className="text-[#2b1b17] font-medium leading-relaxed">
                      {orderData.shippingAddress || "Alamat tercatat di sistem"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#51000d] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}