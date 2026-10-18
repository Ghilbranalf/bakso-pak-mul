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
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-sans antialiased flex flex-col justify-between selection:bg-[#51000d] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#200407] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border border-stone-800 text-xs font-semibold">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span>{toastMessage} ditambahkan ke keranjang!</span>
        </div>
      )}

      <main className="pt-20 sm:pt-24 flex-grow">
        {/* ========================================================================= */}
        {/* ARTISAN PROMO HERO BANNER                                                 */}
        {/* ========================================================================= */}
        <section className="bg-[#200407] text-white py-16 sm:py-24 border-b border-stone-800">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400 block">
              Penawaran Khusus &amp; Harga Grosir
            </span>

            <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight leading-tight">
              Promo Spesial &amp; Paket Mitra
            </h1>

            <p className="font-editorial text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto font-normal leading-relaxed pt-1">
              Paket hemat bahan baku bakso sapi murni, mie basah telor bebek, dan bumbu kaldu khas Pasar Kramat Jati untuk kebutuhan hajatan, keluarga besar, serta gerobak mitra kuliner se-Jabodetabek.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <a
                href="#paket-reseller"
                className="px-6 py-3 rounded-xl bg-[#7a0019] hover:bg-[#51000d] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
              >
                Lihat Paket Reseller
              </a>
              <a
                href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20tertarik%20konsultasi%20paket%20reseller"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors flex items-center gap-2"
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
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-stone-200 flex flex-col lg:flex-row gap-10 items-center">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute top-4 left-4 z-10 bg-[#200407]/90 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-400">verified</span>
                <span>Paling Hemat</span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xs bg-stone-100 border border-stone-200">
                <img
                  alt="Starter Pack Reseller"
                  className="w-full h-full object-cover"
                  src="/images/hero-banner.webp"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a0019] bg-stone-100 px-2.5 py-1 rounded">
                Paket Perdana Usaha
              </span>
              <h3 className="font-headline text-2xl sm:text-3xl font-bold text-[#1c1917] mt-2 mb-4 tracking-tight">
                Starter Pack Warung &amp; Reseller
              </h3>
              <div className="space-y-3 mb-6 font-editorial text-xs sm:text-sm text-stone-700">
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

              <div className="mb-6 p-4 bg-[#faf8f5] rounded-xl border border-stone-200">
                <p className="text-stone-400 text-xs font-medium line-through mb-0.5">Harga Normal: Rp 1.500.000</p>
                <div className="flex items-baseline gap-3">
                  <span className="font-headline font-bold text-3xl sm:text-4xl text-[#7a0019]">Rp 1.250.000</span>
                  <span className="text-emerald-800 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded">
                    Hemat Rp 250.000
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
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  addedId === "promo-bundle-starter"
                    ? "bg-emerald-700 text-white"
                    : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
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
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a0019] block mb-1">
                  Penawaran Harian
                </span>
                <h2 className="font-headline text-2xl sm:text-4xl font-bold text-[#1c1917] tracking-tight">
                  Paket Segar Pilihan Kios
                </h2>
                <p className="font-editorial text-stone-600 text-xs sm:text-sm mt-1">
                  Stok potongan harga terbatas setiap hari, diproses segar dari kios Pasar Kramat Jati.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold self-start md:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Stok Diperbarui Subuh Tadi</span>
              </div>
            </div>

            {/* Flash Sale Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1 */}
              <div className="bg-[#faf8f5] rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:border-[#7a0019]/40 transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="h-56 relative bg-stone-100 overflow-hidden">
                    <div className="absolute top-3 right-3 z-10 bg-[#200407]/90 text-white px-2.5 py-0.5 rounded text-[11px] font-bold uppercase backdrop-blur-xs">
                      Hemat 25%
                    </div>
                    <img
                      alt="Bakso Halus Super Essem"
                      className="w-full h-full object-cover"
                      src="/images/bakso-super-essem.webp"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline font-bold text-base text-[#1c1917] mb-1">
                      Bakso Halus Super (50 Butir)
                    </h3>
                    <p className="font-editorial text-xs text-stone-600 mb-3 line-clamp-2">
                      Bakso daging sapi halus bertekstur empuk kenyal pas untuk anak-anak dan hajatan.
                    </p>

                    <div className="mb-3">
                      <span className="text-stone-400 text-xs line-through block font-medium">Rp 58.000</span>
                      <span className="font-headline font-bold text-2xl text-[#7a0019]">Rp 43.500</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                        <span>Terjual 82%</span>
                        <span>Sisa 12 Pack</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
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
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer ${
                      addedId === "promo-halus-50"
                        ? "bg-emerald-700 text-white"
                        : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                    }`}
                  >
                    {addedId === "promo-halus-50" ? "✓ Berhasil Masuk!" : "Pesan Racikan Ini"}
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#faf8f5] rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:border-[#7a0019]/40 transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="h-56 relative bg-stone-100 overflow-hidden">
                    <div className="absolute top-3 right-3 z-10 bg-[#200407]/90 text-white px-2.5 py-0.5 rounded text-[11px] font-bold uppercase backdrop-blur-xs">
                      Hemat 20%
                    </div>
                    <img
                      alt="Kulit Pangsit Spesial"
                      className="w-full h-full object-cover"
                      src="/images/kulit-pangsit-spesial-rebus-dan-goreng.webp"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline font-bold text-base text-[#1c1917] mb-1">
                      Kulit Pangsit Renyah (500g)
                    </h3>
                    <p className="font-editorial text-xs text-stone-600 mb-3 line-clamp-2">
                      Kulit pangsit tipis lentur, sangat renyah saat digoreng dan gurih saat direbus.
                    </p>

                    <div className="mb-3">
                      <span className="text-stone-400 text-xs line-through block font-medium">Rp 18.000</span>
                      <span className="font-headline font-bold text-2xl text-[#7a0019]">Rp 14.400</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                        <span>Terjual 60%</span>
                        <span>Sisa 20 Pack</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
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
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer ${
                      addedId === "promo-pangsit-500g"
                        ? "bg-emerald-700 text-white"
                        : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                    }`}
                  >
                    {addedId === "promo-pangsit-500g" ? "✓ Berhasil Masuk!" : "Pesan Racikan Ini"}
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#faf8f5] rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:border-[#7a0019]/40 transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="h-56 relative bg-stone-100 overflow-hidden">
                    <div className="absolute top-3 right-3 z-10 bg-[#200407]/90 text-white px-2.5 py-0.5 rounded text-[11px] font-bold uppercase backdrop-blur-xs">
                      Hemat 15%
                    </div>
                    <img
                      alt="Bumbu Kuah Kaldu Rempah"
                      className="w-full h-full object-cover"
                      src="/images/bumbu-kuah-bakso.webp"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline font-bold text-base text-[#1c1917] mb-1">
                      Bumbu Kuah Kaldu Sapi (250g)
                    </h3>
                    <p className="font-editorial text-xs text-stone-600 mb-3 line-clamp-2">
                      Sari ekstrak sumsum sapi dengan tumisan bawang putih harum, menghasilkan kuah sedap.
                    </p>

                    <div className="mb-3">
                      <span className="text-stone-400 text-xs line-through block font-medium">Rp 22.000</span>
                      <span className="font-headline font-bold text-2xl text-[#7a0019]">Rp 18.700</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                        <span>Terjual 90%</span>
                        <span>Sisa 5 Botol</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
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
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer ${
                      addedId === "promo-bumbu-250g"
                        ? "bg-emerald-700 text-white"
                        : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                    }`}
                  >
                    {addedId === "promo-bumbu-250g" ? "✓ Berhasil Masuk!" : "Pesan Racikan Ini"}
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