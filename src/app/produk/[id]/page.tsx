"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const rawId = params?.id as string;

  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(5.0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!rawId) return;

    const fetchProductAndReviews = async () => {
      try {
        setIsLoading(true);

        const resProd = await fetch(`/api/products/${encodeURIComponent(rawId)}`);
        if (resProd.ok) {
          const dataProd = await resProd.json();
          setProduct(dataProd.product);
        }

        const resRev = await fetch(`/api/reviews?productId=${encodeURIComponent(rawId)}`);
        if (resRev.ok) {
          const dataRev = await resRev.json();
          setReviews(dataRev.reviews || []);
          setAvgRating(dataRev.avgRating || 5.0);
          setTotalReviews(dataRev.totalReviews || 0);
        }
      } catch (err) {
        console.error("Failed to load product detail:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [rawId]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    setIsSubmittingReview(true);
    setReviewMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: rawId,
          userName: reviewerName || "Pelanggan Bakso Pak Mul",
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal mengirim ulasan.");
      }

      setReviewMessage("Ulasan Anda berhasil ditambahkan!");
      setComment("");

      const resRev = await fetch(`/api/reviews?productId=${encodeURIComponent(rawId)}`);
      if (resRev.ok) {
        const dataRev = await resRev.json();
        setReviews(dataRev.reviews || []);
        setAvgRating(dataRev.avgRating || 5.0);
        setTotalReviews(dataRev.totalReviews || 0);
      }

      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewMessage(null);
      }, 1200);
    } catch (err: any) {
      setReviewMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatPrice = (price: number) => {
    return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Fallback demo product
  const displayProduct = product || {
    id: rawId,
    name: "Bakso Sapi Spesial Pak Mul",
    price: 35000,
    originalPrice: 45000,
    unit: "Pack 500g",
    category: "Bakso Sapi",
    description:
      "Bakso urat sapi asli khas Pak Mul dengan tekstur kenyal alami, dibuat dari 100% daging sapi segar pilihan pasar subuh dengan rempah warisan 20+ tahun tanpa boraks.",
    image: "/images/hero-banner.webp",
    badge: "Paling Diminati",
    stock: 50,
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans antialiased flex flex-col pt-20 selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#1c1917]">
          <Link href="/produk" className="hover:text-[#51000d] transition-colors">
            Katalog Produk
          </Link>
          <span>/</span>
          <span className="text-[#51000d] font-extrabold truncate max-w-xs sm:max-w-md">
            {displayProduct.name}
          </span>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center bg-stone-50 rounded-xl p-8 overflow-hidden border border-stone-200">
            {displayProduct.badge && (
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#200407] text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-xs">
                {displayProduct.badge}
              </span>
            )}
            <img
              src={displayProduct.image || "/images/hero-banner.webp"}
              alt={displayProduct.name}
              className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
            />
          </div>

          {/* Info Column */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                <span className="text-[#7a0019]">{displayProduct.category || "Olahan Daging Sapi"}</span>
                {totalReviews > 0 && (
                  <span className="text-stone-500">{avgRating} / 5.0 ({totalReviews} Ulasan)</span>
                )}
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c1917] tracking-tight leading-tight">
                {displayProduct.name}
              </h1>
              {displayProduct.unit && (
                <p className="text-sm text-stone-600 font-medium mt-1.5">
                  {displayProduct.unit}
                </p>
              )}
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-headline text-3xl sm:text-4xl font-extrabold text-[#7a0019]">
                Rp {formatPrice(displayProduct.price)}
              </span>
              {displayProduct.originalPrice && (
                <span className="text-sm font-semibold text-stone-500 line-through">
                  Rp {formatPrice(displayProduct.originalPrice)}
                </span>
              )}
            </div>

            <p className="font-editorial text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              {displayProduct.description ||
                "Produk makanan berkualitas tinggi khas Bakso Pak Mul. Dibuat dengan higienis tanpa bahan pengawet berlebihan."}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  addToCart(displayProduct);
                  openCart();
                }}
                className="flex-1 py-3.5 bg-[#7a0019] hover:bg-[#51000d] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-lg">
                  shopping_bag
                </span>
                <span>Tambah ke Keranjang</span>
              </button>

              <a
                href={`https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20tertarik%20pesan%20${encodeURIComponent(
                  displayProduct.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Tanya via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
                Rating &amp; Ulasan Pembeli
              </h2>
              <p className="font-editorial text-xs text-stone-600 font-normal mt-0.5">
                Pengalaman jujur dari pembeli dan penikmat setia Bakso Pak Mul
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 bg-[#7a0019] hover:bg-[#51000d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 shrink-0 shadow-xs"
            >
              <span className="material-symbols-outlined text-base">rate_review</span>
              <span>Tulis Ulasan</span>
            </button>
          </div>

          {/* Rating Overview */}
          <div className="bg-[#faf8f5] p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="text-center shrink-0">
              <span className="font-headline text-5xl font-bold text-[#7a0019]">
                {avgRating}
              </span>
              <div className="flex justify-center text-amber-500 text-base my-1">
                {"★".repeat(Math.round(avgRating))}
              </div>
              <span className="text-xs font-medium text-stone-500">
                {totalReviews} Penilaian Pembeli
              </span>
            </div>
            <div className="flex-1 text-xs text-stone-600 space-y-1.5 w-full">
              <p className="font-bold text-stone-800 mb-2">Mengapa Pembeli Memilih Bakso Pak Mul?</p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span>
                <span>100% Daging Sapi Pilihan, tekstur kenyal alami tanpa bahan pengawet</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span>
                <span>Pengemasan higienis tahan perjalanan dan terjaga suhunya</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span>
                <span>Garansi cita rasa otentik dari Kios Pasar Kramat Jati sejak tahun 2000</span>
              </p>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4 pt-2">
            {reviews.length === 0 ? (
              <p className="text-xs text-stone-400 italic text-center py-8">
                Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan testimoni rasa!
              </p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-[#faf8f5] rounded-xl border border-stone-200 space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#7a0019] text-white font-headline font-bold text-xs flex items-center justify-center">
                        {(rev.userName || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-headline text-xs font-bold text-stone-900">{rev.userName}</h4>
                        <div className="flex text-amber-500 text-xs">
                          {"★".repeat(rev.rating || 5)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {new Date(rev.createdAt || Date.now()).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <p className="font-editorial text-xs text-stone-700 font-normal pl-12 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* WRITE REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 border border-stone-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#51000d]">rate_review</span>
                <span>Tulis Ulasan Produk</span>
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {reviewMessage && (
              <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs font-semibold">
                {reviewMessage}
              </div>
            )}

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Anda</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Misal: Budi Santoso"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 bg-stone-50 focus:bg-white focus:border-[#51000d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Pilih Bintang (Rating)
                </label>
                <div className="flex gap-2 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={star <= rating ? "text-amber-500" : "text-stone-300"}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Komentar &amp; Ulasan Rasa *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Bagikan kesan rasa, kekenyalan, dan kesegaran produk Bakso Pak Mul..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-normal text-stone-900 bg-stone-50 focus:bg-white focus:border-[#51000d] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-3.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingReview ? "Mengirim Ulasan..." : "Kirim Ulasan Sekarang"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
