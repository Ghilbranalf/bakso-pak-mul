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
    <div className="min-h-[100dvh] bg-[#faf8f5] text-[#1c1917] font-sans antialiased flex flex-col justify-between selection:bg-[#7a0019] selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* ARTISAN HEADER BANNER                                                     */}
        {/* ========================================================================= */}
        <section className="relative bg-[#1c0306] text-white pt-32 sm:pt-40 pb-16 sm:pb-24 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#7a0019]/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-stone-200 text-xs font-semibold mb-4">
              <span>Katalog Kios Pasar Kramat Jati</span>
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl uppercase text-white font-black tracking-tight leading-tight">
              Koleksi Menu &amp; Bahan Baku
            </h1>

            <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base mt-4 font-normal leading-relaxed">
              Daging sapi murni segar tanpa campuran boraks, mie basah telor bebek kenyal, kulit pangsit lembut, dan bumbu kaldu warisan siap kirim ke dapur Anda.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FILTER BAR & ORGANIC CATEGORY PILLS                                       */}
        {/* ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCurrentPage(1);
                    }}
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

            {/* Sort & Count */}
            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 shrink-0">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-700 font-semibold">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white ring-1 ring-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 outline-none focus:ring-2 focus:ring-[#7a0019] cursor-pointer"
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
            <div className="mt-4 flex items-center gap-2 text-xs text-[#1c1917] bg-white p-3.5 rounded-2xl ring-1 ring-stone-200 font-medium">
              <span>Hasil penelusuran untuk: &ldquo;<strong>{queryParam}</strong>&rdquo;</span>
              <button
                onClick={() => router.push("/produk")}
                className="ml-auto text-xs text-[#7a0019] hover:underline font-bold cursor-pointer flex items-center gap-1"
              >
                <span>Hapus Pencarian</span>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PRODUCT GRID: DOUBLE-BEZEL NESTED CARD ARCHITECTURE                       */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded-[1.75rem] bg-stone-200/60 h-88"
                />
              ))
            ) : paginatedProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-[#1c1917] font-semibold text-sm bg-white rounded-3xl p-8">
                <span className="material-symbols-outlined text-5xl text-stone-400 mb-2 block">
                  soup_kitchen
                </span>
                <p className="font-headline text-xl font-bold mt-2">Tidak Ada Menu yang Cocok</p>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Coba ubah kata kunci pencarian atau reset filter kategori.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("Semua");
                    router.push("/produk");
                  }}
                  className="mt-5 px-6 py-3 bg-[#7a0019] hover:bg-[#51000d] text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Tampilkan Semua Racikan
                </button>
              </div>
            ) : (
              paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-1.5 rounded-[1.75rem] bg-stone-100/80 transition-colors duration-200 flex flex-col justify-between group"
                >
                  <div className="rounded-[calc(1.75rem-0.375rem)] bg-white p-4 flex flex-col justify-between h-full">
                    <div>
                      {/* Image Box */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-4">
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={product.image || "/images/hero-banner.webp"}
                          onError={(e: any) => {
                            e.target.src = "/images/hero-banner.webp";
                          }}
                        />
                        {product.unit && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-stone-800">
                            {product.unit}
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-[#7a0019]">
                            {product.category || "Olahan Sapi"}
                          </span>
                          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                            <span
                              className="material-symbols-outlined text-amber-500 text-sm"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span>{product.rating || "5.0"}</span>
                          </span>
                        </div>

                        <Link href={`/produk/${product.id}`} className="block">
                          <h3 className="font-headline font-bold text-base text-[#1c1917] group-hover:text-[#7a0019] transition-colors duration-200 line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="font-editorial text-[13px] text-stone-600 line-clamp-2 leading-relaxed font-normal">
                          {product.description || "Olahan segar berkualitas dari bahan baku murni terpilih khas Bakso Pak Mul."}
                        </p>
                      </div>
                    </div>

                    {/* Card Bottom Bar */}
                    <div className="pt-4 mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 font-semibold block">
                          Harga Pas
                        </span>
                        <span className="font-headline font-bold text-lg text-[#1c1917]">
                          Rp {(product.price || 0).toLocaleString("id-ID")}
                        </span>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        className={`rounded-full px-4 py-2 font-bold text-xs transition-colors duration-200 flex items-center gap-1.5 active:scale-[0.96] cursor-pointer ${
                          addedId === product.id
                            ? "bg-emerald-700 text-white"
                            : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">
                          {addedId === product.id ? "check" : "add"}
                        </span>
                        <span>{addedId === product.id ? "Masuk" : "Pesan"}</span>
                      </button>
                    </div>
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
                className="px-4 py-2 rounded-full bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === idx + 1
                      ? "bg-[#7a0019] text-white"
                      : "bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-full bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Cart Toast */}
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

      <CartSidebar />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] bg-[#faf8f5] flex items-center justify-center">
          <p className="text-xs font-semibold text-stone-500">Memuat katalog...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}