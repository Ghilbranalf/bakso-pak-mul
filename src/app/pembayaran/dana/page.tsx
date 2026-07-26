"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function DanaPaymentPage() {
  const { items, totalPrice } = useCart();
  const [phoneNumber, setPhoneNumber] = useState("81234567890");
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const shippingCost = items.length > 0 ? 150000 : 0;
  const discount = totalPrice > 500000 ? 100000 : 0;
  const finalTotal = items.length > 0 ? Math.max(0, totalPrice + shippingCost - discount) : 4500000;

  return (
    <div className="bg-[#f3f3f3] text-[#1a1c1c] min-h-screen flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      <main className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative border border-white/50">
        
        {/* Back Button Context */}
        <Link
          href="/pembayaran"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors bg-white/50 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-gray-200 text-xs font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Kembali ke Pilihan Pembayaran</span>
        </Link>

        {/* Left Side: Order Summary */}
        <section className="w-full md:w-5/12 bg-white p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          <div className="relative z-10 mt-12 md:mt-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#51000d] mb-1">Bakso Pak Mul</h1>
              <p className="text-xs text-gray-500 font-medium">B2B Wholesale Portal</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Order ID</span>
                <span className="text-xs font-bold text-gray-900">#BPM-8821</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <p className="font-bold text-gray-900">Premium Beef Meatballs</p>
                    <p className="text-gray-500 text-[11px]">Bulk Pack (50kg)</p>
                  </div>
                  <span className="font-medium text-gray-800">Rp 3.500.000</span>
                </div>
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <p className="font-bold text-gray-900">Spicy Broth Paste</p>
                    <p className="text-gray-500 text-[11px]">Commercial Tub (10kg)</p>
                  </div>
                  <span className="font-medium text-gray-800">Rp 1.000.000</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-[#51000d]">Rp {formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-gray-400 text-xs mt-4">
            <span className="material-symbols-outlined text-base">lock</span>
            <span>Pembayaran Aman Terenkripsi SSL 256-bit</span>
          </div>
        </section>

        {/* Right Side: DANA Payment */}
        <section className="w-full md:w-7/12 bg-[#f9f9f9] p-8 md:p-12 flex flex-col justify-center relative">
          <div className="max-w-md mx-auto w-full">
            
            {/* DANA Header */}
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-28 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                <span className="text-xl font-black text-[#118EEA] tracking-tight">DANA</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Complete your payment</h2>
              <p className="text-xs text-gray-500">Enter your DANA registered number to proceed.</p>
            </div>

            {/* Payment Form */}
            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Nomor DANA</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">+62</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-14 pl-14 pr-4 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 text-sm focus:ring-2 focus:ring-[#118EEA] transition-colors shadow-sm"
                    placeholder="8xx xxxx xxxx"
                  />
                </div>
              </div>

              {/* Instructions / Status */}
              <div className="bg-[#E6F3FB] border border-[#BCE1F6] rounded-xl p-4 flex gap-4 items-start">
                <span className="material-symbols-outlined text-[#118EEA] text-xl mt-0.5">phone_iphone</span>
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-1">Check your DANA app</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A payment notification will be sent to your app. Please confirm within the time limit.
                  </p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex flex-col items-center justify-center py-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time remaining</span>
                <div className="text-3xl font-black text-gray-900 font-mono tracking-wider">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/transaksi"
                className="w-full h-14 bg-[#118EEA] hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md uppercase tracking-wider cursor-pointer"
              >
                <span>Bayar Sekarang with DANA</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>

              <p className="text-center text-[10px] text-gray-400 mt-2">
                By proceeding, you agree to our <a className="text-[#51000d] hover:underline" href="#">Terms of Service</a>.
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
