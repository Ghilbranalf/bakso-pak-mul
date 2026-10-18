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
    <div className="min-h-[100dvh] bg-[#faf7f2] text-[#1c1917] font-sans flex flex-col antialiased selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* ARTISAN HEADER BANNER                                                     */}
        {/* ========================================================================= */}
        <section className="bg-[#200407] text-white pt-28 sm:pt-36 pb-14 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="text-xs font-semibold text-stone-300 block">
              Live Tracking Pengiriman
            </span>

            <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight leading-tight">
              Pantau Status Pesanan
            </h1>

            <p className="font-editorial text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed pt-1">
              Masukkan Nomor ID Pesanan untuk memantau status peracikan bahan baku segar, verifikasi pembayaran, dan armada kurir pengiriman secara langsung.
            </p>
          </div>
        </section>

        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          {/* Search Bar */}
          <div data-ui className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 mb-10">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  search
                </span>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Masukkan Nomor Pesanan (Contoh: #ORD-2024-BPM-892)"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#7a0019] focus:bg-white transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#7a0019] hover:bg-[#51000d] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
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
            <div data-ui className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center mb-10">
              <div className="w-12 h-12 bg-rose-100 text-[#7a0019] rounded-xl flex items-center justify-center mx-auto mb-3 font-bold">
                <span className="material-symbols-outlined text-2xl">error</span>
              </div>
              <h3 className="font-headline text-lg uppercase text-[#7a0019] mb-1">
                Pesanan Tidak Ditemukan
              </h3>
              <p className="text-xs text-stone-700 max-w-md mx-auto font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Tracking Results Card */}
          {orderData && (
            <div data-ui className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-10">
              {/* Top Info Banner */}
              <div className="bg-[#200407] p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold text-stone-300 bg-white/10 px-2.5 py-1 rounded">
                    ID Pesanan Terverifikasi
                  </span>
                  <h2 className="font-headline font-bold text-2xl sm:text-3xl mt-2 text-white">
                    {orderData.orderNumber}
                  </h2>
                  <p className="text-xs text-stone-300 mt-1 font-medium">
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
                  <span className="text-xs text-stone-400 block font-medium">Total Pembayaran</span>
                  <span className="font-headline font-bold text-2xl sm:text-3xl text-white">
                    Rp {formatPrice(orderData.finalTotal)}
                  </span>
                </div>
              </div>

              {/* Stepper Status Timeline */}
              <div className="p-6 sm:p-10">
                <h3 className="text-xs font-bold text-[#7a0019] mb-8 flex items-center gap-2">
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
                          ? "bg-[#7a0019] text-white ring-4 ring-[#7a0019]/15"
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

                <div className="pt-5 mt-4 bg-stone-50 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
        <div className="min-h-[100dvh] bg-[#faf7f2] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-[#51000d] border-t-transparent animate-spin" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}