"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartSidebar() {
  const {
    isCartOpen,
    closeCart,
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    shippingCost,
    discount,
    finalTotal,
  } = useCart();

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Sliding Cart Panel */}
      <div className="relative w-full max-w-md bg-[#faf7f2] h-full shadow-2xl flex flex-col z-10 font-sans border-l border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl font-bold text-stone-950">
              Keranjang Pesanan
            </h2>
            <span className="bg-amber-50 text-[#7a0019] border border-amber-200/60 text-xs font-bold px-2.5 py-0.5 rounded-md">
              {totalItems} Item
            </span>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center transition-colors text-stone-500 hover:text-stone-900 cursor-pointer"
            onClick={closeCart}
            title="Tutup Keranjang"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Product List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#faf7f2]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 py-16 text-center">
              <span className="material-symbols-outlined text-5xl mb-3 text-stone-300">
                shopping_bag
              </span>
              <p className="text-sm font-semibold text-stone-600">
                Keranjang Anda masih kosong
              </p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                Pilih menu bakso atau bahan baku favorit dari kios Pasar Kramat Jati.
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="p-4 bg-white rounded-xl border border-stone-200/70 shadow-2xs flex gap-3.5 items-center"
              >
                <div className="w-16 h-16 rounded-lg bg-[#f5f0e8] p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    className="w-full h-full object-contain"
                    src={item.image || "/images/hero-banner.webp"}
                    alt={item.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xs font-bold text-stone-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-stone-400 mb-2 truncate">
                    {item.unit || "Pack Pilihan"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#51000d]">
                      Rp {formatPrice(item.price)}
                    </span>
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        type="button"
                        className="p-1 text-stone-500 hover:text-[#51000d] transition-colors cursor-pointer"
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.id, -1)
                            : removeFromCart(item.id)
                        }
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {item.quantity === 1 ? "delete" : "remove"}
                        </span>
                      </button>
                      <span className="text-xs font-bold w-7 text-center text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-stone-500 hover:text-[#51000d] transition-colors cursor-pointer"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Price Summary */}
        <div className="bg-white border-t border-stone-200 p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-stone-500">
              <span>Subtotal Pesanan</span>
              <span className="text-stone-900 font-semibold">
                Rp {formatPrice(totalPrice)}
              </span>
            </div>
            {items.length > 0 && (
              <>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Estimasi Pengiriman</span>
                  <span className="text-stone-900 font-semibold">
                    Rp {formatPrice(shippingCost)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-[#7a0019]">
                    <span>Potongan Pembelian</span>
                    <span className="font-semibold">- Rp {formatPrice(discount)}</span>
                  </div>
                )}
              </>
            )}
          </div>
          <hr className="border-stone-200 border-dashed" />
          <div className="flex justify-between items-end pb-1">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Total Pembayaran
            </span>
            <span className="font-serif text-2xl font-bold text-[#51000d]">
              Rp {formatPrice(finalTotal)}
            </span>
          </div>

          {/* Primary Action */}
          <Link
            href="/checkout"
            onClick={closeCart}
            className="w-full bg-[#51000d] hover:bg-[#7a0019] text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lanjut Pembayaran</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
          <p className="text-center text-[10px] text-stone-400 mt-2">
            100% Aman &amp; Terjamin • Diantar Segar Langsung
          </p>
        </div>
      </div>
    </div>
  );
}
