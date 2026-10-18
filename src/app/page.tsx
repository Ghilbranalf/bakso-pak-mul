"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

// Fallback catalog items so the artisan UI always looks complete & delicious
const FALLBACK_PRODUCTS = [
  {
    id: "bakso-urat-spesial",
    name: "Bakso Sapi Urat Spesial BPM",
    category: "Bakso",
    price: 65000,
    unit: "50 Butir / Pack",
    rating: "5.0",
    image: "/images/bakso-citra-rasa-premium.webp",
    description: "Bakso urat sapi murni bertekstur kenyal alami dengan cacahan urat melimpah dan aroma daging sapi gurih asli.",
  },
  {
    id: "bakso-halus-super",
    name: "Bakso Sapi Halus Super Essem",
    category: "Bakso",
    price: 58000,
    unit: "50 Butir / Pack",
    rating: "4.9",
    image: "/images/bakso-super-essem.webp",
    description: "Bakso daging sapi halus bertekstur lembut dan kenyal pas, favorit santapan anak-anak dan hajatan keluarga.",
  },
  {
    id: "mie-telor-bebek",
    name: "Mie Basah Telor Bebek Super",
    category: "Mie",
    price: 26000,
    unit: "1 Kg (10-12 Porsi)",
    rating: "4.9",
    image: "/images/bakmie-telor-bebek.webp",
    description: "Mie basah mentah racikan telor bebek asli, kenyal tidak mudah putus saat direbus dan menyerap kuah sempurna.",
  },
  {
    id: "kulit-pangsit-spesial",
    name: "Kulit Pangsit Spesial Rebus & Goreng",
    category: "Pangsit",
    price: 18000,
    unit: "500 Gram",
    rating: "4.8",
    image: "/images/kulit-pangsit-spesial-rebus-dan-goreng.webp",
    description: "Kulit pangsit tipis lentur, sangat renyah ketika digoreng dan lembut gurih saat direbus dalam kuah bakso.",
  },
  {
    id: "bumbu-kuah-bakso",
    name: "Bumbu Kuah Kaldu Rempah Sapi",
    category: "Bumbu",
    price: 22000,
    unit: "250 Gram / Botol",
    rating: "5.0",
    image: "/images/bumbu-kuah-bakso.webp",
    description: "Racikan bumbu kaldu bubuk ekstrak sumsum sapi dengan tumisan bawang putih wangi dan rempah warisan Pak Mul.",
  },
  {
    id: "bakso-mekar-wangi",
    name: "Bakso Mekar Wangi Spesial",
    category: "Bakso",
    price: 62000,
    unit: "50 Butir / Pack",
    rating: "4.9",
    image: "/images/bakso-mekar-wangi.webp",
    description: "Bakso sapi yang merekah cantik saat dimasak dengan kuah mendidih, gurih gurih sedap berasa serat dagingnya.",
  },
  {
    id: "saos-pedas-58",
    name: "Saus Sambal Botol 58 Tradisional",
    category: "Saos",
    price: 15000,
    unit: "600 ml",
    rating: "4.8",
    image: "/images/saos-pedas-lima-delapan.webp",
    description: "Saus sambal legendaris langganan pedagang bakso & mie ayam se-Jabodetabek dengan aroma pedas khas rempah.",
  },
  {
    id: "kecap-manis-sari-sedap",
    name: "Kecap Manis Sari Sedap Kedelai Hitam",
    category: "Saos",
    price: 16000,
    unit: "600 ml",
    rating: "4.9",
    image: "/images/kecap-manis-sari-sedap.webp",
    description: "Kecap manis kental gurih dari kedelai hitam alami, pelengkap sempurna semangkuk bakso dan mie ayam panas.",
  },
];

export default function HomePage() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch("/api/products", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          } else {
            setProducts(FALLBACK_PRODUCTS);
          }
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        console.warn("Failed to load products from API, using fallback catalog:", err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const displayList = products.length > 0 ? products : FALLBACK_PRODUCTS;

  const filteredDisplayProducts = useMemo(() => {
    if (activeCategory === "Semua") {
      return displayList.slice(0, 8);
    }
    const cat = activeCategory.toLowerCase();
    return displayList
      .filter(
        (p) =>
          p.category?.toLowerCase().includes(cat) ||
          p.name?.toLowerCase().includes(cat)
      )
      .slice(0, 8);
  }, [displayList, activeCategory]);

  const categories = [
    { name: "Semua", label: "Semua Racikan" },
    { name: "Bakso", label: "Bakso Sapi Asli" },
    { name: "Mie", label: "Mie Telor Bebek" },
    { name: "Pangsit", label: "Kulit Pangsit" },
    { name: "Bumbu", label: "Bumbu Kaldu" },
    { name: "Saos", label: "Kecap & Saus" },
  ];

  const handleQuickAdd = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit || "Pack",
    });
    setAddedId(product.id);
    setToastMessage(product.name);
    setTimeout(() => setAddedId(null), 1500);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-sans antialiased selection:bg-[#7a0019] selection:text-white">
      <Navbar />

      <main>
        {/* ========================================================================= */}
        {/* 1. ARTISAN POSTER HERO: MONUMENTAL, BALANCED, MASTERPIECE CULINARY FOCUS  */}
        {/* ========================================================================= */}
        <section className="relative bg-[#200407] text-white pt-28 sm:pt-36 pb-16 lg:pb-20 overflow-hidden border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Monumental Headline */}
            <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] max-w-5xl mx-auto">
              RASA ASLI BAKSO PAK MUL.
            </h1>

            <p className="mt-5 text-stone-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              100% daging sapi murni pilihan, diracik segar setiap subuh dengan bumbu kaldu sumsum rempah asli tanpa boraks dan pengawet buatan.
            </p>

            {/* Centerpiece Triptych Showcase */}
            <div className="relative max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              {/* Left Flank Card: Mie Telor Bebek */}
              <div
                onClick={() => handleQuickAdd(displayList[2] || FALLBACK_PRODUCTS[2])}
                className="md:col-span-3 bg-[#260509] rounded-2xl p-4 border border-white/10 hover:border-white/25 shadow-xl transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 mb-3">
                  <img
                    src="/images/bakmie-telor-bebek.webp"
                    alt="Mie Basah Telor Bebek"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                  Mie Basah
                </div>
                <h4 className="font-headline font-bold text-sm text-white truncate">
                  Mie Basah Telor Bebek
                </h4>
                <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">1 Kg (10-12 Porsi)</p>
                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="font-bold text-xs text-white">Rp 26.000</span>
                  <span className="text-[11px] font-medium text-stone-300 group-hover:text-white flex items-center gap-0.5">
                    + Tambah
                  </span>
                </div>
              </div>

              {/* Center Main Showpiece: Bakso Sapi Komplit */}
              <div
                onClick={() => handleQuickAdd(displayList[0] || FALLBACK_PRODUCTS[0])}
                className="md:col-span-6 bg-[#2a060b] rounded-2xl p-5 border border-white/15 hover:border-white/30 shadow-2xl transition-all duration-200 cursor-pointer group text-left relative overflow-hidden"
              >
                <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-black/50 mb-4">
                  <img
                    src="/images/hero-banner.webp"
                    alt="Semangkuk Bakso Sapi Komplit Pak Mul"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#200407]/90 via-transparent to-transparent opacity-80" />

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-stone-300">
                      Racikan Resep 24+ Tahun • Pasar Kramat Jati
                    </p>
                    <h3 className="font-headline text-xl sm:text-2xl font-bold text-white mt-0.5">
                      Bakso Sapi Komplit Kuah Kaldu
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-headline font-bold text-2xl text-white block">
                      Rp 65.000
                    </span>
                    <span className="text-xs text-stone-300 font-normal">50 Butir / Pack Termasuk Bumbu</span>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-200 text-[#200407] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm font-bold">add</span>
                    <span>Pesan Langsung</span>
                  </button>
                </div>
              </div>

              {/* Right Flank Card: Bakso Urat Spesial */}
              <div
                onClick={() => handleQuickAdd(displayList[1] || FALLBACK_PRODUCTS[1])}
                className="md:col-span-3 bg-[#260509] rounded-2xl p-4 border border-white/10 hover:border-white/25 shadow-xl transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 mb-3">
                  <img
                    src="/images/bakso-citra-rasa-premium.webp"
                    alt="Bakso Urat Sapi Spesial"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                  Daging Murni
                </div>
                <h4 className="font-headline font-bold text-sm text-white truncate">
                  Bakso Sapi Urat Spesial
                </h4>
                <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">50 Butir Cacahan Gurih</p>
                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="font-bold text-xs text-white">Rp 65.000</span>
                  <span className="text-[11px] font-medium text-stone-300 group-hover:text-white flex items-center gap-0.5">
                    + Tambah
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. HERITAGE MARQUEE BANNER (CLEAN, STRAIGHT, ENERGETIC QUALITY STRIP)      */}
        {/* ========================================================================= */}
        <section className="bg-[#200407] text-stone-300 py-3.5 overflow-hidden select-none border-b border-white/5">
          <div className="flex gap-8 whitespace-nowrap animate-marquee font-headline text-xs sm:text-sm font-semibold tracking-widest uppercase">
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center gap-8 shrink-0 text-stone-300">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white/50 text-base">soup_kitchen</span>
                  <span>100% DAGING SAPI MURNI</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>MIE BASAH TELOR BEBEK</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white/50 text-base">verified</span>
                  <span>TANPA BORAKS &amp; PENGAWET</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>KUAH KALDU SUMSUM ASLI</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white/50 text-base">storefront</span>
                  <span>PASAR KRAMAT JATI EST. 2000</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>KULIT PANGSIT RENYAH</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white/50 text-base">local_shipping</span>
                  <span>KIRIM SEGAR SE-JABODETABEK</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>DIPERCAYA 500+ MITRA KULINER</span>
                  <span className="text-white/20">•</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MONUMENTAL STATEMENT SECTION (CLEAN EDITORIAL POSTER STATEMENT)        */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#faf8f5]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7a0019]">
              Filosofi &amp; Komitmen Rasa
            </span>

            <h2 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-[#1c1917] uppercase tracking-tight leading-[1.12]">
              Dibuat dari 100% Daging Sapi Murni Pilihan, Diracik Kuah Kaldu Rempah Asli, Meresap Sempurna Hingga Tetes Terakhir.
            </h2>

            <p className="max-w-2xl mx-auto text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              Kelezatan bakso sapi asli khas Pasar Kramat Jati. Diracik segar setiap subuh dari potongan daging sapi murni tanpa boraks dan tanpa pengawet buatan, menjaga cita rasa otentik yang dicintai keluarga dan ratusan warung mitra selama lebih dari 24 tahun.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MENU CATALOG & INTEGRATED CATEGORY TABS                                */}
        {/* ========================================================================= */}
        <section id="menu-catalog" className="py-16 sm:py-24 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a0019]">
                  Pilihan Kedai
                </span>
                <h3 className="font-headline text-3xl sm:text-5xl font-bold text-[#1c1917] tracking-tight mt-1 uppercase">
                  Katalog Racikan &amp; Bahan Baku
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm mt-1">
                  Pesan langsung kebutuhan olahan bakso, mie, dan bumbu untuk meja makan rumah tangga maupun warung mitra.
                </p>
              </div>

              <Link
                href="/produk"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7a0019] hover:text-[#51000d] uppercase tracking-wider group"
              >
                <span>Buka Katalog Lengkap</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Clean Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#7a0019] text-white shadow-md font-bold"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDisplayProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-[#7a0019]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      <img
                        src={item.image || "/images/hero-banner.webp"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = "/images/hero-banner.webp";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7a0019]">
                          {item.category || "Olahan Sapi"}
                        </span>
                        {item.unit && (
                          <span className="text-[11px] text-stone-600 font-medium">
                            {item.unit}
                          </span>
                        )}
                      </div>

                      <Link href={`/produk/${item.id}`} className="block">
                        <h4 className="font-headline font-bold text-[#1c1917] text-base group-hover:text-[#7a0019] transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="font-editorial text-[13px] text-stone-600 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                        {item.description || "Olahan segar berkualitas dari bahan baku murni terpilih khas Bakso Pak Mul."}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                    <span className="font-headline font-bold text-lg text-[#1c1917]">
                      Rp {(item.price || 0).toLocaleString("id-ID")}
                    </span>

                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                        addedId === item.id
                          ? "bg-emerald-700 text-white"
                          : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {addedId === item.id ? "check" : "add"}
                      </span>
                      <span>{addedId === item.id ? "Masuk" : "Pesan"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. 4 PILAR KUALITAS PAK MUL (STRUCTURED & CRISP)                          */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a0019]">
                Standar Mutu
              </span>
              <h3 className="font-headline text-2xl sm:text-4xl font-bold text-[#1c1917] tracking-tight mt-1 uppercase">
                4 Pilar Kualitas Bakso Pak Mul
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center font-bold font-headline text-lg">
                  01
                </div>
                <h4 className="font-headline font-bold text-base text-[#1c1917]">100% Daging Sapi Murni</h4>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Dipilih langsung dari pemotongan pasar induk setiap subuh tanpa campuran boraks maupun pengawet sintetis.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center font-bold font-headline text-lg">
                  02
                </div>
                <h4 className="font-headline font-bold text-base text-[#1c1917]">Kaldu Tulang Sumsum</h4>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Sari rebusan tulang sumsum sapi berpadu tumisan bawang putih harum, menghasilkan aroma kuah yang gurih alami.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center font-bold font-headline text-lg">
                  03
                </div>
                <h4 className="font-headline font-bold text-base text-[#1c1917]">Tradisi Sejak Tahun 2000</h4>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Dipercaya lebih dari 24 tahun melayani kebutuhan santapan keluarga dan ratusan warung mitra se-Jabodetabek.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center font-bold font-headline text-lg">
                  04
                </div>
                <h4 className="font-headline font-bold text-base text-[#1c1917]">Segel Higienis &amp; Segar</h4>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Dikemas rapi dalam standar mutu pangan untuk menjaga kebersihan dan kesegaran terbaik tiba di dapur Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. AUTHENTIC STORY SECTION (EDITORIAL SPREAD)                             */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Portrait of Pak Mul at the Kiosk */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-xl bg-stone-900 border border-stone-200 group">
                  <img
                    alt="Pak Mul di Kios Tradisional Pasar Kramat Jati"
                    className="w-full h-[400px] sm:h-[480px] object-cover"
                    src="/images/toko-pak-mul-kramat-jati.webp"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
                      Dokumentasi Kios Asli
                    </span>
                    <p className="font-headline font-bold text-xl uppercase mt-0.5 text-white">
                      Pak Mul di Kios Kramat Jati
                    </p>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Melayani pelanggan setiap subuh sejak tahun 2000
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Dedication */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-[#7a0019]" />
                  <p className="text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase">
                    Kisah &amp; Filosofi Rasa
                  </p>
                </div>

                <blockquote className="font-headline text-2xl sm:text-3xl font-bold text-[#1c1917] leading-tight uppercase">
                  &ldquo;Bagi kami, membuat bakso bukan sekadar menggiling daging, melainkan menjaga amanah rasa yang sudah dipercaya keluarga sejak generasi pertama.&rdquo;
                </blockquote>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                  Bermula dari kios sederhana di lantai dasar Pasar Kramat Jati Jakarta Timur, Pak Mul mengawali hari setiap pukul 04.30 subuh untuk memilih potongan daging sapi segar terbaik dari pemotongan pasar induk. Tanpa pengenyal kimiawi, tanpa rekayasa buatan. Hanya daging sapi murni, takaran bumbu rempah yang pas, dan dedikasi menjaga konsistensi rasa selama lebih dari 24 tahun.
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3.5">
                  <a
                    href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#200407] hover:bg-[#32060b] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-white">near_me</span>
                    <span>Petunjuk Arah Kios Pasar Kramat Jati</span>
                  </a>
                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20berkunjung%20ke%20kios%20langsung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-[#1c1917] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-stone-700 text-base">chat</span>
                    <span>Hubungi Kios via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. TESTIMONIALS (WARM EDITORIAL, CRISP READABILITY)                       */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase">
                Ulasan Pelanggan Setia
              </span>
              <h2 className="font-headline text-2xl sm:text-4xl font-bold text-[#1c1917] tracking-tight mt-1 uppercase">
                Dipercaya Turun Temurun
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                    <span className="text-stone-300 font-editorial text-3xl leading-none">“</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">Mitra Kuliner</span>
                  </div>
                  <p className="font-editorial text-sm text-stone-700 leading-relaxed font-normal">
                    &ldquo;Sudah 6 tahun langganan mie telor bebek dan bakso urat Pak Mul untuk gerobak mie ayam saya. Mie-nya kenyal tidak mudah hancur saat direbus, pelanggan selalu puji kuahnya mantap.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7a0019] text-white font-headline font-bold text-xs flex items-center justify-center">
                    MB
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1c1917]">Mas Bambang</p>
                    <p className="text-[11px] text-stone-500 font-medium">Mie Ayam Podomoro, Ciracas</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                    <span className="text-stone-300 font-editorial text-3xl leading-none">“</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">Konsumsi Keluarga</span>
                  </div>
                  <p className="font-editorial text-sm text-stone-700 leading-relaxed font-normal">
                    &ldquo;Beli bakso halus buat acara arisan dan hajatan keluarga di rumah. Daging sapinya berasa sekali, bukan cuma tepung. Pengiriman tepat waktu dan baksonya masih dingin beku segar.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7a0019] text-white font-headline font-bold text-xs flex items-center justify-center">
                    SR
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1c1917]">Ibu Siti Rahma</p>
                    <p className="text-[11px] text-stone-500 font-medium">Pelanggan Rumah Tangga, Kramat Jati</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                    <span className="text-stone-300 font-editorial text-3xl leading-none">“</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">Mitra Katering</span>
                  </div>
                  <p className="font-editorial text-sm text-stone-700 leading-relaxed font-normal">
                    &ldquo;Pesanan grosir untuk katering pabrik selalu aman. Kulit pangsitnya renyah kalau digoreng, tidak banyak menyerap minyak. Pelayanan cepat dan responsif saat ada pesanan dadakan.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7a0019] text-white font-headline font-bold text-xs flex items-center justify-center">
                    HW
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1c1917]">Pak Hendra Wijaya</p>
                    <p className="text-[11px] text-stone-500 font-medium">Katering Berkah Mandiri, Pulogadung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#200407] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-white/15 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-emerald-400 text-base">
            check_circle
          </span>
          <span>{toastMessage} berhasil masuk keranjang</span>
        </div>
      )}

      {/* Cart Sidebar Drawer */}
      <CartSidebar />
    </div>
  );
}
