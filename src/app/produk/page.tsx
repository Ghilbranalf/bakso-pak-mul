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
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col justify-between pt-20 sm:pt-24">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Title & Subtitle */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Katalog Menu &amp; Bahan Baku
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
                Bahan baku segar dari kios Pasar Kramat Jati untuk santapan rumah maupun usaha warung.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#7a0019] cursor-pointer"
              >
                <option value="rekomendasi">Rekomendasi</option>
                <option value="murah">Harga Terendah</option>
                <option value="mahal">Harga Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Search Query Pill (if active) */}
          {queryParam && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span>Hasil pencarian untuk: &ldquo;<strong>{queryParam}</strong>&rdquo;</span>
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#7a0019] text-white font-semibold shadow-xs"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
              Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-4 h-72 animate-pulse"
              />
            ))
          ) : paginatedProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 text-sm">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
                search_off
              </span>
              Tidak ada produk yang cocok dengan pencarian ini.
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <Link href={`/produk/${product.id}`} className="block relative aspect-square bg-slate-50 p-4 overflow-hidden">
                  <img
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    src={product.image || "/images/hero-banner.webp"}
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                    {product.category || "Produk"}
                  </span>
                </Link>

                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/produk/${product.id}`} className="block">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-[#7a0019] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Kemasan: <span className="font-medium text-slate-700">{product.unit || "Pack"}</span>
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      {product.originalPrice && (
                        <p className="text-[10px] text-slate-400 line-through">
                          Rp {product.originalPrice.toLocaleString("id-ID")}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm font-extrabold text-[#7a0019]">
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
                      className={`h-8 sm:h-9 px-3 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        addedId === product.id
                          ? "bg-emerald-600 text-white"
                          : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                      }`}
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
          <div className="mt-10 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-xs text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              ←
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-[#7a0019] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-xs text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              →
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-slate-800">
          <span className="material-symbols-outlined text-emerald-400 text-base">
            check_circle
          </span>
          <span>{toastMessage} berhasil masuk keranjang</span>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#7a0019] font-bold">
          Memuat katalog produk...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
