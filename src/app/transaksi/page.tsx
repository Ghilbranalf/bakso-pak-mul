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
              statusColor = "bg-emerald-50 text-emerald-900 border-emerald-200";
            } else if (order.status === "SHIPPED") {
              statusLabel = "Sedang Dikirim";
              statusColor = "bg-sky-50 text-sky-900 border-sky-200";
            } else if (order.status === "PROCESSING") {
              statusLabel = "Sedang Dikemas";
              statusColor = "bg-amber-50 text-amber-900 border-amber-200";
            } else if (order.status === "CANCELED" || order.status === "CANCELLED") {
              statusLabel = "Dibatalkan";
              statusColor = "bg-rose-50 text-rose-900 border-rose-200";
            } else {
              statusLabel = "Menunggu Konfirmasi";
              statusColor = "bg-stone-100 text-stone-800 border-stone-200";
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
    <div className="min-h-[100dvh] flex flex-col bg-[#faf7f2] text-[#1c1917] font-sans antialiased selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* ARTISAN HEADER BANNER                                                     */}
        {/* ========================================================================= */}
        <section className="bg-[#200407] text-white pt-28 sm:pt-36 pb-14 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="text-xs font-semibold text-stone-300 block">
              Catatan Transaksi Pelanggan
            </span>

            <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight leading-tight">
              Riwayat Pesanan
            </h1>

            <p className="font-editorial text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed pt-1">
              Pantau status pemesanan racikan bakso segar, invoice transaksi, dan riwayat belanja Anda di Bakso Pak Mul.
            </p>
          </div>
        </section>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {(["semua", "berlangsung", "selesai", "dibatalkan"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#7a0019] text-white font-bold"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
                }`}
              >
                {tab === "semua" ? "Semua Pesanan" : tab}
              </button>
            ))}
          </div>

          {/* Transaction Cards List */}
          <div className="space-y-6">
            {isLoading ? (
              <div data-ui className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                <span className="w-8 h-8 rounded-full border-4 border-[#7a0019] border-t-transparent animate-spin inline-block mb-3" />
                <p className="font-headline text-lg uppercase text-[#1c1917]">Memuat Data Transaksi...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div data-ui className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
                <span className="material-symbols-outlined text-5xl text-[#7a0019] mb-2 block">
                  receipt_long
                </span>
                <p className="font-headline text-xl uppercase text-[#1c1917]">Belum Ada Transaksi</p>
                <p className="text-xs text-stone-600 font-medium mt-1">
                  Belum ada catatan pesanan di kategori ini. Yuk coba racikan bakso sapi asli Pak Mul!
                </p>
                <Link
                  href="/produk"
                  className="mt-4 inline-block px-5 py-2.5 bg-[#7a0019] hover:bg-[#51000d] text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Pilih Menu Sekarang
                </Link>
              </div>
            ) : (
              filteredTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 hover:border-[#7a0019]/40 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between pb-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-[#7a0019]">
                        {trx.id}
                      </span>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">{trx.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${trx.statusColor}`}
                    >
                      {trx.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="py-4 space-y-3">
                    {trx.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-headline font-bold uppercase text-sm text-[#1c1917]">
                            {item.name}
                          </span>
                          <span className="text-xs font-semibold text-stone-500 ml-2">
                            x{item.qty}
                          </span>
                        </div>
                        <span className="font-headline font-bold text-base text-[#1c1917]">
                          Rp {formatPrice((item.price || 0) * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 pt-3 bg-stone-50 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs text-stone-500 font-medium block">
                        Total Pembayaran
                      </span>
                      <span className="font-headline font-bold text-2xl text-[#1c1917]">
                        Rp {formatPrice(trx.total)}
                      </span>
                    </div>
                    <Link
                      href={`/lacak?id=${encodeURIComponent(trx.id)}`}
                      className="px-5 py-2.5 rounded-xl bg-[#200407] hover:bg-[#3d0a11] text-white text-sm font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>Lacak Pesanan</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
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