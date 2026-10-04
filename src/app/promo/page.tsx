"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function PromoPage() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(8 * 3600 + 45 * 60 + 30); // 08:45:30

  // Realtime countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return { h, m, s };
  };

  const timer = formatTimer(timeLeft);

  const handleAddBundle = (product: {
    id: string;
    name: string;
    price: number;
    image: string;
    unit: string;
  }) => {
    addToCart(product);
    setAddedId(product.id);
    setToastMessage(product.name);
    setTimeout(() => setAddedId(null), 1500);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917] font-sans antialiased flex flex-col justify-between selection:bg-[#51000d] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c0306] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border border-[#e5a93c]/40 text-xs font-semibold">
          <span className="material-symbols-outlined text-[#e5a93c]">check_circle</span>
          <span>{toastMessage} ditambahkan ke keranjang!</span>
        </div>
      )}

      <main className="pt-20 sm:pt-24 flex-grow">
        {/* ========================================================================= */}
        {/* ARTISAN PROMO HERO BANNER (MATCHING THE ARTISAN POSTER LAYOUT)            */}
        {/* ========================================================================= */}
        <section className="relative bg-[#1c0306] text-white py-16 sm:py-24 overflow-hidden border-b border-[#420812]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,169,60,0.15)_0%,_transparent_70%)] pointer-events-none" />

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e5a93c]/20 text-[#e5a93c] border border-[#e5a93c]/30 text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="material-symbols-outlined text-sm">local_offer</span>
              <span>PENAWARAN KHUSUS &amp; HARGA GROSIR</span>
            </div>

            <div className="relative inline-block my-2">
              <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl uppercase text-white tracking-tight leading-tight">
                PROMO SPESIAL &amp; PAKET MITRA
              </h1>
              <span className="font-script text-3xl sm:text-5xl md:text-6xl text-[#fcd34d] absolute -top-4 sm:-top-7 right-0 rotate-[-5deg] pointer-events-none drop-shadow-md">
                Harga Sahabat
              </span>
            </div>

            <p className="max-w-2xl mx-auto text-[#fef3c7] text-xs sm:text-sm mt-3 font-semibold leading-relaxed">
              Paket hemat bahan baku bakso sapi murni, mie basah telor bebek, dan bumbu kaldu khas Pasar Kramat Jati untuk kebutuhan hajatan, keluarga besar, serta gerobak mitra kuliner se-Jabodetabek.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
              <a
                href="#paket-reseller"
                className="px-7 py-3.5 rounded-full bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306] font-black text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105"
              >
                Lihat Paket Reseller
              </a>
              <a
                href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20tertarik%20konsultasi%20paket%20reseller"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-emerald-400 text-base">chat</span>
                <span>Konsultasi Grosir via WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PAKET BUNDLE RESELLER (BENTO CARD ARTISAN STYLE)                          */}
        {/* ========================================================================= */}
        <section id="paket-reseller" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7a0019]">
                HEMAT BERKELANJUTAN
              </span>
              <h2 className="font-headline text-3xl sm:text-5xl text-[#1c1917] tracking-tight uppercase mt-1">
                PAKET BUNDLE USAHA &amp; RESELLER
              </h2>
              <p className="text-[#2b1b17] text-xs sm:text-sm font-medium mt-1">
                Solusi praktis dan hemat untuk memasok warung makan atau memulai usaha kuliner Anda.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#51000d]/10 text-[#51000d] border border-[#51000d]/20 text-xs font-extrabold">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>Penawaran Khusus Terbatas</span>
            </div>
          </div>

          {/* Bundle Bento Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-xl border-2 border-stone-200 hover:border-[#e5a93c] transition-all duration-300 flex flex-col lg:flex-row gap-10 items-center">
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute top-4 left-4 z-10 bg-[#e5a93c] text-[#1c0306] px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm font-bold">verified</span>
                <span>PALING HEMAT</span>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-[#1c0306] border-2 border-stone-200">
                <img
                  alt="Starter Pack Reseller"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="/images/hero-banner.webp"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#7a0019] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                PAKET PERDANA USAHA
              </span>
              <h3 className="font-headline text-3xl sm:text-4xl uppercase text-[#1c1917] mt-2 mb-4 tracking-tight">
                Starter Pack Warung &amp; Reseller
              </h3>
              <div className="space-y-3 mb-6 font-medium text-xs sm:text-sm text-[#2b1b17]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#7a0019] text-xl">inventory_2</span>
                  <span>Bakso Sapi Halus Super (10 Kg / ±500 Butir)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#7a0019] text-xl">soup_kitchen</span>
                  <span>Bumbu Ekstrak Sumsum Rempah Sapi (5 Botol @250g)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#7a0019] text-xl">restaurant</span>
                  <span>Mie Basah Telor Bebek Super (5 Kg / ±55 Porsi)</span>
                </div>
              </div>

              <div className="mb-6 p-5 bg-[#faf7f2] rounded-2xl border-2 border-stone-200">
                <p className="text-stone-500 text-xs font-bold line-through mb-0.5">Harga Normal: Rp 1.500.000</p>
                <div className="flex items-baseline gap-3">
                  <span className="font-headline text-3xl sm:text-4xl text-[#7a0019]">Rp 1.250.000</span>
                  <span className="text-emerald-800 font-extrabold text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    HEMAT 17%
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  handleAddBundle({
                    id: "promo-bundle-starter",
                    name: "Starter Pack Reseller (10kg Bakso + Bumbu + Mie)",
                    price: 1250000,
                    image: "/images/hero-banner.webp",
                    unit: "Paket Bundle",
                  })
                }
                className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  addedId === "promo-bundle-starter"
                    ? "bg-emerald-700 text-white"
                    : "bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306]"
                }`}
              >
                <span className="material-symbols-outlined text-lg font-bold">
                  {addedId === "promo-bundle-starter" ? "check" : "shopping_basket"}
                </span>
                <span>
                  {addedId === "promo-bundle-starter" ? "Berhasil Masuk Keranjang!" : "Pesan Paket Reseller Ini"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FLASH SALE PENAWARAN HARIAN                                               */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#7a0019] text-2xl font-bold">
                    local_fire_department
                  </span>
                  <h2 className="font-headline text-3xl sm:text-4xl text-[#1c1917] uppercase tracking-tight">
                    FLASH SALE HARIAN
                  </h2>
                </div>
                <p className="text-[#2b1b17] text-xs sm:text-sm font-medium">
                  Stok potongan harga terbatas setiap hari, diproses segar dari kios Pasar Kramat Jati.
                </p>
              </div>

              {/* Realtime Countdown Timer Blocks */}
              <div className="flex items-center gap-3 bg-[#faf7f2] p-2.5 px-4 rounded-2xl border-2 border-stone-200">
                <span className="text-xs font-black text-[#51000d] uppercase tracking-wider">Berakhir:</span>
                <div className="flex gap-1.5">
                  <div className="w-10 h-10 bg-[#51000d] text-[#e5a93c] rounded-xl flex flex-col items-center justify-center shadow-xs">
                    <span className="font-headline text-sm font-bold">{timer.h}</span>
                    <span className="text-[7px] uppercase font-bold text-white">Jam</span>
                  </div>
                  <div className="w-10 h-10 bg-[#51000d] text-[#e5a93c] rounded-xl flex flex-col items-center justify-center shadow-xs">
                    <span className="font-headline text-sm font-bold">{timer.m}</span>
                    <span className="text-[7px] uppercase font-bold text-white">Min</span>
                  </div>
                  <div className="w-10 h-10 bg-[#51000d] text-[#e5a93c] rounded-xl flex flex-col items-center justify-center shadow-xs">
                    <span className="font-headline text-sm font-bold">{timer.s}</span>
                    <span className="text-[7px] uppercase font-bold text-white">Det</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flash Sale Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1 */}
              <div className="bg-[#faf7f2] rounded-3xl overflow-hidden border-2 border-stone-200 hover:border-[#e5a93c] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-56 relative bg-[#1c0306] overflow-hidden">
                    <div className="absolute top-3 right-3 z-10 bg-[#51000d] text-[#e5a93c] px-3 py-0.5 rounded-full text-xs font-black uppercase shadow">
                      DISKON 25%
                    </div>
                    <img
                      alt="Bakso Halus Super Essem"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      src="/images/bakso-super-essem.webp"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline text-lg uppercase text-[#1c1917] mb-1">
                      Bakso Halus Super (50 Butir)
                    </h3>
                    <p className="text-xs text-[#2b1b17] font-medium mb-3">
                      Bakso daging sapi halus bertekstur empuk kenyal pas untuk anak-anak dan hajatan.
                    </p>

                    <div className="mb-3">
                      <span className="text-stone-500 text-xs line-through block font-semibold">Rp 58.000</span>
                      <span className="font-headline text-2xl text-[#7a0019]">Rp 43.500</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-[#51000d]">
                        <span>Terjual 82%</span>
                        <span>Sisa 12 Pack</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div className="w-[82%] h-full bg-[#7a0019] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() =>
                      handleAddBundle({
                        id: "promo-halus-50",
                        name: "Bakso Halus Super (50 Butir)",
                        price: 43500,
                        image: "/images/bakso-super-essem.webp",
                        unit: "50 Butir / Pack",
                      })
                    }
                    className={`w-full py-3 rounded-full font-black text-xs uppercase tracking-wider shadow transition-all cursor-pointer ${
                      addedId === "promo-halus-50"
                        ? "bg-emerald-700 text-white"
                        : "bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306]"
                    }`}
                  >
                    {addedId === "promo-halus-50" ? "✓ Berhasil!" : "Pesan Promo Flash"}
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#faf7f2] rounded-3xl overflow-hidden border-2 border-stone-200 hover:border-[#e5a93c] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-56 relative bg-[#1c0306] overflow-hidden">
                    <div className="absolute top-3 right-3 z-10 bg-[#51000d] text-[#e5a93c] px-3 py-0.5 rounded-full text-xs font-black uppercase shadow">
                      DISKON 20%
                    </div>
                    <img
                      alt="Kulit Pangsit Spesial"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      src="/images/kulit-pangsit-spesial-rebus-dan-goreng.webp"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline text-lg uppercase text-[#1c1917] mb-1">
                      Kulit Pangsit Renyah (500g)
                    </h3>
                    <p className="text-xs text-[#2b1b17] font-medium mb-3">
                      Kulit pangsit tipis lentur, sangat renyah saat digoreng dan gurih saat direbus.
                    </p>

                    <div className="mb-3">
                      <span className="text-stone-500 text-xs line-through block font-semibold">Rp 18.000</span>
                      <span className="font-headline text-2xl text-[#7a0019]">Rp 14.400</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-[#51000d]">
                        <span>Terjual 60%</span>
                        <span>Sisa 20 Pack</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div className="w-[60%] h-full bg-[#7a0019] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() =>
                      handleAddBundle({
                        id: "promo-pangsit-500g",
                        name: "Kulit Pangsit Renyah (500g)",
                        price: 14400,
                        image: "/images/kulit-pangsit-spesial-rebus-dan-goreng.webp",
                        unit: "500 Gram",
                      })
                    }
                    className={`w-full py-3 rounded-full font-black text-xs uppercase tracking-wider shadow transition-all cursor-pointer ${
                      addedId === "promo-pangsit-500g"
                        ? "bg-emerald-700 text-white"
                        : "bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306]"
                    }`}
                  >
                    {addedId === "promo-pangsit-500g" ? "✓ Berhasil!" : "Pesan Promo Flash"}
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#faf7f2] rounded-3xl overflow-hidden border-2 border-stone-200 hover:border-[#e5a93c] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-56 relative bg-[#1c0306] overflow-hidden">
                    <div className="absolute top-3 right-3 z-10 bg-[#51000d] text-[#e5a93c] px-3 py-0.5 rounded-full text-xs font-black uppercase shadow">
                      DISKON 15%
                    </div>
                    <img
                      alt="Bumbu Kuah Kaldu Rempah"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      src="/images/bumbu-kuah-bakso.webp"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline text-lg uppercase text-[#1c1917] mb-1">
                      Bumbu Kuah Kaldu Sapi (250g)
                    </h3>
                    <p className="text-xs text-[#2b1b17] font-medium mb-3">
                      Sari ekstrak sumsum sapi dengan tumisan bawang putih harum, menghasilkan kuah sedap.
                    </p>

                    <div className="mb-3">
                      <span className="text-stone-500 text-xs line-through block font-semibold">Rp 22.000</span>
                      <span className="font-headline text-2xl text-[#7a0019]">Rp 18.700</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-[#51000d]">
                        <span>Terjual 90%</span>
                        <span>Sisa 5 Botol</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div className="w-[90%] h-full bg-[#7a0019] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() =>
                      handleAddBundle({
                        id: "promo-bumbu-250g",
                        name: "Bumbu Kuah Kaldu Sapi (250g)",
                        price: 18700,
                        image: "/images/bumbu-kuah-bakso.webp",
                        unit: "250 Gram / Botol",
                      })
                    }
                    className={`w-full py-3 rounded-full font-black text-xs uppercase tracking-wider shadow transition-all cursor-pointer ${
                      addedId === "promo-bumbu-250g"
                        ? "bg-emerald-700 text-white"
                        : "bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306]"
                    }`}
                  >
                    {addedId === "promo-bumbu-250g" ? "✓ Berhasil!" : "Pesan Promo Flash"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}