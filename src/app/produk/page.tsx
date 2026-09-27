"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

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
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", { signal: controller.signal });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch products", err);
        }
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

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        queryParam &&
        !p.name.toLowerCase().includes(queryParam.toLowerCase()) &&
        !p.category?.toLowerCase().includes(queryParam.toLowerCase())
      ) {
        return false;
      }

      if (selectedCategory === "Semua") return true;

      const cat = selectedCategory.toLowerCase();
      if (cat === "kecap") return p.name.toLowerCase().includes("kecap");
      if (cat === "saos") return p.name.toLowerCase().includes("saos");
      if (cat === "pangsit") return p.name.toLowerCase().includes("pangsit");
      return (
        p.category?.toLowerCase().includes(cat) ||
        p.name?.toLowerCase().includes(cat)
      );
    });
  }, [products, queryParam, selectedCategory]);

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

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans flex flex-col justify-between pt-20 sm:pt-24 selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* Header Title & Subtitle */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase mb-2">
                <span className="w-6 h-[1px] bg-[#7a0019]" />
                <span>Kios Pasar Kramat Jati</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight">
                Koleksi Menu &amp; Bahan Baku
              </h1>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-xl">
                Racikan daging sapi segar dan bahan berkualitas pilihan harian untuk santapan meja keluarga maupun mitra usaha warung makan.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-stone-500 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 outline-none focus:border-[#7a0019] cursor-pointer shadow-2xs"
              >
                <option value="rekomendasi">Pilihan Rekomendasi</option>
                <option value="murah">Harga Terendah</option>
                <option value="mahal">Harga Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Search Query Pill (if active) */}
          {queryParam && (
            <div className="mt-4 flex items-center gap-2 text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
              <span>Hasil penelusuran untuk: &ldquo;<strong>{queryParam}</strong>&rdquo;</span>
              <button
                onClick={() => router.push("/produk")}
                className="ml-auto text-xs text-[#7a0019] hover:underline font-semibold cursor-pointer"
              >
                Hapus Pencarian ✕
              </button>
            </div>
          )}

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {["Semua", "Bakso", "Mie", "Pangsit", "Bumbu", "Kecap", "Saos"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#51000d] text-white shadow-xs"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {cat === "Semua" ? "Semua Menu" : cat}
              </button>
            ))}
            <span className="text-xs text-stone-400 ml-auto hidden sm:inline">
              Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl h-80 animate-pulse border border-stone-100 shadow-2xs"
              />
            ))
          ) : paginatedProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-stone-500 text-sm bg-white rounded-2xl border border-stone-200">
              <span className="material-symbols-outlined text-4xl text-stone-300 mb-2 block">
                soup_kitchen
              </span>
              Tidak ada produk yang cocok dengan pencarian ini.
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="artisanal-card group overflow-hidden flex flex-col justify-between"
              >
                <Link
                  href={`/produk/${product.id}`}
                  className="block relative aspect-square bg-[#f5f0e8] p-5 overflow-hidden"
                >
                  <img
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500"
                    src={product.image || "/images/hero-banner.webp"}
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#51000d] text-[10px] font-bold px-2.5 py-1 rounded-md shadow-2xs tracking-wide">
                    {product.category || "Produk"}
                  </span>
                </Link>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-600 text-xs mb-1.5">
                      <span>★★★★★</span>
                      <span className="text-[10px] text-stone-400 font-medium">(4.9)</span>
                    </div>

                    <Link href={`/produk/${product.id}`} className="block">
                      <h3 className="font-display text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-[#7a0019] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-[11px] text-stone-500 mt-1">
                      Kemasan: <span className="font-semibold text-stone-700">{product.unit || "Pack"}</span>
                    </p>
                  </div>

                  <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      {product.originalPrice && (
                        <p className="text-[10px] text-stone-400 line-through">
                          Rp {product.originalPrice.toLocaleString("id-ID")}
                        </p>
                      )}
                      <p className="font-display text-base sm:text-lg font-extrabold text-[#7a0019]">
                        Rp {(product.price || 0).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          unit: product.unit,
                        });
                        setAddedId(product.id);
                        setToastMessage(product.name);
                        setTimeout(() => setAddedId(null), 1500);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
                        addedId === product.id
                          ? "bg-emerald-700 text-white"
                          : "bg-[#51000d] hover:bg-[#7a0019] text-white"
                      }`}
                      title="Tambah ke Keranjang"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {addedId === product.id ? "check" : "add"}
                      </span>
                      <span>{addedId === product.id ? "Masuk" : "Beli"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-xs text-stone-600 disabled:opacity-40 hover:bg-stone-50 cursor-pointer shadow-2xs"
            >
              ←
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    currentPage === page
                      ? "bg-[#51000d] text-white"
                      : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-xs text-stone-600 disabled:opacity-40 hover:bg-stone-50 cursor-pointer shadow-2xs"
            >
              →
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#1c1917] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium border border-stone-700">
          <span className="material-symbols-outlined text-emerald-400 text-base">
            check_circle
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
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#7a0019] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
