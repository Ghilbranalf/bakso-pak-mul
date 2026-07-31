"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TrackOrderPage() {
  const params = useParams();
  const rawId = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Re-pay Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<"qris" | "va">("qris");
  const [selectedBank, setSelectedBank] = useState<"BCA" | "Mandiri" | "BNI" | "BRI">("BCA");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchOrderDetail = async () => {
    if (!rawId) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/orders/${encodeURIComponent(rawId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      }
    } catch (err) {
      console.error("Failed to load order detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();

    if (typeof window !== "undefined" && window.location.search.includes("print=true")) {
      setTimeout(() => {
        window.print();
      }, 800);
    }
  }, [rawId]);

  // Fallback demo data if order is not in DB
  const displayOrder = order || {
    orderNumber: rawId ? `#${rawId.toUpperCase()}` : "#BPM-88291",
    createdAt: new Date().toISOString(),
    status: "PENDING",
    finalTotal: 8000,
    shippingCost: 0,
    discount: 0,
    customerName: "Ghilbran",
    phone: "085600436463",
    address: "Dk.karang anyar RT02/RW05 Desa Kalijurang, Kecamatan Tonjong, Kabupaten Brebes, Jawa Tengah",
    items: [
      {
        id: "item-1",
        quantity: 1,
        priceAtTime: 8000,
        product: {
          name: "Saos Pedas Lima Delapan",
          unit: "bks",
          image: "/images/saos-pedas-lima-delapan.jpg"
        }
      }
    ]
  };

  // Determine active step (1 to 4)
  let activeStep = 1;
  const statusUpper = (displayOrder.status || "").toUpperCase();
  if (statusUpper === "PROCESSING" || statusUpper === "PAID") activeStep = 2;
  if (statusUpper === "SHIPPED" || statusUpper === "ON_DELIVERY") activeStep = 3;
  if (statusUpper === "COMPLETED") activeStep = 4;
  if (statusUpper === "CANCELED" || statusUpper === "CANCELLED") activeStep = 0;

  const isPending = statusUpper === "PENDING" || statusUpper === "AWAITING_PAYMENT";
  const isCanceled = statusUpper === "CANCELED" || statusUpper === "CANCELLED";
  const isPaid = statusUpper === "COMPLETED" || statusUpper === "PAID" || statusUpper === "PROCESSING";

  const formattedDate = new Date(displayOrder.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) + " WIB";

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const vaNumbers = {
    BCA: "88012" + Math.floor(10000000 + Math.random() * 90000000),
    Mandiri: "89320" + Math.floor(10000000 + Math.random() * 90000000),
    BNI: "88100" + Math.floor(10000000 + Math.random() * 90000000),
    BRI: "88088" + Math.floor(10000000 + Math.random() * 90000000),
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleMidtransPay = async () => {
    if (!displayOrder) return;
    setIsProcessingPayment(true);
    try {
      const res = await fetch("/api/tokenizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: displayOrder.orderNumber,
          totalPrice: displayOrder.finalTotal,
          items: displayOrder.items?.map((it: any) => ({
            id: it.product?.id || it.id,
            name: it.product?.name || "Produk",
            price: it.priceAtTime,
            quantity: it.quantity,
          })) || [],
          paymentType: "online",
          shippingInfo: {
            name: displayOrder.customerName,
            phone: displayOrder.phone,
            address: displayOrder.address,
            city: displayOrder.city,
            province: displayOrder.province,
          }
        })
      });
      const data = await res.json();
      if (data.token && (window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: () => fetchOrderDetail(),
          onPending: () => fetchOrderDetail(),
          onError: () => fetchOrderDetail(),
          onClose: () => fetchOrderDetail(),
        });
      } else if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch (e) {
      console.error("Pay error:", e);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-6">
        
        {/* Header Transaksi */}
        <header className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#51000d] mb-1">
              Status Transaksi
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#51000d]/10 text-[#51000d] text-xs rounded font-extrabold">
                {displayOrder.orderNumber}
              </span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              <p className="text-xs text-gray-500 font-medium">ID Pesanan Anda</p>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Tanggal Transaksi</p>
            <p className="font-bold text-sm text-gray-800">{formattedDate}</p>
          </div>
        </header>

        {/* PAYMENT STATUS ALERT BANNER */}
        {isPending && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-2xl">pending_actions</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
                    Belum Dibayar
                  </span>
                  <span className="text-xs text-white/90">Batas Waktu: 23:59:59</span>
                </div>
                <h3 className="text-base font-bold mt-0.5">Pesanan Anda Menunggu Pembayaran</h3>
                <p className="text-xs text-white/80">
                  Total Tagihan: <span className="font-extrabold text-white">Rp {formatPrice(displayOrder.finalTotal)}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleMidtransPay}
              disabled={isProcessingPayment}
              className="w-full sm:w-auto px-6 py-3 bg-white text-[#51000d] hover:bg-amber-50 rounded-xl text-xs font-black shadow-md transition-all uppercase tracking-wider cursor-pointer shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">payments</span>
              <span>{isProcessingPayment ? "Memuat Midtrans..." : "Bayar Sekarang (Midtrans)"}</span>
            </button>
          </div>
        )}

        {isPaid && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl p-5 shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <div>
              <h3 className="text-sm font-bold">Pembayaran Berhasil!</h3>
              <p className="text-xs text-white/90">Pesanan Anda telah dikonfirmasi dan sedang disiapkan oleh tim Bakso Pak Mul.</p>
            </div>
          </div>
        )}

        {isCanceled && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">cancel</span>
            </div>
            <div>
              <h3 className="text-sm font-bold">Pesanan Ini Telah Dibatalkan</h3>
              <p className="text-xs text-red-600">Pesanan ini dibatalkan oleh Admin atau batas waktu pembayaran telah berakhir.</p>
            </div>
          </div>
        )}

        {/* Status Timeline Progress */}
        <section className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            {/* Step 1: Pesanan Diterima */}
            <div className="flex flex-col items-center text-center gap-2 w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                  activeStep >= 1 ? "bg-[#51000d] text-white" : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                <span className="material-symbols-outlined text-base">check</span>
              </div>
              <div>
                <p className={`font-semibold text-xs ${activeStep >= 1 ? "text-[#51000d]" : "text-gray-400"}`}>
                  Pesanan Diterima
                </p>
              </div>
            </div>

            {/* Step 2: Sedang Dikemas */}
            <div className="flex flex-col items-center text-center gap-2 w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeStep >= 2 ? "bg-[#51000d] text-white" : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
              </div>
              <div>
                <p className={`font-semibold text-xs ${activeStep >= 2 ? "text-[#51000d]" : "text-gray-400"}`}>
                  Sedang Dikemas
                </p>
              </div>
            </div>

            {/* Step 3: Dalam Pengiriman */}
            <div className="flex flex-col items-center text-center gap-2 w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeStep >= 3 ? "bg-[#51000d] text-white" : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                <span className="material-symbols-outlined text-base">local_shipping</span>
              </div>
              <div>
                <p className={`font-semibold text-xs ${activeStep >= 3 ? "text-[#51000d]" : "text-gray-400"}`}>
                  Dalam Pengiriman
                </p>
              </div>
            </div>

            {/* Step 4: Sampai Tujuan */}
            <div className="flex flex-col items-center text-center gap-2 w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeStep === 4 ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                <span className="material-symbols-outlined text-base">home</span>
              </div>
              <div>
                <p className={`font-semibold text-xs ${activeStep === 4 ? "text-green-700" : "text-gray-400"}`}>
                  Sampai Tujuan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Detail Pesanan */}
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-xs font-bold text-[#51000d] uppercase tracking-widest">Detail Pesanan</h2>
                <span className="px-2.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600">
                  {displayOrder.items.length} ITEMS
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {displayOrder.items.map((item: any, idx: number) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 p-5 items-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden relative">
                      <img
                        alt={item.product?.name || "Produk"}
                        className="w-full h-full object-contain p-1"
                        src={item.product?.image || "/images/saos-pedas-lima-delapan.jpg"}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-xs text-gray-900">{item.product?.name || item.productName || "Produk Bakso Pak Mul"}</h3>
                        <p className="text-[10px] text-gray-500 font-medium">{item.product?.unit || "Kemasan"}</p>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {item.quantity} x Rp {formatPrice(item.priceAtTime || item.productPrice || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-[#51000d]">
                        Rp {formatPrice((item.priceAtTime || item.productPrice || 0) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Side: Informasi Pengiriman */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <span className="material-symbols-outlined text-[#51000d] text-lg">location_on</span>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Informasi Pengiriman</h2>
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Penerima</p>
                  <p className="font-bold text-gray-900">{displayOrder.customerName}</p>
                  <p className="text-gray-500">{displayOrder.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Alamat Lengkap</p>
                  <p className="text-gray-700 leading-relaxed">{displayOrder.address}</p>
                </div>
              </div>

              {/* Total Tagihan */}
              <div className="border-t border-gray-100 pt-4 flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-500">Total Pembayaran</span>
                <span className="text-xl font-black text-[#51000d]">
                  Rp {formatPrice(displayOrder.finalTotal)}
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* RE-PAY PAYMENT MODAL ON TRACK ORDER PAGE */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-3 md:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col border border-gray-100 my-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#51000d] to-[#7a0019] text-white p-4 sm:p-5 relative">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-amber-300 text-base">verified</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                      Bayar Ulang Pesanan
                    </span>
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Rp {formatPrice(displayOrder.finalTotal)}</h2>
                  <p className="text-[11px] text-white/80 font-medium mt-0.5">
                    No. Pesanan: <span className="font-mono font-bold text-amber-300">{displayOrder.orderNumber}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/80 p-1 gap-1">
              <button
                onClick={() => setActivePaymentTab("qris")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePaymentTab === "qris"
                    ? "bg-white text-[#51000d] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span className="material-symbols-outlined text-base">qr_code_2</span>
                <span>QRIS &amp; E-Wallet</span>
              </button>
              <button
                onClick={() => setActivePaymentTab("va")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePaymentTab === "va"
                    ? "bg-white text-[#51000d] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span className="material-symbols-outlined text-base">account_balance</span>
                <span>Virtual Account</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4">
              {activePaymentTab === "qris" && (
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3.5 bg-white rounded-2xl border-2 border-[#51000d]/20 shadow-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                        "00020101021226670016COM.GO-JEK.WWW0118936009143000000000021520260731000000153033605802ID5913BAKSO PAK MUL6013JAKARTA TIMUR61051331062070703A0163044F2A"
                      )}`}
                      alt="Kode QRIS Resmi Bakso Pak Mul"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-900">Scan QRIS via GoPay / ShopeePay / Banking</p>
                </div>
              )}

              {activePaymentTab === "va" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["BCA", "Mandiri", "BNI", "BRI"] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBank(b)}
                        className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          selectedBank === b
                            ? "bg-[#51000d] text-white border-[#51000d]"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <span className="text-[11px] font-bold text-gray-500">Nomor VA {selectedBank}</span>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-300">
                      <span className="font-mono text-base font-black text-gray-900">
                        {vaNumbers[selectedBank]}
                      </span>
                      <button
                        onClick={() => handleCopy(vaNumbers[selectedBank], selectedBank)}
                        className="px-3 py-1 bg-[#51000d] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        {copiedText === selectedBank ? "Tercopy!" : "Salin"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-6 py-2.5 bg-[#51000d] text-white rounded-xl text-xs font-bold shadow-sm uppercase tracking-wider cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
