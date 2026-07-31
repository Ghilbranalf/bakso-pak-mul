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
            let statusColor = "bg-blue-100 text-blue-800 border-blue-200";

            if (order.status === "COMPLETED") {
              statusLabel = "Selesai";
              statusColor = "bg-green-100 text-green-800 border-green-200";
            } else if (order.status === "CANCELED" || order.status === "CANCELLED") {
              statusLabel = "Dibatalkan";
              statusColor = "bg-red-100 text-red-800 border-red-200";
            } else if (order.status === "PENDING" || order.status === "AWAITING_PAYMENT") {
              statusLabel = "Menunggu Pembayaran";
              statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
            }

            // Format date
            const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return {
              id: order.orderNumber,
              date: date,
              status: statusLabel,
              statusColor,
              total: order.finalTotal,
              rawStatus: statusLabel.toLowerCase(),
              items: order.items.map((item: any) => ({
                name: item.product?.name || "Produk Dihapus",
                qty: item.quantity,
                price: item.priceAtTime
              }))
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

  const filteredTransactions = activeTab === "semua" 
    ? transactions 
    : transactions.filter(t => t.rawStatus.includes(activeTab) || (activeTab === "berlangsung" && t.rawStatus !== "selesai" && t.rawStatus !== "dibatalkan"));

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau status pesanan dan riwayat pembelian Anda di sini.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
          {(["semua", "berlangsung", "selesai", "dibatalkan"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-[#51000d] text-white shadow-md shadow-[#51000d]/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transaction Cards List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Memuat data transaksi...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Belum ada transaksi di tab ini.</div>
          ) : filteredTransactions.map((trx) => (
            <div key={trx.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-gray-100 gap-4">
                <div>
                  <span className="text-xs font-extrabold text-[#51000d]">{trx.id}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{trx.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${trx.statusColor}`}>
                  {trx.status}
                </span>
              </div>

              {/* Items */}
              <div className="py-4 space-y-3">
                {trx.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-semibold text-gray-800">{item.name}</span>
                      <span className="text-xs text-gray-400 ml-2">x{item.qty}</span>
                    </div>
                    <span className="font-bold text-gray-900">Rp {formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Total Pembayaran</span>
                  <span className="text-lg font-black text-[#51000d]">Rp {formatPrice(trx.total)}</span>
                </div>
                <Link
                  href={`/transaksi/${trx.id}`}
                  className="px-5 py-2 rounded-xl bg-[#51000d] hover:bg-[#7a0019] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                  Lacak Pesanan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <CartSidebar />
    </div>
  );
}
