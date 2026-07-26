"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";

export default function TransaksiPage() {
  const [activeTab, setActiveTab] = useState<"semua" | "berlangsung" | "selesai" | "dibatalkan">("semua");

  const transactions = [
    {
      id: "TRX-20260726-001",
      date: "26 Juli 2026, 14:20",
      status: "Berlangsung",
      statusColor: "bg-blue-100 text-blue-800 border-blue-200",
      total: 250000,
      items: [
        { name: "Bakso Sapi Super Polos (50pcs) - Vacuum Pack", qty: 2, price: 75000 },
        { name: "Bumbu Kuah Bakso Rahasia Pak Mul (5L)", qty: 1, price: 100000 },
      ],
    },
    {
      id: "TRX-20260720-089",
      date: "20 Juli 2026, 10:15",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-800 border-green-200",
      total: 135000,
      items: [
        { name: "Bakso Sapi Urat Spesial (50pcs) - B2B Pack", qty: 1, price: 90000 },
        { name: "Mie Kuning Premium 225 (Bal 5kg)", qty: 1, price: 45000 },
      ],
    },
  ];

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
          {transactions.map((trx) => (
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
                {trx.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-semibold text-gray-800">{item.name}</span>
                      <span className="text-xs text-gray-400 ml-2">x{item.qty}</span>
                    </div>
                    <span className="font-bold text-gray-900">Rp {formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Total Pembayaran</span>
                <span className="text-lg font-black text-[#51000d]">Rp {formatPrice(trx.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CartSidebar />
    </div>
  );
}
