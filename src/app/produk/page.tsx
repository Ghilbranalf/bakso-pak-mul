"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

// Fallback catalog items so the catalog always looks rich and appetizing
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

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState<"rekomendasi" | "murah" | "mahal">("rekomendasi");

  const itemsPerPage = 12;

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", { signal: controller.signal });
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn("Using fallback catalog for products:", err);
        }
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const displayList = products.length > 0 ? products : FALLBACK_PRODUCTS;

  const filteredProducts = useMemo(() => {
    return displayList.filter((p) => {
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory) return false;
      }
      if (selectedCategory === "Semua") return true;
      const cat = selectedCategory.toLowerCase();
      return (
        p.category?.toLowerCase().includes(cat) ||
        p.name?.toLowerCase().includes(cat)
      );
    });
  }, [displayList, queryParam, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts];
    if (sortBy === "murah") {
      return copy.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === "mahal") {
      return copy.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    // Default recommendation priority: Bakso -> Mie -> Pangsit -> Bumbu
    const getPriority = (p: any) => {
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      if (
        cat.includes("bumbu") ||
        cat.includes("saos") ||
        cat.includes("kecap") ||
        name.includes("bumbu") ||
        name.includes("saos") ||
        name.includes("kecap")
      ) {
        return 99;
      }
      if (cat.includes("bakso") || name.includes("bakso")) return 1;
      if (cat.includes("mie") || name.includes("mie")) return 2;
      if (cat.includes("pangsit") || name.includes("pangsit")) return 3;
      return 10;
    };
    return copy.sort((a, b) => getPriority(a) - getPriority(b));
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917] font-sans antialiased flex flex-col justify-between selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-20 sm:pt-24">
        {/* ========================================================================= */}
        {/* ARTISAN POSTER HEADER BANNER (HARMONIOUS WITH HERO)                       */}
        {/* ========================================================================= */}
        <section className="relative bg-[#1c0306] text-white py-14 sm:py-20 overflow-hidden border-b border-[#420812]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,169,60,0.12)_0%,_transparent_70%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e5a93c]/20 text-[#e5a93c] border border-[#e5a93c]/30 text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="material-symbols-outlined text-sm">storefront</span>
              <span>Katalog Kios Pasar Kramat Jati</span>
            </div>

            <div className="relative inline-block">
              <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl uppercase text-white tracking-tight leading-tight">
                KOLEKSI MENU &amp; BAHAN BAKU
              </h1>
              <span className="font-script text-3xl sm:text-5xl md:text-6xl text-[#fcd34d] absolute -top-4 sm:-top-7 right-0 rotate-[-5deg] pointer-events-none drop-shadow-md">
                Racikan Asli
              </span>
            </div>

            <p className="max-w-2xl mx-auto text-[#fef3c7] text-xs sm:text-sm mt-3 font-semibold leading-relaxed">
              Daging sapi murni segar tanpa campuran boraks, mie basah telor bebek kenyal, kulit pangsit lembut, dan bumbu kaldu warisan siap kirim ke meja Anda.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FILTER BAR & ORGANIC CATEGORY PILLS                                       */}
        {/* ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            {/* Category Chips matching Beranda */}
            <div className="flex flex-wrap items-center gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setCurrentPage(1);
                  }}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    selectedCategory === cat.name
                      ? "bg-[#51000d] text-[#e5a93c] border-2 border-[#51000d] shadow-md scale-105"
                      : "bg-white text-[#1c1917] hover:bg-stone-50 border-2 border-stone-200 hover:border-[#e5a93c] hover:scale-105"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-[#e5a93c]">
                    restaurant
                  </span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0">
              <span className="text-xs text-[#51000d] font-bold hidden sm:inline">
                Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#1c1917] font-bold">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border-2 border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-[#1c1917] outline-none focus:border-[#7a0019] cursor-pointer shadow-xs"
                >
                  <option value="rekomendasi">Pilihan Rekomendasi</option>
                  <option value="murah">Harga Terendah</option>
                  <option value="mahal">Harga Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Query Pill (if active) */}
          {queryParam && (
            <div className="mt-4 flex items-center gap-2 text-xs text-[#1c1917] bg-white p-3 rounded-2xl border-2 border-stone-200 shadow-xs font-medium">
              <span>Hasil penelusuran untuk: &ldquo;<strong>{queryParam}</strong>&rdquo;</span>
              <button
                onClick={() => router.push("/produk")}
                className="ml-auto text-xs text-[#7a0019] hover:underline font-black cursor-pointer"
              >
                Hapus Pencarian ✕
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PRODUCT GRID (MATCHING ARTISAN POSTER CARDS ON HOME VIEW)                 */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl h-88 animate-pulse border-2 border-stone-100 shadow-xs"
                />
              ))
            ) : paginatedProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-[#1c1917] font-semibold text-sm bg-white rounded-3xl border-2 border-stone-200 p-8">
                <span className="material-symbols-outlined text-5xl text-[#51000d] mb-2 block">
                  soup_kitchen
                </span>
                <p className="font-headline text-xl uppercase mt-1">Tidak Ada Menu yang Cocok</p>
                <p className="text-xs text-[#51000d] font-medium mt-1">
                  Coba ubah kata kunci pencarian atau reset filter kategori.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("Semua");
                    router.push("/produk");
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#51000d] text-[#e5a93c] rounded-full text-xs font-bold uppercase tracking-wider shadow"
                >
                  Tampilkan Semua Racikan
                </button>
              </div>
            ) : (
              paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl overflow-hidden border-2 border-stone-200 hover:border-[#e5a93c] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative h-60 overflow-hidden bg-[#1c0306]">
                      <img
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                        src={product.image || "/images/hero-banner.webp"}
                        onError={(e: any) => {
                          e.target.src = "/images/hero-banner.webp";
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[#51000d] text-[#e5a93c] font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        {product.category || "Bakso"}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-[#e5a93c] text-[#1c0306] font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span>{product.rating || "4.9"}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <Link href={`/produk/${product.id}`} className="block">
                        <h3 className="font-headline text-lg uppercase text-[#1c1917] group-hover:text-[#7a0019] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[#2b1b17] text-xs mt-1.5 line-clamp-2 leading-relaxed font-medium">
                        {product.description || "Olahan segar berkualitas dari bahan baku murni terpilih khas Bakso Pak Mul."}
                      </p>
                      {product.unit && (
                        <p className="text-[11px] font-extrabold text-[#51000d] mt-2">
                          Kemasan: <span className="text-[#1c1917] font-semibold">{product.unit}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="p-5 pt-0 mt-2 border-t border-stone-100 flex items-center justify-between">
                    <div className="pt-3">
                      <span className="text-[10px] uppercase font-black text-[#51000d] block">
                        HARGA
                      </span>
                      <span className="font-headline text-2xl text-[#1c1917]">
                        Rp {(product.price || 0).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className={`mt-3 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
                        addedId === product.id
                          ? "bg-emerald-700 text-white"
                          : "bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm font-bold">
                        {addedId === product.id ? "check" : "add"}
                      </span>
                      <span>{addedId === product.id ? "MASUK" : "PESAN"}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-full border-2 border-stone-200 bg-white text-xs font-bold text-[#1c1917] hover:border-[#51000d] disabled:opacity-40 cursor-pointer"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-9 h-9 rounded-full text-xs font-black transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? "bg-[#51000d] text-[#e5a93c] shadow-md"
                      : "bg-white border-2 border-stone-200 text-[#1c1917] hover:border-[#e5a93c]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-full border-2 border-stone-200 bg-white text-xs font-bold text-[#1c1917] hover:border-[#51000d] disabled:opacity-40 cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          )}
        </div>
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#51000d] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}