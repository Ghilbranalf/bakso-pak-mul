"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const shippingCost = items.length > 0 ? 150000 : 0;
  const discount = totalPrice > 500000 ? 100000 : 0;
  const finalTotal = Math.max(0, totalPrice + shippingCost - discount);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20 font-sans text-gray-800">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Keranjang Belanja</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola pesanan dan produk pilihan Anda sebelum pembayaran.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center my-8">
            <span className="material-symbols-outlined text-7xl text-gray-300 mb-4">shopping_cart</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Keranjang Belanja Anda Kosong</h2>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              Anda belum menambahkan produk apa pun ke keranjang belanja.
            </p>
            <Link
              href="/produk"
              className="bg-[#51000d] text-white px-8 py-3.5 rounded-xl font-bold text-xs shadow-md hover:bg-[#7a0019] transition-all uppercase tracking-wider"
            >
              Lihat Katalog Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                  <span className="font-bold text-base text-gray-900">Daftar Produk ({totalItems} Item)</span>
                </div>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <hr className="border-gray-100" />}
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex gap-4 items-center flex-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 leading-snug">{item.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">{item.unit || "Grosir - Vacuum Pack"}</p>
                            <p className="text-sm font-extrabold text-[#51000d] mt-2 sm:hidden">
                              Rp {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
                          <span className="text-sm font-extrabold text-[#51000d] hidden sm:block">
                            Rp {formatPrice(item.price)}
                          </span>

                          <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                            <button
                              type="button"
                              onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                              className="p-2 text-gray-500 hover:text-[#51000d] transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {item.quantity === 1 ? 'delete' : 'remove'}
                              </span>
                            </button>
                            <span className="text-xs font-bold w-8 text-center text-gray-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 text-gray-500 hover:text-[#51000d] transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-28 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-gray-900">Rp {formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi Pengiriman (Kargo)</span>
                    <span className="font-semibold text-gray-900">Rp {formatPrice(shippingCost)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-600 font-semibold">
                      <span>Diskon Pembelian Grosir</span>
                      <span>- Rp {formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <hr className="border-gray-200 border-dashed" />

                <div className="flex justify-between items-end pb-2">
                  <span className="text-sm font-bold text-gray-900">Total Pembayaran</span>
                  <span className="text-xl font-black text-[#51000d]">Rp {formatPrice(finalTotal)}</span>
                </div>

                <Link
                  href="/pembayaran"
                  className="w-full bg-[#51000d] text-white py-4 px-6 rounded-xl font-bold text-xs hover:bg-[#7a0019] transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span>Lanjut Ke Pembayaran</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>

                <p className="text-center text-[10px] text-gray-400 mt-2">
                  Pembayaran aman dengan enkripsi 256-bit
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <CartSidebar />
    </div>
  );
}
