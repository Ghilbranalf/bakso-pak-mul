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
    { name: "Semua", label: "SEMUA RACIKAN" },
    { name: "Bakso", label: "BAKSO SAPI ASLI" },
    { name: "Mie", label: "MIE TELOR BEBEK" },
    { name: "Pangsit", label: "KULIT PANGSIT" },
    { name: "Bumbu", label: "BUMBU KALDU" },
    { name: "Saos", label: "KECAP & SAUS" },
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
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917] font-sans antialiased selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main>
        {/* ========================================================================= */}
        {/* 1. ARTISAN POSTER HERO SECTION (PROPORTIONAL, BALANCED, RICH CENTERPIECE)  */}
        {/* ========================================================================= */}
        <section className="relative bg-[#1c0306] text-white pt-24 sm:pt-28 pb-16 overflow-hidden">
          {/* Subtle background ambient grain / warm radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,169,60,0.14)_0%,_transparent_65%)] pointer-events-none" />

          {/* Floating Quick Rail Icons */}
          <div className="hidden lg:flex flex-col items-center gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-[#36070e]/85 backdrop-blur-md p-2 rounded-full border border-[#59101f] shadow-2xl">
            <a
              href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#4a0a16] hover:bg-[#e5a93c] hover:text-[#1c0306] flex items-center justify-center text-xs text-white transition-colors"
              title="Lokasi Kios Kramat Jati"
            >
              <span className="material-symbols-outlined text-sm">location_on</span>
            </a>
            <a
              href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20pesan%20bakso%20sapi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#4a0a16] hover:bg-[#e5a93c] hover:text-[#1c0306] flex items-center justify-center text-xs text-white transition-colors"
              title="Konsultasi WhatsApp"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
            </a>
            <a
              href="#menu-catalog"
              className="w-9 h-9 rounded-full bg-[#4a0a16] hover:bg-[#e5a93c] hover:text-[#1c0306] flex items-center justify-center text-xs text-white transition-colors"
              title="Pilihan Menu"
            >
              <span className="material-symbols-outlined text-sm">restaurant</span>
            </a>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top Hero Sub-header info badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              {/* Left Badge: Amber circle with soup/bowl icon + text */}
              <div className="flex items-center gap-3 max-w-sm">
                <div className="w-11 h-11 rounded-full bg-[#e5a93c] flex items-center justify-center text-[#1c0306] shrink-0 shadow-lg shadow-[#e5a93c]/20">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    soup_kitchen
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#e5a93c]">
                    DISCOVER BAKSO BLISS.
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[#faf7f2] font-semibold">
                    100% DAGING SAPI MURNI SEGAR SETIAP SUBUH.
                  </p>
                </div>
              </div>

              {/* Right Badge: Embark on culinary journey */}
              <div className="text-left sm:text-right max-w-sm">
                <div className="flex items-center sm:justify-end gap-1.5 text-[#e5a93c] mb-0.5">
                  <span className="material-symbols-outlined text-base">star</span>
                  <span className="material-symbols-outlined text-base">star</span>
                  <span className="material-symbols-outlined text-base">star</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#faf7f2] leading-snug">
                  LEGENDA KULINER NUSANTARA DENGAN KUAH KALDU GURIH
                </p>
                <Link
                  href="/produk"
                  className="text-[10px] font-black uppercase tracking-widest text-[#e5a93c] hover:text-amber-200 inline-flex items-center gap-1 mt-0.5 group"
                >
                  <span>LIHAT KOLEKSI LENGKAP</span>
                  <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            {/* Monumental Headline (Balanced & Proportional, Framing the Centerpiece) */}
            <div className="text-center my-3 sm:my-5 relative select-none">
              <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tight uppercase leading-[0.9] text-white">
                RASA ASLI
              </h1>
              <div className="relative inline-block mt-0.5 sm:mt-1">
                <h2 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tight uppercase leading-[0.9] text-white">
                  BAKSO <span className="text-[#e5a93c]">PAK MUL.</span>
                </h2>
                {/* Overlay warm gold cursive script font */}
                <span className="font-script text-3xl sm:text-5xl md:text-6xl text-[#fcd34d] absolute -top-4 sm:-top-7 left-1/2 -translate-x-1/2 rotate-[-5deg] drop-shadow-md whitespace-nowrap pointer-events-none">
                  Kuah Kaldu Asli
                </span>
              </div>
            </div>

            {/* Trio Showcase Visual (Elevated high into the center, completely filling the canvas!) */}
            <div className="relative max-w-3xl mx-auto -mt-6 sm:-mt-12 md:-mt-16 z-10 flex items-end justify-center">
              {/* Cup 1 - Left (Mie Ayam Telor Bebek) */}
              <div
                onClick={() => handleQuickAdd(displayList[2] || FALLBACK_PRODUCTS[2])}
                className="w-40 sm:w-56 -mr-6 sm:-mr-10 transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-10 group"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#e5a93c]/30 bg-[#36070e] aspect-[3/4]">
                  <img
                    src="/images/bakmie-telor-bebek.webp"
                    alt="Mie Telor Bebek Kenyal"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c0306] via-transparent to-transparent opacity-85" />
                  <div className="absolute bottom-3 inset-x-3 text-center bg-[#1c0306]/85 backdrop-blur-md py-1.5 px-2 rounded-xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#e5a93c]">
                      MIE TELOR BEBEK
                    </p>
                    <p className="text-[8px] uppercase tracking-wider text-white font-bold">
                      KENYAL ALAMI
                    </p>
                  </div>
                </div>
              </div>

              {/* Cup 2 - Center (Bakso Komplit - Dominant Hero Centerpiece) */}
              <div
                onClick={() => handleQuickAdd(displayList[0] || FALLBACK_PRODUCTS[0])}
                className="w-52 sm:w-68 md:w-76 transform z-20 hover:scale-105 transition-all duration-300 cursor-pointer group -mb-2 shadow-2xl"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#e5a93c] bg-[#36070e] aspect-[3/4]">
                  <img
                    src="/images/hero-banner.webp"
                    alt="Semangkuk Bakso Sapi Komplit Pak Mul"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c0306] via-transparent to-transparent opacity-75" />
                  <div className="absolute top-3 right-3 bg-[#e5a93c] text-[#1c0306] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                    SIGNATURE
                  </div>
                  <div className="absolute bottom-3 inset-x-3 text-center bg-[#e5a93c] py-2 px-2 rounded-xl shadow-lg">
                    <p className="text-xs font-black uppercase tracking-widest text-[#1c0306]">
                      BAKSO KOMPLIT
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-[#36070e] font-black">
                      100% DAGING SAPI MURNI
                    </p>
                  </div>
                </div>
              </div>

              {/* Cup 3 - Right (Bakso Urat Spesial) */}
              <div
                onClick={() => handleQuickAdd(displayList[1] || FALLBACK_PRODUCTS[1])}
                className="w-40 sm:w-56 -ml-6 sm:-ml-10 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-10 group"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#e5a93c]/30 bg-[#36070e] aspect-[3/4]">
                  <img
                    src="/images/bakso-citra-rasa-premium.webp"
                    alt="Bakso Urat Sapi Spesial"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c0306] via-transparent to-transparent opacity-85" />
                  <div className="absolute bottom-3 inset-x-3 text-center bg-[#1c0306]/85 backdrop-blur-md py-1.5 px-2 rounded-xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#e5a93c]">
                      BAKSO URAT
                    </p>
                    <p className="text-[8px] uppercase tracking-wider text-white font-bold">
                      CACAHAN URAT GURIH
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amber Feature Dock Card (docked under the centerpiece) */}
            <div className="max-w-4xl mx-auto mt-6 bg-[#e5a93c] rounded-3xl p-5 sm:p-7 shadow-2xl text-[#1c0306] flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-amber-300">
              {/* Left Part: Top rated culinary */}
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#1c0306] text-[#e5a93c] flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    verified
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider text-[#1c0306]">
                    TOP RATED KULINER
                  </h4>
                  <p className="text-[11px] font-extrabold text-[#36070e] mt-0.5">
                    RESEP TRADISIONAL 24+ TAHUN DENGAN 100% DAGING SAPI MURNI.
                  </p>
                </div>
              </div>

              {/* Middle Part: Rating score */}
              <div className="flex items-center gap-2 bg-[#1c0306]/10 px-5 py-2 rounded-2xl border border-[#1c0306]/15">
                <span className="font-headline text-4xl sm:text-5xl tracking-tight text-[#1c0306]">
                  4.98
                </span>
                <span className="material-symbols-outlined text-2xl text-[#1c0306] font-bold">
                  star
                </span>
              </div>

              {/* Right Part: Preview Item with mini-thumbnail & Order Button */}
              <div className="flex items-center gap-3 bg-white p-2.5 pr-4 rounded-2xl border border-[#1c0306]/10 shadow-sm w-full md:w-auto">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1c0306] shrink-0">
                  <img
                    src="/images/bakso-citra-rasa-premium.webp"
                    alt="Bakso Urat Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs font-black uppercase text-[#1c0306] truncate">
                    BAKSO SAPI URAT
                  </p>
                  <p className="text-[10px] text-[#51000d] truncate font-extrabold">
                    Rp 65.000 (50 Butir)
                  </p>
                </div>
                <button
                  onClick={() => handleQuickAdd(displayList[0] || FALLBACK_PRODUCTS[0])}
                  className="w-8 h-8 rounded-full bg-[#e5a93c] text-[#1c0306] hover:bg-amber-400 flex items-center justify-center font-bold shadow transition-transform active:scale-95 shrink-0"
                  title="Pesan Langsung"
                >
                  <span className="material-symbols-outlined text-base font-bold">add</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CROSSING RIBBON TAPE MARQUEE (DEEP MAROON & GOLD ACCENT BORDER)        */}
        {/* ========================================================================= */}
        <section className="relative py-8 bg-[#faf7f2] overflow-hidden select-none -my-3 z-20">
          <div className="bg-[#51000d] text-white py-3.5 shadow-xl transform -rotate-1 origin-left border-y-2 border-[#e5a93c]/50">
            <div className="flex gap-8 whitespace-nowrap animate-marquee font-headline text-lg sm:text-xl tracking-widest uppercase">
              {[...Array(2)].map((_, loopIdx) => (
                <div key={loopIdx} className="flex items-center gap-8 shrink-0">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#e5a93c] text-sm">
                      soup_kitchen
                    </span>
                    <span>BAKSO URAT SPESIAL</span>
                    <span className="text-[#e5a93c] font-bold">•</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span>MIE TELOR BEBEK</span>
                    <span className="text-[#e5a93c] font-bold">•</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span>BAKSO HALUS SUPER</span>
                    <span className="text-[#e5a93c] font-bold">•</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#e5a93c] text-sm">
                      local_dining
                    </span>
                    <span>PANGSIT RENYAH</span>
                    <span className="text-[#e5a93c] font-bold">•</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span>KUAH KALDU REMPAH</span>
                    <span className="text-[#e5a93c] font-bold">•</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span>100% DAGING SAPI MURNI</span>
                    <span className="text-[#e5a93c] font-bold">•</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#e5a93c] text-sm">
                      verified
                    </span>
                    <span>TAHU BAKSO GURIH</span>
                    <span className="text-[#e5a93c] font-bold">•</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span>KECAP &amp; SAUS TRADISIONAL</span>
                    <span className="text-[#e5a93c] font-bold">•</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. TYPOGRAPHIC STATEMENT SECTION (HIGH CONTRAST WARM ESPRESSO TEXT)       */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#faf7f2] relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative inline-block">
              {/* Yellow script overlay text */}
              <span className="font-script text-5xl sm:text-7xl md:text-8xl text-[#d97706] absolute -top-8 sm:-top-12 left-1/4 -translate-x-1/2 rotate-[-5deg] pointer-events-none drop-shadow-sm z-10">
                Resep Warisan
              </span>

              {/* Giant statement text with inline pill badges */}
              <h2 className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-[#1c1917] uppercase leading-[1.12]">
                DIBUAT DARI{" "}
                <span className="inline-flex items-center gap-2 bg-[#e5a93c] text-[#1c0306] px-4 py-1 rounded-full text-base sm:text-xl font-sans font-black align-middle shadow-sm">
                  <span className="material-symbols-outlined text-lg font-bold">local_dining</span>
                  <span>Nusantara</span>
                </span>{" "}
                100% DAGING SAPI MURNI PILIHAN{" "}
                <span className="inline-flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#51000d] text-[#e5a93c] align-middle shadow">
                  <span className="material-symbols-outlined text-lg sm:text-2xl">
                    soup_kitchen
                  </span>
                </span>{" "}
                DAN RACIKAN{" "}
                <span className="inline-block w-16 sm:w-24 h-8 sm:h-12 rounded-full overflow-hidden align-middle border-2 border-[#e5a93c] shadow">
                  <img
                    src="/images/hero-banner.webp"
                    alt="Bakso Kuah Pill"
                    className="w-full h-full object-cover"
                  />
                </span>{" "}
                KUAH KALDU REMPAH{" "}
                <span className="inline-block w-20 sm:w-28 h-8 sm:h-12 rounded-full overflow-hidden align-middle border-2 border-[#51000d] shadow">
                  <img
                    src="/images/bakmie-telor-bebek.webp"
                    alt="Mie Pill"
                    className="w-full h-full object-cover"
                  />
                </span>{" "}
                MERESAP SEMPURNA HINGGA TETES TERAKHIR
              </h2>
            </div>

            <p className="max-w-2xl mx-auto text-[#2b1b17] text-sm sm:text-base mt-8 leading-relaxed font-semibold">
              Kelezatan bakso sapi asli khas Pasar Kramat Jati. Diracik segar setiap subuh dari potongan daging sapi murni tanpa boraks dan tanpa pengawet buatan, menjaga cita rasa otentik yang dicintai keluarga dan ratusan warung mitra selama lebih dari 24 tahun.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. "MENU BY CATEGORIES" FLOATING ORGANIC TAG CLOUD                        */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#f5ede2] relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Section Header with Script Overlay */}
            <div className="relative inline-block mb-12">
              <h3 className="font-headline text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#1c1917] uppercase leading-none">
                PILIHAN MENU KAMI
              </h3>
              <span className="font-script text-4xl sm:text-6xl text-[#d97706] absolute -top-4 sm:-top-6 right-0 rotate-[-6deg] pointer-events-none drop-shadow-sm">
                Aneka Racikan
              </span>
            </div>

            {/* Floating Organic Bean-Shaped Category Tags */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
              {categories.map((cat, idx) => {
                const isSelected = activeCategory === cat.name;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      const el = document.getElementById("menu-catalog");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 text-xs sm:text-sm font-black tracking-wider transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer ${
                      isSelected
                        ? "bg-[#51000d] border-[#51000d] text-[#e5a93c] scale-105 shadow-lg"
                        : "bg-white hover:bg-stone-50 border-stone-300 text-[#1c1917] hover:border-[#e5a93c] hover:scale-105"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm text-[#e5a93c]">
                      restaurant
                    </span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {activeCategory !== "Semua" && (
              <div className="mt-6">
                <button
                  onClick={() => setActiveCategory("Semua")}
                  className="text-xs font-black text-[#7a0019] underline hover:text-[#51000d] cursor-pointer"
                >
                  Reset Filter (Tampilkan Semua Pilihan)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. MENU SELECTION CATALOG (CRISP, CONTRAST-RICH ARTISAN PRODUCT GRID)     */}
        {/* ========================================================================= */}
        <section id="menu-catalog" className="py-24 bg-[#faf7f2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7a0019]">
                  PILIHAN KEDAI
                </span>
                <h3 className="font-headline text-4xl sm:text-6xl text-[#1c1917] tracking-tight uppercase mt-1">
                  KOLEKSI RACIKAN TERBAIK
                </h3>
              </div>
              <Link
                href="/produk"
                className="mt-4 md:mt-0 px-6 py-3 rounded-full bg-[#1c0306] text-white hover:bg-[#36070e] text-xs font-bold uppercase tracking-wider flex items-center gap-2 group transition-all"
              >
                <span>BUKA HALAMAN PRODUK LENGKAP</span>
                <span className="material-symbols-outlined text-sm text-[#e5a93c] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDisplayProducts.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden border-2 border-stone-200 hover:border-[#e5a93c] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Presentation */}
                    <div className="relative h-56 overflow-hidden bg-[#1c0306]">
                      <img
                        src={item.image || "/images/hero-banner.webp"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                        onError={(e: any) => {
                          e.target.src = "/images/hero-banner.webp";
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[#51000d] text-[#e5a93c] font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        {item.category || "Bakso"}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-[#e5a93c] text-[#1c0306] font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span>{item.rating || "4.9"}</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <Link href={`/produk/${item.id}`} className="block">
                        <h4 className="font-extrabold text-[#1c1917] text-lg group-hover:text-[#7a0019] transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="text-[#2b1b17] text-xs mt-1.5 line-clamp-2 leading-relaxed font-medium">
                        {item.description || "Olahan segar berkualitas dari bahan baku murni terpilih khas Bakso Pak Mul."}
                      </p>
                      {item.unit && (
                        <p className="text-[11px] font-extrabold text-[#51000d] mt-2">
                          Kemasan: <span className="text-[#1c1917] font-semibold">{item.unit}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-2 border-t border-stone-100 flex items-center justify-between">
                    <div className="pt-3">
                      <span className="text-[10px] uppercase font-black text-[#51000d] block">
                        HARGA
                      </span>
                      <span className="font-headline text-2xl text-[#1c1917]">
                        Rp {(item.price || 0).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`mt-3 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
                        addedId === item.id
                          ? "bg-emerald-700 text-white"
                          : "bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm font-bold">
                        {addedId === item.id ? "check" : "add"}
                      </span>
                      <span>{addedId === item.id ? "MASUK" : "PESAN"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. QUALITY PILLARS (DEEP HIGH-CONTRAST TEXT & CLEAR NUMBERS)              */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7a0019]">
                STANDAR MUTU
              </span>
              <h3 className="font-headline text-3xl sm:text-5xl text-[#1c1917] tracking-tight uppercase mt-1">
                4 PILAR KUALITAS PAK MUL
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#faf7f2] p-6 rounded-3xl border border-stone-200 space-y-3">
                <span className="font-headline text-3xl text-[#7a0019]">01</span>
                <h4 className="font-extrabold text-base text-[#1c1917]">100% Daging Sapi Murni</h4>
                <p className="text-xs text-[#2b1b17] font-medium leading-relaxed">
                  Dipilih langsung dari pemotongan halal pasar induk setiap subuh tanpa campuran boraks maupun pengawet sintetis.
                </p>
              </div>

              <div className="bg-[#faf7f2] p-6 rounded-3xl border border-stone-200 space-y-3">
                <span className="font-headline text-3xl text-[#7a0019]">02</span>
                <h4 className="font-extrabold text-base text-[#1c1917]">Kuah Kaldu Sumsum Asli</h4>
                <p className="text-xs text-[#2b1b17] font-medium leading-relaxed">
                  Sari rebusan tulang sumsum sapi berpadu tumisan bawang putih harum, menghasilkan aroma kaldu yang gurih alami.
                </p>
              </div>

              <div className="bg-[#faf7f2] p-6 rounded-3xl border border-stone-200 space-y-3">
                <span className="font-headline text-3xl text-[#7a0019]">03</span>
                <h4 className="font-extrabold text-base text-[#1c1917]">Tradisi Sejak Tahun 2000</h4>
                <p className="text-xs text-[#2b1b17] font-medium leading-relaxed">
                  Dipercaya lebih dari 24 tahun melayani kebutuhan santapan keluarga dan ratusan warung mitra se-Jabodetabek.
                </p>
              </div>

              <div className="bg-[#faf7f2] p-6 rounded-3xl border border-stone-200 space-y-3">
                <span className="font-headline text-3xl text-[#7a0019]">04</span>
                <h4 className="font-extrabold text-base text-[#1c1917]">Segel Higienis &amp; Kirim Segar</h4>
                <p className="text-xs text-[#2b1b17] font-medium leading-relaxed">
                  Dikemas rapi dalam standar mutu makanan untuk menjaga kebersihan dan kesegaran terbaik tiba di dapur Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. THE AUTHENTIC STORY SECTION (EDITORIAL SPREAD)                         */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#faf7f2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Portrait of Pak Mul at the Kiosk */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#1c0306] border-4 border-[#e5a93c]/30 group">
                  <img
                    alt="Pak Mul di Kios Tradisional Pasar Kramat Jati"
                    className="w-full h-[420px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    src="/images/toko-pak-mul-kramat-jati.webp"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c0306]/90 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e5a93c]">
                      Dokumentasi Kios Asli
                    </span>
                    <p className="font-headline text-2xl tracking-wide uppercase mt-1 text-white">
                      Pak Mul di Kios Kramat Jati
                    </p>
                    <p className="font-sans text-xs text-[#fef3c7] mt-0.5 font-medium">
                      Melayani pelanggan sejak subuh hari tanpa henti
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Dedication */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-[#7a0019]" />
                  <p className="text-[11px] font-extrabold tracking-[0.25em] text-[#7a0019] uppercase font-sans">
                    Kisah &amp; Filosofi Rasa
                  </p>
                </div>

                <blockquote className="font-headline text-3xl sm:text-4xl text-[#1c1917] uppercase leading-tight tracking-wide">
                  &ldquo;Bagi kami, membuat bakso bukan sekadar menggiling daging, melainkan menjaga amanah rasa yang sudah dipercaya keluarga sejak generasi pertama.&rdquo;
                </blockquote>

                <p className="font-sans text-[#241410] text-sm sm:text-base leading-relaxed font-medium">
                  Bermula dari kios kayu sederhana di lantai dasar Pasar Kramat Jati Jakarta Timur, Pak Mul mengawali hari setiap pukul 04.30 subuh untuk memilih potongan daging sapi terbaik dari pemotongan lokal. Tanpa pengenyal kimiawi, tanpa rekayasa buatan. Hanya daging sapi murni, takaran bumbu rempah yang pas, dan dedikasi menjaga konsistensi rasa selama lebih dari 24 tahun.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 rounded-full bg-[#1c0306] hover:bg-[#36070e] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-[#e5a93c]">near_me</span>
                    <span>Petunjuk Arah Kios Pasar Kramat Jati</span>
                  </a>
                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20berkunjung%20ke%20kios%20langsung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-[#1c1917] font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-emerald-700 text-base">chat</span>
                    <span>Hubungi Kios via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. TESTIMONIALS (WARM EDITORIAL, CRISP DARK TEXT)                         */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <p className="text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase mb-1">
                Ulasan Pelanggan Setia
              </p>
              <h2 className="font-headline text-3xl sm:text-5xl text-[#1c1917] tracking-tight uppercase">
                DIPERCAYA TURUN TEMURUN
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-[#faf7f2] p-7 rounded-3xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-[#e5a93c] text-sm mb-3">★★★★★</div>
                  <p className="font-sans text-sm text-[#1f130e] leading-relaxed font-semibold">
                    &ldquo;Sudah 6 tahun langganan mie telor bebek dan bakso urat Pak Mul untuk gerobak mie ayam saya. Mie-nya kenyal tidak mudah hancur saat direbus, pelanggan selalu puji kuahnya mantap.&rdquo;
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#51000d] text-amber-200 font-headline font-bold text-xs flex items-center justify-center">
                    MB
                  </div>
                  <div>
                    <p className="font-black text-xs text-[#1c1917]">Mas Bambang</p>
                    <p className="text-[11px] text-[#51000d] font-bold">Mie Ayam Podomoro, Ciracas</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-[#faf7f2] p-7 rounded-3xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-[#e5a93c] text-sm mb-3">★★★★★</div>
                  <p className="font-sans text-sm text-[#1f130e] leading-relaxed font-semibold">
                    &ldquo;Beli bakso halus buat acara arisan dan hajatan keluarga di rumah. Daging sapinya berasa sekali, bukan cuma tepung. Pengiriman tepat waktu dan baksonya masih dingin beku segar.&rdquo;
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#51000d] text-amber-200 font-headline font-bold text-xs flex items-center justify-center">
                    SR
                  </div>
                  <div>
                    <p className="font-black text-xs text-[#1c1917]">Ibu Siti Rahma</p>
                    <p className="text-[11px] text-[#51000d] font-bold">Ibu Rumah Tangga, Kramat Jati</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-[#faf7f2] p-7 rounded-3xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-[#e5a93c] text-sm mb-3">★★★★★</div>
                  <p className="font-sans text-sm text-[#1f130e] leading-relaxed font-semibold">
                    &ldquo;Pesanan grosir untuk katering pabrik selalu aman. Kulit pangsitnya renyah kalau digoreng, tidak banyak menyerap minyak. Pelayanan cepat dan responsif saat ada pesanan dadakan.&rdquo;
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#51000d] text-amber-200 font-headline font-bold text-xs flex items-center justify-center">
                    HW
                  </div>
                  <div>
                    <p className="font-black text-xs text-[#1c1917]">Pak Hendra Wijaya</p>
                    <p className="text-[11px] text-[#51000d] font-bold">Katering Berkah Mandiri, Pulogadung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. "ORDER NOW" SECTION (CRISP WARM CREAM TEXT ON DARK WINE)               */}
        {/* ========================================================================= */}
        <section className="relative bg-[#1c0306] text-white py-24 sm:py-32 overflow-hidden text-center">
          {/* Subtle warm backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(229,169,60,0.15)_0%,_transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e5a93c]/20 text-[#e5a93c] font-black text-xs uppercase tracking-widest border border-[#e5a93c]/40 mb-4">
              PESAN SEGAR LANGSUNG KE RUMAH
            </span>
            <h2 className="font-headline text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-[0.92] text-white">
              NIKMATI KEHANGATAN{" "}
              <span className="text-[#e5a93c]">BAKSO SAPI ASLI</span> HARI INI
            </h2>
            <p className="max-w-xl mx-auto text-[#fef3c7] text-xs sm:text-sm mt-6 font-semibold leading-relaxed">
              Dibuat segar setiap hari, dikemas vakum higienis, dan dikirim aman ke seluruh Jabodetabek. Nikmati semangkuk bakso otentik bersama keluarga.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/produk"
                className="px-8 py-4 rounded-full bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306] font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>JELAJAHI MENU LENGKAP</span>
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </Link>
              <a
                href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20tanya%20pesanan%20langsung"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/30 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-emerald-400 text-base">chat</span>
                <span>KONSULTASI WHATSAPP</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#1c0306] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-[#e5a93c]/40 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-[#e5a93c] text-base">
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