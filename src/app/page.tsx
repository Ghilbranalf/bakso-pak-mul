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
    <div className="min-h-[100dvh] bg-[#faf8f5] text-[#1c1917] font-sans antialiased selection:bg-[#7a0019] selection:text-white">
      <Navbar />

      <main>
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: CINEMATIC EDITORIAL CULINARY SHOWCASE                    */}
        {/* ========================================================================= */}
        <section className="relative bg-[#1c0306] text-white pt-32 sm:pt-40 pb-20 lg:pb-28 overflow-hidden">
          {/* Subtle warm radial ambiance */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7a0019]/25 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Eyebrow Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-stone-200 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Resep Otentik Sejak 1990 • Pasar Kramat Jati</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.93] max-w-5xl mx-auto">
              RASA ASLI BAKSO PAK MUL.
            </h1>

            <p className="mt-6 text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              100% daging sapi murni pilihan, diracik segar setiap subuh dengan bumbu kaldu sumsum rempah asli tanpa boraks dan tanpa pengawet buatan.
            </p>

            {/* Action Buttons: Button-in-Button Architecture */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#menu-catalog"
                className="rounded-full px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#1c0306] font-bold text-sm transition-colors duration-200 active:scale-[0.98] group inline-flex items-center gap-3 cursor-pointer"
              >
                <span>Lihat Menu Racikan</span>
                <span className="w-7 h-7 rounded-full bg-[#1c0306]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                  <span className="material-symbols-outlined text-base font-bold text-[#1c0306]">
                    arrow_forward
                  </span>
                </span>
              </a>

              <Link
                href="/tentang"
                className="rounded-full px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors duration-200 active:scale-[0.98] inline-flex items-center gap-2.5"
              >
                <span className="material-symbols-outlined text-stone-300 text-base">
                  storefront
                </span>
                <span>Kisah Kios Kramat Jati</span>
              </Link>
            </div>

            {/* ========================================================================= */}
            {/* Centerpiece Triptych Showcase: Double-Bezel Nested Architecture            */}
            {/* ========================================================================= */}
            <div className="relative max-w-6xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              {/* Left Flank Card: Mie Telor Bebek */}
              <div
                onClick={() => handleQuickAdd(displayList[2] || FALLBACK_PRODUCTS[2])}
                className="md:col-span-3 p-2 rounded-[2rem] bg-white/[0.04] transition-colors duration-200 cursor-pointer group text-left"
              >
                <div className="rounded-[calc(2rem-0.5rem)] bg-[#250509] p-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 mb-3.5">
                      <img
                        src="/images/bakmie-telor-bebek.webp"
                        alt="Mie Basah Telor Bebek"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 text-[11px] font-semibold text-stone-200">
                        Mie Basah Mentah
                      </span>
                    </div>

                    <h4 className="font-headline font-bold text-base text-white truncate">
                      Mie Telor Bebek Super
                    </h4>
                    <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                      1 Kg (10-12 Porsi Kenyal Gurih)
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3">
                    <span className="font-headline font-bold text-sm text-white">
                      Rp 26.000
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-stone-200 group-hover:text-white transition-colors duration-200">
                      <span className="material-symbols-outlined text-xs">add</span>
                      <span>Pesan</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Main Showpiece: Bakso Sapi Komplit */}
              <div
                onClick={() => handleQuickAdd(displayList[0] || FALLBACK_PRODUCTS[0])}
                className="md:col-span-6 p-2 rounded-[2.25rem] bg-white/[0.06] transition-colors duration-200 cursor-pointer group text-left relative overflow-hidden"
              >
                <div className="rounded-[calc(2.25rem-0.5rem)] bg-[#2c060c] p-5 sm:p-6 flex flex-col justify-between">
                  <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-black/50 mb-5">
                    <img
                      src="/images/hero-banner.webp"
                      alt="Semangkuk Bakso Sapi Komplit Pak Mul"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Neutral Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c0306]/95 via-[#1c0306]/30 to-transparent" /* taste-skill-ignore */ />

                    {/* Floating Quality Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-[#1c0306] text-xs font-bold">
                        Racikan Favorit
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/70 text-stone-200 text-xs font-medium">
                        Kuah Kaldu Sumsum
                      </span>
                    </div>

                    {/* Bottom Image Caption */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-medium text-amber-200">
                        Racikan Warisan 34+ Tahun • Pasar Kramat Jati
                      </p>
                      <h3 className="font-headline text-2xl sm:text-3xl font-black text-white mt-1">
                        Bakso Sapi Komplit Kuah Kaldu
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline font-black text-2xl sm:text-3xl text-white">
                          Rp 65.000
                        </span>
                        <span className="text-xs text-stone-300 font-medium">
                          / Pack Isi 50 Butir
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Termasuk bumbu kaldu sumsum rempah siap seduh
                      </p>
                    </div>

                    <button className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-[#1c0306] font-bold text-xs flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.98] cursor-pointer">
                      <span className="material-symbols-outlined text-base font-bold">
                        add
                      </span>
                      <span>Pesan Langsung</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Flank Card: Bakso Urat Spesial */}
              <div
                onClick={() => handleQuickAdd(displayList[1] || FALLBACK_PRODUCTS[1])}
                className="md:col-span-3 p-2 rounded-[2rem] bg-white/[0.04] transition-colors duration-200 cursor-pointer group text-left"
              >
                <div className="rounded-[calc(2rem-0.5rem)] bg-[#250509] p-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 mb-3.5">
                      <img
                        src="/images/bakso-citra-rasa-premium.webp"
                        alt="Bakso Urat Sapi Spesial"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 text-[11px] font-semibold text-stone-200">
                        100% Sapi Murni
                      </span>
                    </div>

                    <h4 className="font-headline font-bold text-base text-white truncate">
                      Bakso Sapi Urat Spesial
                    </h4>
                    <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                      50 Butir Cacahan Urat Melimpah
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3">
                    <span className="font-headline font-bold text-sm text-white">
                      Rp 65.000
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-stone-200 group-hover:text-white transition-colors duration-200">
                      <span className="material-symbols-outlined text-xs">add</span>
                      <span>Pesan</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. HERITAGE MARQUEE STRIP (SMOOTH, TACTILE QUALITY ASSURANCE)              */}
        {/* ========================================================================= */}
        <section className="bg-[#140204] text-stone-300 py-4 overflow-hidden select-none">
          <div className="flex gap-8 whitespace-nowrap animate-marquee font-headline text-xs sm:text-sm font-semibold">
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center gap-8 shrink-0 text-stone-300">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">
                    soup_kitchen
                  </span>
                  <span className="text-white">100% Daging Sapi Murni</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>Mie Basah Telor Bebek</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">
                    verified
                  </span>
                  <span className="text-white">Tanpa Boraks &amp; Pengawet</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>Kuah Kaldu Sumsum Asli</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">
                    storefront
                  </span>
                  <span className="text-white">Pasar Kramat Jati Est. 1990</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>Kulit Pangsit Renyah Gurih</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">
                    local_shipping
                  </span>
                  <span className="text-white">Pengiriman Segar Se-Jabodetabek</span>
                  <span className="text-white/20">•</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>Dipercaya 500+ Mitra Kuliner</span>
                  <span className="text-white/20">•</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MANIFESTO & METRICS (EDITORIAL RESTRAINT & PRESENCE)                   */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#faf8f5]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-200/70 text-[#7a0019] text-xs font-bold">
              Keahlian &amp; Integritas Bahan
            </div>

            <h2 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-[#1c1917] uppercase tracking-tight leading-[1.08]">
              Daging Sapi Murni Pilihan, Diracik Kuah Kaldu Rempah Asli, Meresap Sempurna Hingga Tetes Terakhir.
            </h2>

            <p className="max-w-2xl mx-auto text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
              Kelezatan bakso sapi asli khas Pasar Kramat Jati. Diracik segar setiap subuh dari potongan daging sapi murni tanpa boraks dan tanpa pengawet buatan, menjaga cita rasa otentik yang dicintai keluarga dan ratusan warung mitra selama lebih dari 34 tahun.
            </p>

            {/* 3 Key Stats / Heritage Strip */}
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-1 rounded-[1.5rem] bg-stone-200/50">
                <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#faf8f5] p-5 text-center">
                  <p className="font-headline font-black text-3xl sm:text-4xl text-[#7a0019]">
                    100%
                  </p>
                  <p className="font-bold text-xs text-[#1c1917] mt-1">
                    Daging Sapi Murni
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Dipilih segar setiap subuh
                  </p>
                </div>
              </div>

              <div className="p-1 rounded-[1.5rem] bg-stone-200/50">
                <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#faf8f5] p-5 text-center">
                  <p className="font-headline font-black text-3xl sm:text-4xl text-[#7a0019]">
                    34+
                  </p>
                  <p className="font-bold text-xs text-[#1c1917] mt-1">
                    Tahun Menjaga Resep
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Sejak 1990 di Kramat Jati
                  </p>
                </div>
              </div>

              <div className="p-1 rounded-[1.5rem] bg-stone-200/50">
                <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#faf8f5] p-5 text-center">
                  <p className="font-headline font-black text-3xl sm:text-4xl text-[#7a0019]">
                    500+
                  </p>
                  <p className="font-bold text-xs text-[#1c1917] mt-1">
                    Mitra Usaha Kuliner
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Warung &amp; Katering rutin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MENU CATALOG & INTEGRATED CATEGORY TABS (DOUBLE-BEZEL CARDS)            */}
        {/* ========================================================================= */}
        <section id="menu-catalog" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-[#7a0019] text-xs font-bold mb-2">
                  Koleksi Pilihan Kedai
                </div>
                <h3 className="font-headline text-3xl sm:text-5xl font-black text-[#1c1917] tracking-tight uppercase">
                  Katalog Racikan &amp; Bahan Baku
                </h3>
                <p className="text-stone-500 text-sm sm:text-base mt-2 max-w-xl">
                  Pesan langsung kebutuhan olahan bakso, mie, dan bumbu untuk meja makan rumah tangga maupun pasokan warung kuliner Anda.
                </p>
              </div>

              <Link
                href="/produk"
                className="rounded-full px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#7a0019] font-bold text-xs inline-flex items-center gap-2 transition-colors duration-200 self-start md:self-end group"
              >
                <span>Buka Katalog Lengkap</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-200">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#7a0019] text-white"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Product Grid: Double-Bezel Nested Card Architecture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDisplayProducts.map((item) => (
                <div
                  key={item.id}
                  className="p-1.5 rounded-[1.75rem] bg-stone-100/80 transition-colors duration-200 flex flex-col justify-between group"
                >
                  <div className="rounded-[calc(1.75rem-0.375rem)] bg-white p-4 flex flex-col justify-between h-full">
                    <div>
                      {/* Product Image Frame */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-4">
                        <img
                          src={item.image || "/images/hero-banner.webp"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e: any) => {
                            e.target.src = "/images/hero-banner.webp";
                          }}
                        />
                        {item.unit && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-stone-800">
                            {item.unit}
                          </span>
                        )}
                      </div>

                      {/* Info & Description */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-[#7a0019]">
                            {item.category || "Olahan Sapi"}
                          </span>
                          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                            <span
                              className="material-symbols-outlined text-amber-500 text-sm"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span>{item.rating || "5.0"}</span>
                          </span>
                        </div>

                        <Link href={`/produk/${item.id}`} className="block">
                          <h4 className="font-headline font-bold text-[#1c1917] text-base group-hover:text-[#7a0019] transition-colors duration-200 line-clamp-1">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="font-editorial text-[13px] text-stone-600 line-clamp-2 leading-relaxed font-normal">
                          {item.description || "Olahan segar berkualitas dari bahan baku murni terpilih khas Bakso Pak Mul."}
                        </p>
                      </div>
                    </div>

                    {/* Price & Action: Nested Island Button */}
                    <div className="pt-4 mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 font-semibold block">
                          Harga Pas
                        </span>
                        <span className="font-headline font-bold text-lg text-[#1c1917]">
                          Rp {(item.price || 0).toLocaleString("id-ID")}
                        </span>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(item)}
                        className={`rounded-full px-4 py-2 font-bold text-xs transition-colors duration-200 flex items-center gap-1.5 active:scale-[0.96] cursor-pointer ${
                          addedId === item.id
                            ? "bg-emerald-700 text-white"
                            : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">
                          {addedId === item.id ? "check" : "add"}
                        </span>
                        <span>{addedId === item.id ? "Masuk" : "Pesan"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. 4 PILAR KUALITAS PAK MUL (NESTED DOUBLE-BEZEL ARCHITECTURE)            */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-200/80 text-[#7a0019] text-xs font-bold mb-3">
                Standar Kualitas
              </div>
              <h3 className="font-headline text-3xl sm:text-5xl font-black text-[#1c1917] tracking-tight uppercase">
                4 Pilar Kualitas Bakso Pak Mul
              </h3>
              <p className="text-stone-500 text-sm mt-2">
                Prinsip pengolahan yang kami pegang teguh demi menyajikan rasa yang aman, nikmat, dan terpercaya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pilar 1 */}
              <div className="p-1.5 rounded-[2rem] bg-white transition-colors duration-200">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-7 space-y-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#7a0019] text-white flex items-center justify-center font-bold mb-4">
                      <span className="material-symbols-outlined text-2xl">restaurant</span>
                    </div>
                    <h4 className="font-headline font-bold text-lg text-[#1c1917]">
                      100% Daging Sapi Murni
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal mt-2">
                      Dipilih langsung dari pemotongan pasar induk setiap subuh tanpa campuran boraks maupun pengawet sintetis.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#7a0019]">
                    Bebas Kimia Pangan
                  </span>
                </div>
              </div>

              {/* Pilar 2 */}
              <div className="p-1.5 rounded-[2rem] bg-white transition-colors duration-200">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-7 space-y-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#7a0019] text-white flex items-center justify-center font-bold mb-4">
                      <span className="material-symbols-outlined text-2xl">soup_kitchen</span>
                    </div>
                    <h4 className="font-headline font-bold text-lg text-[#1c1917]">
                      Kaldu Tulang Sumsum
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal mt-2">
                      Sari rebusan tulang sumsum sapi berpadu tumisan bawang putih harum, menghasilkan aroma kuah yang gurih alami.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#7a0019]">
                    Gurih Alami
                  </span>
                </div>
              </div>

              {/* Pilar 3 */}
              <div className="p-1.5 rounded-[2rem] bg-white transition-colors duration-200">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-7 space-y-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#7a0019] text-white flex items-center justify-center font-bold mb-4">
                      <span className="material-symbols-outlined text-2xl">history_edu</span>
                    </div>
                    <h4 className="font-headline font-bold text-lg text-[#1c1917]">
                      Tradisi Sejak Tahun 1990
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal mt-2">
                      Dipercaya lebih dari 34 tahun melayani kebutuhan santapan keluarga dan ratusan warung mitra se-Jabodetabek.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#7a0019]">
                    Pasar Kramat Jati
                  </span>
                </div>
              </div>

              {/* Pilar 4 */}
              <div className="p-1.5 rounded-[2rem] bg-white transition-colors duration-200">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-7 space-y-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#7a0019] text-white flex items-center justify-center font-bold mb-4">
                      <span className="material-symbols-outlined text-2xl">inventory_2</span>
                    </div>
                    <h4 className="font-headline font-bold text-lg text-[#1c1917]">
                      Segel Higienis &amp; Segar
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal mt-2">
                      Dikemas rapi dalam standar mutu pangan untuk menjaga kebersihan dan kesegaran terbaik tiba di dapur Anda.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#7a0019]">
                    Kirim Tiap Subuh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. AUTHENTIC STORY SECTION (EDITORIAL SPREAD WITH DOUBLE-BEZEL FRAME)     */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Framed Archival Photo of Pak Mul */}
              <div className="lg:col-span-5">
                <div className="p-2 rounded-[2.25rem] bg-stone-100">
                  <div className="relative rounded-[calc(2.25rem-0.5rem)] overflow-hidden bg-stone-900 group">
                    <img
                      alt="Pak Mul di Kios Tradisional Pasar Kramat Jati"
                      className="w-full h-[420px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                      src="/images/toko-pak-mul-kramat-jati.webp"
                    />
                    {/* Neutral Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" /* taste-skill-ignore */ />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1.5 rounded-full bg-black/70 text-stone-200 text-xs font-semibold">
                        Kios No. 42-43 • Kramat Jati
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="text-xs font-bold text-amber-300">
                        Dokumentasi Otentik
                      </span>
                      <p className="font-headline font-black text-2xl uppercase mt-1 text-white">
                        Pak Mul di Kios Kramat Jati
                      </p>
                      <p className="text-xs text-stone-300 mt-1">
                        Melayani pelanggan setia setiap subuh sejak tahun 1990
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Dedication */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 text-[#7a0019] text-xs font-bold">
                  Kisah &amp; Filosofi Rasa
                </div>

                <blockquote className="font-headline text-2xl sm:text-4xl font-black text-[#1c1917] leading-tight uppercase">
                  &ldquo;Bagi kami, membuat bakso bukan sekadar menggiling daging, melainkan menjaga amanah rasa yang sudah dipercaya keluarga sejak generasi pertama.&rdquo;
                </blockquote>

                <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
                  Bermula dari kios sederhana di lantai dasar Pasar Kramat Jati Jakarta Timur, Pak Mul mengawali hari setiap pukul 04.30 subuh untuk memilih potongan daging sapi segar terbaik dari pemotongan pasar induk. Tanpa pengenyal kimiawi, tanpa rekayasa buatan. Hanya daging sapi murni, takaran bumbu rempah yang pas, dan dedikasi menjaga konsistensi rasa selama lebih dari 34 tahun.
                </p>

                {/* Actions: Button-in-Button */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-6 py-3.5 bg-[#1c0306] hover:bg-[#32060b] text-white font-bold text-xs flex items-center gap-2.5 transition-colors duration-200 active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-base text-amber-400">
                      near_me
                    </span>
                    <span>Petunjuk Arah Kios Pasar</span>
                  </a>

                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20berkunjung%20ke%20kios%20langsung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-[#1c1917] font-bold text-xs flex items-center gap-2.5 transition-colors duration-200 active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-stone-700 text-base">
                      chat
                    </span>
                    <span>Hubungi Kios via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. TESTIMONIALS (EDITORIAL SOCIAL PROOF CARDS)                            */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-200/80 text-[#7a0019] text-xs font-bold mb-3">
                Ulasan Pelanggan Setia
              </div>
              <h2 className="font-headline text-3xl sm:text-5xl font-black text-[#1c1917] tracking-tight uppercase">
                Dipercaya Turun Temurun
              </h2>
              <p className="text-stone-500 text-sm mt-2">
                Cerita dari pelanggan meja makan keluarga dan para pedagang mitra kuliner kami.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="p-1.5 rounded-[2rem] bg-white transition-colors duration-200 flex flex-col justify-between">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-amber-500 text-base"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-stone-700 bg-stone-200/80 px-2.5 py-0.5 rounded-full">
                        Mitra Kuliner
                      </span>
                    </div>

                    <p className="font-editorial text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                      &ldquo;Sudah 6 tahun langganan mie telor bebek dan bakso urat Pak Mul untuk gerobak mie ayam saya. Mie-nya kenyal tidak mudah hancur saat direbus, pelanggan selalu puji kuahnya mantap.&rdquo;
                    </p>
                  </div>

                  <div className="pt-5 mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7a0019] text-white font-headline font-bold text-xs flex items-center justify-center">
                      MB
                    </div>
                    <div>
                      <p className="font-headline font-bold text-sm text-[#1c1917]">
                        Mas Bambang
                      </p>
                      <p className="text-xs text-stone-500">
                        Mie Ayam Podomoro, Ciracas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-1.5 rounded-[2rem] bg-white transition-colors duration-200 flex flex-col justify-between">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-amber-500 text-base"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-stone-700 bg-stone-200/80 px-2.5 py-0.5 rounded-full">
                        Konsumsi Rumah
                      </span>
                    </div>

                    <p className="font-editorial text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                      &ldquo;Beli bakso halus buat acara arisan dan hajatan keluarga di rumah. Daging sapinya berasa sekali, bukan cuma tepung. Pengiriman tepat waktu dan baksonya masih dingin beku segar.&rdquo;
                    </p>
                  </div>

                  <div className="pt-5 mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7a0019] text-white font-headline font-bold text-xs flex items-center justify-center">
                      SR
                    </div>
                    <div>
                      <p className="font-headline font-bold text-sm text-[#1c1917]">
                        Ibu Siti Rahma
                      </p>
                      <p className="text-xs text-stone-500">
                        Pelanggan Keluarga, Kramat Jati
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="p-1.5 rounded-[2rem] bg-white transition-colors duration-200 flex flex-col justify-between">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-amber-500 text-base"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-stone-700 bg-stone-200/80 px-2.5 py-0.5 rounded-full">
                        Mitra Katering
                      </span>
                    </div>

                    <p className="font-editorial text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                      &ldquo;Pesanan grosir untuk katering pabrik selalu aman. Kulit pangsitnya renyah kalau digoreng, tidak banyak menyerap minyak. Pelayanan cepat dan responsif saat ada pesanan dadakan.&rdquo;
                    </p>
                  </div>

                  <div className="pt-5 mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7a0019] text-white font-headline font-bold text-xs flex items-center justify-center">
                      HW
                    </div>
                    <div>
                      <p className="font-headline font-bold text-sm text-[#1c1917]">
                        Pak Hendra Wijaya
                      </p>
                      <p className="text-xs text-stone-500">
                        Katering Berkah Mandiri, Pulogadung
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. PRE-FOOTER INVITATION BANNER (CINEMATIC LUXURY CALL TO ACTION)          */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#1c0306] text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-stone-200 text-xs font-semibold">
              <span className="material-symbols-outlined text-amber-400 text-sm">
                local_shipping
              </span>
              <span>Layanan Pesan Antar Subuh Se-Jabodetabek</span>
            </div>

            <h2 className="font-headline text-3xl sm:text-5xl font-black uppercase tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Siap Menyajikan Semangkuk Bakso Hangat Berkualitas di Meja Anda?
            </h2>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Pesan langsung racikan pilihan hari ini. Dikemas higienis dengan jaminan kesegaran daging sapi murni khas Pasar Kramat Jati.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/produk"
                className="rounded-full px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#1c0306] font-bold text-sm transition-colors duration-200 active:scale-[0.98] group inline-flex items-center gap-3"
              >
                <span>Pesan Sekarang Melalui Web</span>
                <span className="w-7 h-7 rounded-full bg-[#1c0306]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                  <span className="material-symbols-outlined text-base font-bold text-[#1c0306]">
                    arrow_forward
                  </span>
                </span>
              </Link>

              <a
                href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20pesan%20grosir%20bahan%20baku"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors duration-200 active:scale-[0.98] inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-amber-400 text-base">
                  chat
                </span>
                <span>Konsultasi Pasokan Grosir</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div
          data-ui
          className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#1c0306] text-white px-5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3"
        >
          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm font-bold">
              check
            </span>
          </span>
          <span>{toastMessage} berhasil masuk keranjang</span>
        </div>
      )}

      {/* Cart Sidebar Drawer */}
      <CartSidebar />
    </div>
  );
}