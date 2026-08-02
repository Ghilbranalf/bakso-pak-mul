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

        // Fetch Product
        const resProd = await fetch(`/api/products/${encodeURIComponent(rawId)}`);
        if (resProd.ok) {
          const dataProd = await resProd.json();
          setProduct(dataProd.product);
        }

        // Fetch Reviews
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

      // Refresh reviews list
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
    name: "Bakso Urat Sapi Pak Mul (Spesial 500g)",
    price: 35000,
    originalPrice: 45000,
    unit: "pack 500g",
    category: "Bakso Sapi",
    description: "Bakso urat sapi asli khas Pak Mul dengan tekstur renyah, daging sapi pilihan 100%, dan bumbu rempah pilihan.",
    image: "/images/Saos Pedas Lima Delapan.png",
    badge: "Terlaris",
    stock: 50,
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/produk" className="hover:text-[#51000d]">Katalog Produk</Link>
          <span>/</span>
          <span className="text-[#51000d] font-bold">{displayProduct.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Image Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
            {displayProduct.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#51000d] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                {displayProduct.badge}
              </span>
            )}
            <img
              src={displayProduct.image || "/images/saos-pedas-lima-delapan.jpg"}
              alt={displayProduct.name}
              className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Info Column */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-100 text-[#51000d] text-xs font-bold rounded-full">
                  {displayProduct.category}
                </span>
                <div className="flex items-center text-amber-400 text-sm font-bold gap-1">
                  {"★".repeat(Math.round(avgRating))}
                  <span className="text-xs text-gray-600 font-extrabold ml-1">{avgRating} ({totalReviews} Ulasan)</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{displayProduct.name}</h1>
              <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">Satuan: {displayProduct.unit}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#51000d]">Rp {formatPrice(displayProduct.price)}</span>
              {displayProduct.originalPrice && (
                <span className="text-sm font-bold text-gray-400 line-through">Rp {formatPrice(displayProduct.originalPrice)}</span>
              )}
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">Gratis Ongkir</span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {displayProduct.description || "Produk makanan berkualitas tinggi khas Bakso Pak Mul. Dibuat dengan higienis tanpa bahan pengawet berlebihan."}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  addToCart(displayProduct);
                  openCart();
                }}
                className="flex-1 py-4 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_shopping_cart</span>
                <span>Tambah ke Keranjang</span>
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>⭐ Rating &amp; Ulasan Pembeli</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Ulasan jujur dari pembeli terverifikasi Bakso Pak Mul</p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#51000d] rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-base">rate_review</span>
              <span>Tulis Ulasan</span>
            </button>
          </div>

          {/* Rating Overview */}
          <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/50 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="text-center shrink-0">
              <span className="text-5xl font-black text-[#51000d]">{avgRating}</span>
              <div className="flex justify-center text-amber-400 text-lg my-1">
                {"★".repeat(Math.round(avgRating))}
              </div>
              <span className="text-xs font-bold text-gray-500">{totalReviews} Penilaian Pembeli</span>
            </div>
            <div className="flex-1 text-xs text-gray-600 space-y-1 w-full">
              <p className="font-bold text-gray-800 mb-2">Mengapa Pembeli Menyukai Produk Ini?</p>
              <p>✔ Rasa Daging Sapi Pilihan 100% Gurih &amp; Renyah</p>
              <p>✔ Pengemasan vacuum higienis tahan perjalanan</p>
              <p>✔ Pengiriman cepat &amp; Garansi Kualitas Bakso Pak Mul</p>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4 pt-2">
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">Belum ada ulasan untuk produk ini. Jadi yang pertama memberi ulasan!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#51000d] text-white flex items-center justify-center font-bold text-xs">
                        {(rev.userName || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{rev.userName}</h4>
                        <div className="flex text-amber-400 text-xs">
                          {"★".repeat(rev.rating || 5)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(rev.createdAt || Date.now()).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium pl-12">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* WRITE REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5 border border-gray-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#51000d]">rate_review</span>
                <span>Tulis Ulasan Produk</span>
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {reviewMessage && (
              <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs font-bold">
                {reviewMessage}
              </div>
            )}

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Anda</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Misal: Budi Santoso"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-[#51000d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pilih Bintang (Rating)</label>
                <div className="flex gap-2 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={star <= rating ? "text-amber-400" : "text-gray-300"}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Komentar &amp; Testimoni *</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Bagikan pengalaman rasa, kelezatan, dan kualitas Bakso Pak Mul..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-[#51000d] outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-3.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
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
