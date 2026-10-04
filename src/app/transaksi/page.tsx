"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";

export default function TransaksiPage() {
  const [activeTab, setActiveTab] = useState<"semua" | "berlangsung" | "selesai" | "dibatalkan">("semua");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.orders) {
          // Format data to match the UI
          const formatted = data.orders.map((order: any) => {
            let statusLabel = "Berlangsung";
            let statusColor = "bg-amber-100 text-amber-900 border-amber-300";

            if (order.status === "COMPLETED" || order.status === "SELESAI") {
              statusLabel = "Selesai";
              statusColor = "bg-emerald-100 text-emerald-900 border-emerald-300";
            } else if (order.status === "SHIPPED") {
              statusLabel = "Sedang Dikirim";
              statusColor = "bg-blue-100 text-blue-900 border-blue-300";
            } else if (order.status === "PROCESSING") {
              statusLabel = "Sedang Dikemas";
              statusColor = "bg-purple-100 text-purple-900 border-purple-300";
            } else if (order.status === "CANCELED" || order.status === "CANCELLED") {
              statusLabel = "Dibatalkan";
              statusColor = "bg-rose-100 text-rose-900 border-rose-300";
            } else {
              statusLabel = "Menunggu Konfirmasi";
              statusColor = "bg-amber-100 text-amber-900 border-amber-300";
            }

            // Format date
            const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return {
              id: order.orderNumber,
              date: date,
              status: statusLabel,
              statusColor,
              total: order.finalTotal,
              rawStatus: statusLabel.toLowerCase(),
              items: (order.items || []).map((item: any) => ({
                name: item.product?.name || "Produk Bakso",
                qty: item.quantity,
                price: item.priceAtTime,
              })),
            };
          });
          setTransactions(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions =
    activeTab === "semua"
      ? transactions
      : transactions.filter(
          (t) =>
            t.rawStatus.includes(activeTab) ||
            (activeTab === "berlangsung" &&
              t.rawStatus !== "selesai" &&
              t.rawStatus !== "dibatalkan")
        );

  const formatPrice = (price: number) => {
    return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917] font-sans antialiased selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-20 sm:pt-24">
        {/* ========================================================================= */}
        {/* ARTISAN HEADER BANNER                                                     */}
        {/* ========================================================================= */}
        <section className="relative bg-[#1c0306] text-white py-14 sm:py-20 overflow-hidden border-b border-[#420812]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,169,60,0.12)_0%,_transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e5a93c]/20 text-[#e5a93c] border border-[#e5a93c]/30 text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              <span>CATATAN TRANSAKSI PELANGGAN</span>
            </div>

            <div className="relative inline-block my-2">
              <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl uppercase text-white tracking-tight leading-tight">
                RIWAYAT PESANAN
              </h1>
              <span className="font-script text-3xl sm:text-5xl md:text-6xl text-[#fcd34d] absolute -top-4 sm:-top-7 right-0 rotate-[-5deg] pointer-events-none drop-shadow-md">
                Buku Kios
              </span>
            </div>

            <p className="max-w-xl mx-auto text-[#fef3c7] text-xs sm:text-sm mt-3 font-semibold leading-relaxed">
              Pantau status pemesanan racikan bakso segar, invoice transaksi, dan riwayat belanja Anda di Bakso Pak Mul.
            </p>
          </div>
        </section>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Tab Navigation */}
          <div className="flex gap-2.5 mb-8 overflow-x-auto pb-2">
            {(["semua", "berlangsung", "selesai", "dibatalkan"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#51000d] text-[#e5a93c] border-2 border-[#51000d] shadow-md scale-105"
                    : "bg-white border-2 border-stone-200 text-[#1c1917] hover:border-[#e5a93c]"
                }`}
              >
                {tab === "semua" ? "Semua Pesanan" : tab}
              </button>
            ))}
          </div>

          {/* Transaction Cards List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-16 bg-white rounded-3xl border-2 border-stone-200">
                <span className="w-8 h-8 border-4 border-[#51000d] border-t-transparent rounded-full animate-spin inline-block mb-3" />
                <p className="font-headline text-lg uppercase text-[#1c1917]">Memuat Data Transaksi...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border-2 border-stone-200 p-8">
                <span className="material-symbols-outlined text-5xl text-[#51000d] mb-2 block">
                  receipt_long
                </span>
                <p className="font-headline text-xl uppercase text-[#1c1917]">Belum Ada Transaksi</p>
                <p className="text-xs text-[#51000d] font-semibold mt-1">
                  Belum ada catatan pesanan di kategori ini. Yuk coba racikan bakso sapi asli Pak Mul!
                </p>
                <Link
                  href="/produk"
                  className="mt-4 inline-block px-6 py-2.5 bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306] rounded-full text-xs font-black uppercase tracking-wider shadow"
                >
                  Pilih Menu Sekarang
                </Link>
              </div>
            ) : (
              filteredTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-xs hover:shadow-xl hover:border-[#e5a93c] transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between pb-4 border-b border-stone-100 gap-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#51000d]">
                        {trx.id}
                      </span>
                      <p className="text-xs text-[#2b1b17] font-semibold mt-0.5">{trx.date}</p>
                    </div>
                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${trx.statusColor}`}
                    >
                      {trx.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="py-4 space-y-3">
                    {trx.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-headline uppercase text-sm text-[#1c1917]">
                            {item.name}
                          </span>
                          <span className="text-xs font-bold text-[#51000d] ml-2">
                            x{item.qty}
                          </span>
                        </div>
                        <span className="font-headline text-base text-[#1c1917]">
                          Rp {formatPrice((item.price || 0) * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs text-[#51000d] font-bold block">
                        TOTAL PEMBAYARAN
                      </span>
                      <span className="font-headline text-2xl text-[#1c1917]">
                        Rp {formatPrice(trx.total)}
                      </span>
                    </div>
                    <Link
                      href={`/lacak?id=${encodeURIComponent(trx.id)}`}
                      className="px-6 py-2.5 rounded-full bg-[#1c0306] hover:bg-[#36070e] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm text-[#e5a93c]">
                        local_shipping
                      </span>
                      <span>Lacak Pesanan</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CartSidebar />
    </div>
  );
}