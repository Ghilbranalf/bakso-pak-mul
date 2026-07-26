"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function PaymentPage() {
  const { items, totalPrice } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<"dana" | "gopay" | "ovo" | "shopeepay" | "bca" | "mandiri" | "bni" | "qris" | "cod">("dana");
  const [phoneNumber, setPhoneNumber] = useState("81234567890");
  const [codName, setCodName] = useState("Toko Bakso Mulia");
  const [codAddress, setCodAddress] = useState("Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan");
  const [codNotes, setCodNotes] = useState("Titipkan ke kasir jika toko buka");
  const [copied, setCopied] = useState(false);
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

  const vaNumbers: Record<string, string> = {
    bca: "8821 0001 4452 990",
    mandiri: "8821 0002 9918 441",
    bni: "8821 0003 7721 004",
    dana: `3901 0${phoneNumber}`,
    gopay: `70001 0${phoneNumber}`,
    ovo: `8099 0${phoneNumber}`,
    shopeepay: `122 0${phoneNumber}`,
  };

  const currentCode = vaNumbers[selectedMethod] || "8821 0001 4452 990";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode.replace(/\s/g, "")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const isEWallet = ["dana", "gopay", "ovo", "shopeepay"].includes(selectedMethod);
  const isBank = ["bca", "mandiri", "bni"].includes(selectedMethod);

  return (
    <div className="bg-[#f3f3f3] text-[#1a1c1c] min-h-screen flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      {/* Modal Container */}
      <main className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative border border-white/50">
        
        {/* Back Button Context */}
        <Link
          href="/cart"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-[#51000d] transition-colors bg-white/80 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-gray-200 text-xs font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Kembali ke Keranjang</span>
        </Link>

        {/* Left Side: Order Summary */}
        <section className="w-full md:w-5/12 bg-white p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background element */}
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

              <div className="space-y-4 mb-6 max-h-48 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <>
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
                  </>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-gray-900 truncate max-w-[150px]">{item.name}</p>
                        <p className="text-gray-500 text-[11px]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-gray-800">Rp {formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))
                )}
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

        {/* Right Side: Dynamic Payment Gateway */}
        <section className="w-full md:w-7/12 bg-[#f9f9f9] p-8 md:p-12 flex flex-col justify-center relative">
          <div className="max-w-md mx-auto w-full">
            
            {/* Payment Method Selector Grid */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                Pilih Metode Pembayaran
              </label>

              {/* Row 1: E-Wallets */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { id: "dana", name: "DANA", color: "text-[#118EEA]" },
                  { id: "gopay", name: "GoPay", color: "text-emerald-600" },
                  { id: "ovo", name: "OVO", color: "text-purple-600" },
                  { id: "shopeepay", name: "ShopeePay", color: "text-orange-600" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedMethod === m.id
                        ? "bg-[#118EEA] text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-[#118EEA]"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              {/* Row 2: Banks, QRIS, & COD */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "bca", name: "BCA" },
                  { id: "mandiri", name: "Mandiri" },
                  { id: "bni", name: "BNI" },
                  { id: "cod", name: "COD (Bayar di Tempat)" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer truncate ${
                      selectedMethod === m.id
                        ? "bg-[#51000d] text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-[#51000d]"
                    }`}
                    title={m.name}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* COD (BAYAR DI TEMPAT) GATEWAY */}
            {selectedMethod === "cod" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center mb-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">local_shipping</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Bayar di Tempat (COD)</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Bayar tunai saat pesanan tiba di lokasi/toko Anda.</p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Nama Toko / Penerima</label>
                    <input
                      type="text"
                      value={codName}
                      onChange={(e) => setCodName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Alamat Pengiriman Lengkap</label>
                    <textarea
                      rows={2}
                      value={codAddress}
                      onChange={(e) => setCodAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-emerald-600 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Catatan Kurir (Opsional)</label>
                    <input
                      type="text"
                      value={codNotes}
                      onChange={(e) => setCodNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 items-start text-xs text-amber-800">
                  <span className="material-symbols-outlined text-amber-600 text-lg mt-0.5">info</span>
                  <p className="text-[11px] leading-relaxed">
                    Siapkan uang tunai pas sebesar <span className="font-bold">Rp {formatPrice(finalTotal)}</span> saat kurir Bakso Pak Mul melakukan serah terima barang.
                  </p>
                </div>

                <Link
                  href="/transaksi"
                  className="w-full h-13 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wider cursor-pointer mt-2"
                >
                  <span>Konfirmasi Pesanan COD</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            )}

            {/* DANA & E-WALLET SPECIFIC GATEWAY */}
            {isEWallet && (
              <>
                <div className="flex flex-col items-center mb-6 text-center">
                  <div className="w-28 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                    <span className={`text-xl font-black tracking-tight ${
                      selectedMethod === "dana" ? "text-[#118EEA]" :
                      selectedMethod === "gopay" ? "text-emerald-600" :
                      selectedMethod === "ovo" ? "text-purple-600" : "text-orange-600"
                    }`}>
                      {selectedMethod.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Selesaikan Pembayaran</h2>
                  <p className="text-xs text-gray-500">Masukkan nomor {selectedMethod.toUpperCase()} terdaftar Anda untuk melanjutkan.</p>
                </div>

                <form className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Nomor {selectedMethod.toUpperCase()}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">+62</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-12 pl-14 pr-4 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 text-sm focus:ring-2 focus:ring-[#118EEA] transition-colors shadow-sm"
                        placeholder="8xx xxxx xxxx"
                      />
                    </div>
                  </div>

                  <div className="bg-[#E6F3FB] border border-[#BCE1F6] rounded-xl p-3.5 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-[#118EEA] text-xl mt-0.5">phone_iphone</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900 mb-0.5">Buka Aplikasi {selectedMethod.toUpperCase()}</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        Notifikasi pembayaran akan dikirim ke aplikasi Anda. Silakan konfirmasi sebelum batas waktu berakhir.
                      </p>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sisa Waktu Pembayaran</span>
                    <div className="text-3xl font-black text-gray-900 font-mono tracking-wider">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <Link
                    href="/transaksi"
                    className={`w-full h-13 rounded-xl font-bold text-xs text-white transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wider cursor-pointer ${
                      selectedMethod === "dana" ? "bg-[#118EEA] hover:bg-blue-600" :
                      selectedMethod === "gopay" ? "bg-emerald-600 hover:bg-emerald-700" :
                      selectedMethod === "ovo" ? "bg-purple-600 hover:bg-purple-700" : "bg-orange-600 hover:bg-orange-700"
                    }`}
                  >
                    <span>Bayar Sekarang dengan {selectedMethod.toUpperCase()}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </Link>

                  <p className="text-center text-[10px] text-gray-400">
                    Dengan melanjutkan, Anda menyetujui <a className="text-[#51000d] hover:underline" href="#">Syarat &amp; Ketentuan Layanan</a>.
                  </p>
                </form>
              </>
            )}

            {/* BANK TRANSFER SPECIFIC GATEWAY */}
            {isBank && (
              <div className="space-y-5">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-24 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-2">
                    <span className="text-base font-black text-[#51000d] uppercase">{selectedMethod}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Virtual Account {selectedMethod.toUpperCase()}</h2>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nomor Virtual Account</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900 tracking-widest">{currentCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#51000d] rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">{copied ? "check" : "content_copy"}</span>
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Timer */}
                <div className="flex flex-col items-center justify-center py-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sisa Waktu Pembayaran</span>
                  <div className="text-2xl font-black text-gray-900 font-mono tracking-wider">
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <Link
                  href="/transaksi"
                  className="w-full h-13 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wider cursor-pointer"
                >
                  <span>Konfirmasi Pembayaran Transfer Bank</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            )}

            {/* QRIS GATEWAY */}
            {selectedMethod === "qris" && (
              <div className="py-4 flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=BPM-8821-PAYMENT"
                    alt="QRIS Code"
                    className="w-44 h-44 object-contain"
                  />
                </div>
                <p className="text-xs font-bold text-gray-700">Scan QRIS menggunakan DANA, GoPay, OVO, ShopeePay atau M-Banking</p>

                <Link
                  href="/transaksi"
                  className="w-full h-13 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wider cursor-pointer mt-4"
                >
                  <span>Saya Sudah Bayar via QRIS</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
