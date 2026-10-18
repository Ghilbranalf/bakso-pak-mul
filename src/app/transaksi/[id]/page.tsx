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
  const [pendingAutoPay, setPendingAutoPay] = useState(false);

  // Re-pay Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<"qris" | "va">("qris");
  const [selectedBank, setSelectedBank] = useState<"BCA" | "Mandiri" | "BNI" | "BRI">("BCA");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [paymentResultModal, setPaymentResultModal] = useState<"success" | "failed" | null>(null);

  const fetchOrderDetail = async () => {
    if (!rawId) return null;
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(rawId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          return data.order;
        }
      }
    } catch (err) {
      console.error("Failed to load order detail:", err);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    fetchOrderDetail();

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const statusParam = urlParams.get("status") || urlParams.get("transaction_status");
      const isCreated = urlParams.get("created") === "true";
      const isAutoPay = urlParams.get("auto_pay") === "true";

      if (isCreated) {
        setPaymentResultModal("success");
      } else if (statusParam === "success" || statusParam === "settlement" || statusParam === "capture") {
        setPaymentResultModal("success");
      } else if (statusParam === "failed" || statusParam === "deny" || statusParam === "expire" || statusParam === "cancel") {
        setPaymentResultModal("failed");
      }

      // Mark auto_pay as pending: actual payment modal will open
      // once order data is loaded from DB (see useEffect below)
      if (isAutoPay) {
        setPendingAutoPay(true);
      }

      if (window.location.search.includes("print=true")) {
        setTimeout(() => {
          window.print();
        }, 800);
      }
    }
  }, [rawId]);

  // Auto-pay: wait until real order is loaded, then open payment modal with correct amount
  useEffect(() => {
    if (pendingAutoPay && order && order.finalTotal > 0) {
      setPendingAutoPay(false);
      handleMidtransPay();
    }
  }, [pendingAutoPay, order]);

  useEffect(() => {
    let interval: any;
    if (isPaymentModalOpen || (order && order.status === "AWAITING_PAYMENT")) {
      interval = setInterval(async () => {
        const updated = await fetchOrderDetail();
        if (updated && (updated.status === "PAID" || updated.status === "SETTLEMENT")) {
          setIsPaymentModalOpen(false);
          setPaymentResultModal("success");
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaymentModalOpen, rawId, order?.status]);

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

  const isCod = (displayOrder.paymentType || "").toUpperCase() === "COD";
  const isPending = !isCod && (statusUpper === "PENDING" || statusUpper === "AWAITING_PAYMENT");
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

  // Auto-push / open WhatsApp directly when Success Modal opens
  useEffect(() => {
    if (paymentResultModal === "success") {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") {
          const waMessage = encodeURIComponent(
            `Halo CS Bakso Pak Mul, saya baru saja membuat pesanan ${displayOrder.orderNumber}:\n\n` +
            `Atas Nama: ${displayOrder.customerName}\n` +
            `No HP: ${displayOrder.phone}\n` +
            `Alamat: ${displayOrder.address}\n` +
            `Total Tagihan: Rp ${formatPrice(displayOrder.finalTotal)}\n` +
            `Metode Pembayaran: ${displayOrder.paymentType || "COD"}\n\n` +
            `Mohon segera diproses dan dikirim ya Pak Mul, terima kasih!`
          );
          window.open(`https://wa.me/6281298980252?text=${waMessage}`, "_blank");
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [paymentResultModal, displayOrder.orderNumber]);

  const vaNumbers = {
    BCA: "880128829102",
    Mandiri: "893208829102",
    BNI: "881008829102",
    BRI: "880888829102",
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [liveQrisUrl, setLiveQrisUrl] = useState<string>("");
  const [liveVaNumbers, setLiveVaNumbers] = useState<Record<string, string>>({});
  const [isChargingCoreApi, setIsChargingCoreApi] = useState(false);

  const fetchCoreApiCharge = async (paymentType: string, bankName?: string) => {
    // CRITICAL: Only use real order data from DB, never fallback demo data
    const realOrder = order;
    if (!realOrder || !realOrder.orderNumber || !realOrder.finalTotal) {
      console.warn("fetchCoreApiCharge called before order loaded from DB, skipping");
      return;
    }
    setIsChargingCoreApi(true);
    try {
      if (paymentType === "qris") {
        const res = await fetch(
          `/api/payment/qris?orderNumber=${encodeURIComponent(realOrder.orderNumber)}&amount=${realOrder.finalTotal}`
        );
        const data = await res.json();
        if (data.success && data.qrCodeUrl) {
          setLiveQrisUrl(data.qrCodeUrl);
        }
      } else {
        const res = await fetch("/api/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: realOrder.orderNumber,
            grossAmount: realOrder.finalTotal,
            paymentType,
            bank: bankName ? bankName.toLowerCase() : undefined,
          }),
        });
        const data = await res.json();
        if (data.success && bankName && data.vaNumber) {
          setLiveVaNumbers((prev) => ({
            ...prev,
            [bankName]: data.vaNumber,
          }));
        }
      }
    } catch (err) {
      console.error("QRIS / Core API Charge fetch error:", err);
    } finally {
      setIsChargingCoreApi(false);
    }
  };

  useEffect(() => {
    if (isPaymentModalOpen) {
      if (activePaymentTab === "qris" && !liveQrisUrl) {
        fetchCoreApiCharge("qris");
      } else if (activePaymentTab === "va" && !liveVaNumbers[selectedBank]) {
        fetchCoreApiCharge("bank_transfer", selectedBank);
      }
    }
  }, [isPaymentModalOpen, activePaymentTab, selectedBank, displayOrder.orderNumber]);

  const handleMidtransPay = async () => {
    setIsPaymentModalOpen(true);
    fetchCoreApiCharge("qris");
    fetchCoreApiCharge("bank_transfer", selectedBank);
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-6">
        
        {/* TOP HEADER */}
        <header className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#51000d]">Status Transaksi</h1>
              <button
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Cetak Nota</span>
              </button>
            </div>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-2">
              <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">{displayOrder.orderNumber}</span>
              <span>•</span>
              <span>ID Pesanan Anda</span>
            </p>
          </div>
          <div className="text-left md:text-right pt-3 md:pt-0">
            <span className="text-xs font-semibold text-stone-400 block mb-0.5">Tanggal Transaksi</span>
            <span className="text-xs font-bold text-stone-800">{formattedDate}</span>
          </div>
        </header>

        {/* COD PAYMENT STATUS BANNER */}
        {isCod && (
          <div className="bg-emerald-700 text-white rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-2xl">handshake</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                  Bayar di Tempat (COD)
                </span>
                <span className="text-xs text-emerald-100">Pesanan Siap Dikirim</span>
              </div>
              <h3 className="text-base font-bold mt-0.5">Pesanan COD Terkonfirmasi</h3>
              <p className="text-xs text-white/90">
                Silakan siapkan uang tunai pas sebesar <span className="font-extrabold text-white">Rp {formatPrice(displayOrder.finalTotal)}</span> saat kurir tiba di lokasi pengiriman Anda.
              </p>
            </div>
          </div>
        )}

        {/* PAYMENT STATUS ALERT BANNER */}
        {isPending && (
          <div className="bg-[#51000d] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 shrink-0">
                <span className="material-symbols-outlined text-2xl">pending_actions</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
                    Belum Dibayar
                  </span>
                  <span className="text-xs text-white/70">Batas Waktu: 23:59:59</span>
                </div>
                <h3 className="text-base font-bold mt-0.5">Pesanan Anda Menunggu Pembayaran</h3>
                <p className="text-xs text-white/80">
                  Total Tagihan: <span className="font-extrabold text-amber-300">Rp {formatPrice(displayOrder.finalTotal)}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleMidtransPay}
              disabled={isProcessingPayment}
              className="w-full sm:w-auto px-6 py-3 bg-amber-400 text-[#51000d] hover:bg-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">payments</span>
              <span>{isProcessingPayment ? "Memuat Midtrans..." : "Bayar Sekarang (Midtrans)"}</span>
            </button>
          </div>
        )}

        {isPaid && (
          <div className="bg-emerald-700 text-white rounded-2xl p-5 flex items-center gap-3">
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
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 flex items-center gap-3">
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
        <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Connecting Progress Bar Line */}
          <div className="absolute top-11 sm:top-[52px] left-[12.5%] right-[12.5%] h-1 bg-stone-100 z-0 rounded-full">
            <div
              className="h-full bg-[#51000d] transition-[width] duration-500 rounded-full"
              style={{
                width:
                  activeStep <= 1
                    ? "0%"
                    : activeStep === 2
                    ? "33.33%"
                    : activeStep === 3
                    ? "66.66%"
                    : "100%",
              }}
            ></div>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            {/* Step 1: Pesanan Diterima */}
            <div className="flex flex-col items-center text-center gap-2 w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeStep >= 1 ? "bg-[#51000d] text-white" : "bg-stone-100 text-stone-400 border border-stone-200"
                }`}
              >
                <span className="material-symbols-outlined text-base">check</span>
              </div>
              <div>
                <p className={`font-semibold text-xs ${activeStep >= 1 ? "text-[#51000d]" : "text-stone-400"}`}>
                  Pesanan Diterima
                </p>
              </div>
            </div>

            {/* Step 2: Sedang Dikemas */}
            <div className="flex flex-col items-center text-center gap-2 w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeStep >= 2 ? "bg-[#51000d] text-white" : "bg-stone-100 text-stone-400 border border-stone-200"
                }`}
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
              </div>
              <div>
                <p className={`font-semibold text-xs ${activeStep >= 2 ? "text-[#51000d]" : "text-stone-400"}`}>
                  Sedang Dikemas
                </p>
              </div>
            </div>

            {/* Step 3: Dalam Pengiriman */}
            <div className="flex flex-col items-center text-center gap-2 w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeStep >= 3 ? "bg-[#51000d] text-white" : "bg-stone-100 text-stone-400 border border-stone-200"
                }`}
              >
                <span className="material-symbols-outlined text-base">local_shipping</span>
              </div>
              <div>
                <p className={`font-semibold text-xs ${activeStep >= 3 ? "text-[#51000d]" : "text-stone-400"}`}>
                  Dalam Pengiriman
                </p>
              </div>
            </div>

            {/* Step 4: Sampai Tujuan */}
            <div className="flex flex-col items-center text-center gap-2 w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeStep === 4 ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-400 border border-stone-200"
                }`}
              >
                <span className="material-symbols-outlined text-base">home</span>
              </div>
              <div>
                <p className={`font-semibold text-xs ${activeStep === 4 ? "text-emerald-700" : "text-stone-400"}`}>
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
            <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="bg-stone-50 px-6 py-3.5 flex justify-between items-center">
                <h2 className="text-xs font-bold text-[#51000d]">Detail Pesanan</h2>
                <span className="px-2.5 py-0.5 bg-white border border-stone-200 rounded text-xs font-semibold text-stone-600">
                  {displayOrder.items.length} Item
                </span>
              </div>
              <div className="p-3 space-y-2">
                {displayOrder.items.map((item: any, idx: number) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 p-4 items-center bg-stone-50 rounded-xl">
                    <div className="w-16 h-16 rounded-xl bg-stone-100 flex-shrink-0 border border-stone-200 overflow-hidden relative">
                      <img
                        alt={item.product?.name || "Produk"}
                        className="w-full h-full object-contain p-1"
                        src={item.product?.image || "/images/saos-pedas-lima-delapan.jpg"}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-xs text-stone-900">{item.product?.name || item.productName || "Produk Bakso Pak Mul"}</h3>
                        <p className="text-[11px] text-stone-500 font-medium">{item.product?.unit || "Kemasan"}</p>
                      </div>
                      <p className="text-xs text-stone-500 font-medium mt-1">
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
            <section className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-1">
                <span className="material-symbols-outlined text-[#51000d] text-lg">location_on</span>
                <h2 className="text-xs font-bold text-stone-900">Informasi Pengiriman</h2>
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <p className="text-xs font-semibold text-stone-400">Penerima</p>
                  <p className="font-bold text-stone-900">{displayOrder.customerName}</p>
                  <p className="text-stone-500">{displayOrder.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-400">Alamat Lengkap</p>
                  <p className="text-stone-700 leading-relaxed">{displayOrder.address}</p>
                </div>
              </div>

              {/* Total Breakdown */}
              <div className="pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-stone-500 font-medium">
                  <span>Subtotal Produk</span>
                  <span>Rp {formatPrice(Math.max(0, displayOrder.finalTotal - (displayOrder.shippingCost || 0) - (displayOrder.uniqueCode || 0)))}</span>
                </div>
                <div className="flex justify-between text-stone-500 font-medium">
                  <span>Ongkos Kirim Ekspedisi</span>
                  <span>{displayOrder.shippingCost ? `Rp ${formatPrice(displayOrder.shippingCost)}` : "Rp 0 (Gratis / Standar)"}</span>
                </div>
                {Boolean(displayOrder.uniqueCode && displayOrder.uniqueCode > 0) && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/60 px-2 py-1 rounded-md border border-emerald-200/50">
                    <span>Kode Unik Verifikasi</span>
                    <span>+Rp {formatPrice(displayOrder.uniqueCode)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 mt-2 bg-stone-50 p-3 rounded-xl">
                  <span className="font-bold text-stone-900">Total Pembayaran</span>
                  <span className="text-xl font-black text-[#51000d]">
                    Rp {formatPrice(displayOrder.finalTotal)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* RE-PAY PAYMENT MODAL ON TRACK ORDER PAGE */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 z-[70] flex items-center justify-center p-3 md:p-4 overflow-y-auto">
          <div data-ui className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col border border-stone-200 my-auto">
            {/* Modal Header */}
            <div data-ui className="bg-[#200407] text-white p-4 sm:p-5 relative border-b border-stone-800">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-stone-300 block mb-1">
                    Bayar Ulang Pesanan
                  </span>
                  <h2 className="font-headline text-xl font-bold tracking-tight text-white">Rp {formatPrice(displayOrder.finalTotal)}</h2>
                  <p className="text-xs text-stone-300 font-medium mt-0.5">
                    No. Pesanan: <span className="font-semibold text-white">{displayOrder.orderNumber}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body: QRIS Only */}
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-between gap-2 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 w-full text-xs">
                  <span className="font-bold text-[#7a0019]">QRIS GPN Resmi</span>
                  <span className="text-[10px] font-semibold text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded">
                    NMID: ID1026563066301
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 min-h-[220px] flex items-center justify-center relative w-full">
                  {isChargingCoreApi && !liveQrisUrl ? (
                    <div className="flex flex-col items-center gap-2 text-xs text-stone-500 font-medium py-10">
                      <div className="w-8 h-8 border-3 border-[#7a0019] border-t-transparent rounded-full animate-spin"></div>
                      <span>Memuat QRIS Dinamis Bakso Pak Mul...</span>
                    </div>
                  ) : (
                    <img
                      src={
                        liveQrisUrl ||
                        `/api/payment/qris?orderNumber=${encodeURIComponent(displayOrder.orderNumber)}&amount=${displayOrder.finalTotal}`
                      }
                      alt="Kode QRIS Dinamis Bakso Pak Mul"
                      className="w-60 h-60 object-contain rounded-lg p-1 mx-auto"
                    />
                  )}
                </div>

                <div className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-stone-800 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-200 w-full">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7a0019]"></span>
                    <span>Transfer Tepat: Rp {formatPrice(displayOrder.finalTotal)}</span>
                  </div>
                  {Boolean(displayOrder.uniqueCode && displayOrder.uniqueCode > 0) && (
                    <p className="text-[10px] font-normal text-stone-600">
                      Termasuk kode unik (<span className="font-semibold">+{displayOrder.uniqueCode}</span>) untuk verifikasi otomatis.
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 font-medium">
                  Scan via GoPay, OVO, DANA, ShopeePay, BCA, Mandiri, atau m-Banking Anda.
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div data-ui className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end gap-2">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-5 py-2.5 bg-[#7a0019] hover:bg-[#51000d] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTION SUCCESS POP-UP MODAL */}
      {paymentResultModal === "success" && (
        <div className="fixed inset-0 bg-stone-950/70 z-[100] flex items-center justify-center p-4">
          <main className="w-full max-w-md mx-auto">
            <div data-ui className="bg-white rounded-xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200">
              {/* Subtle Background Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>

              {/* Success Icon Container */}
              <div className="w-16 h-16 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mb-4 shrink-0">
                <span className="material-symbols-outlined text-3xl">
                  task_alt
                </span>
              </div>

              {/* Headlines */}
              <h1 className="font-headline text-2xl font-bold text-[#1c1917] mb-2 tracking-tight uppercase">
                {isCod ? "Pesanan COD Terkonfirmasi" : "Transaksi Berhasil"}
              </h1>
              <p className="font-editorial text-sm text-stone-600 mb-6 max-w-[280px]">
                {isCod
                  ? "Pesanan Anda berhasil dikirim ke dapur toko. Siapkan uang tunai pas saat kurir tiba."
                  : "Terima kasih! Pembayaran Anda telah terverifikasi lunas & otomatis diproses di dapur."}
              </p>

              {/* Details Box */}
              <div className="w-full bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200 text-left">
                <div className="flex justify-between items-center mb-2 pb-2">
                  <span className="text-xs text-stone-500 font-medium">ID Transaksi</span>
                  <span className="text-xs font-bold text-stone-900">{displayOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500 font-medium">Jumlah Total</span>
                  <span className="font-headline text-lg font-bold text-[#7a0019]">Rp {formatPrice(displayOrder.finalTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col gap-3">
                <a
                  href={`https://wa.me/6281298980252?text=${encodeURIComponent(
                    `Halo CS Bakso Pak Mul, pesanan ${displayOrder.orderNumber} sebesar Rp ${formatPrice(displayOrder.finalTotal)} sudah dikonfirmasi. Mohon diproses ya!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-700 text-white py-3 px-6 rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  Kirim Ke WhatsApp CS
                </a>

                <button
                  onClick={() => setPaymentResultModal(null)}
                  className="w-full bg-white border border-stone-200 text-stone-800 py-3 px-6 rounded-xl text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                  Lihat Detail Nota Pesanan
                </button>
              </div>

              <button
                onClick={() => setPaymentResultModal(null)}
                className="mt-6 text-xs text-stone-500 hover:text-stone-900 underline transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </main>
        </div>
      )}

      {/* TRANSACTION FAILED POP-UP MODAL */}
      {paymentResultModal === "failed" && (
        <div className="fixed inset-0 bg-stone-950/70 z-[100] flex items-center justify-center p-4">
          <main className="w-full max-w-md mx-auto">
            <div data-ui className="bg-white rounded-xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200">
              {/* Subtle Background Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ba1a1a]"></div>

              {/* Error Icon Container */}
              <div className="w-16 h-16 bg-red-100 text-[#7a0019] rounded-2xl flex items-center justify-center mb-4 shrink-0">
                <span className="material-symbols-outlined text-3xl">
                  error_outline
                </span>
              </div>

              {/* Headlines */}
              <h1 className="font-headline text-2xl font-bold text-[#1c1917] mb-2 tracking-tight uppercase">
                Transaksi Belum Berhasil
              </h1>
              <p className="font-editorial text-sm text-stone-600 mb-6 max-w-[280px]">
                Pembayaran tidak dapat diproses karena waktu transaksi telah habis. Silakan coba lagi.
              </p>

              {/* Details Box */}
              <div className="w-full bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200 text-left">
                <div className="flex justify-between items-center mb-2 pb-2">
                  <span className="text-xs text-stone-500 font-medium">ID Transaksi</span>
                  <span className="text-xs font-bold text-stone-900">{displayOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500 font-medium">Jumlah</span>
                  <span className="font-headline text-lg font-bold text-stone-900">Rp {formatPrice(displayOrder.finalTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={() => {
                    setPaymentResultModal(null);
                    handleMidtransPay();
                  }}
                  className="w-full bg-[#7a0019] text-white py-3 px-6 rounded-xl text-xs font-semibold hover:bg-[#51000d] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    refresh
                  </span>
                  Coba Lagi
                </button>

                <a
                  href={`https://wa.me/6281298980252?text=${encodeURIComponent(
                    `Halo CS Bakso Pak Mul, transaksi saya ${displayOrder.orderNumber} belum dapat diselesaikan. Mohon bantuan panduannya ya.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white border border-stone-300 text-stone-800 py-3.5 px-6 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    support_agent
                  </span>
                  Hubungi Bantuan
                </a>
              </div>

              <button
                onClick={() => setPaymentResultModal(null)}
                className="mt-6 text-xs text-gray-500 hover:text-gray-900 underline transition-colors cursor-pointer"
              >
                Kembali ke Detail Pesanan
              </button>
            </div>
          </main>
        </div>
      )}

      <Footer />
    </div>
  );
}
