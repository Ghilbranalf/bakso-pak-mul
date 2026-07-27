"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartSidebar() {
  const { isCartOpen, closeCart, items, totalItems, totalPrice, updateQuantity, removeFromCart, shippingCost, discount, finalTotal } = useCart();

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      ></div>
      
      {/* Sliding Cart Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Keranjang Belanja</h2>
            <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{totalItems} Item</span>
          </div>
          <button 
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 cursor-pointer"
            onClick={closeCart}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        
        {/* Product List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-30">shopping_cart</span>
              <p className="text-sm font-medium text-gray-500">Keranjang Anda kosong</p>
            </div>
          ) : (
            items.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <hr className="border-gray-200" />}
                <div className="flex gap-4 items-center">
                  <img className="w-20 h-20 rounded-xl object-cover border border-gray-200/50 bg-gray-50" src={item.image} alt={item.name} />
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{item.unit || "Grosir - Vacuum Pack"}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-extrabold text-[#7a0019]">Rp {formatPrice(item.price)}</span>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                        <button 
                          type="button"
                          className="p-1 text-gray-500 hover:text-[#51000d] transition-colors cursor-pointer"
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {item.quantity === 1 ? 'delete' : 'remove'}
                          </span>
                        </button>
                        <span className="text-xs font-bold w-8 text-center text-gray-900">{item.quantity}</span>
                        <button 
                          type="button"
                          className="p-1 text-gray-500 hover:text-[#51000d] transition-colors cursor-pointer"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))
          )}
        </div>
        
        {/* Footer / Price Summary */}
        <div className="bg-[#f9f9f9] border-t border-gray-200 p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span className="text-gray-900 font-medium">Rp {formatPrice(totalPrice)}</span>
            </div>
            {items.length > 0 && (
              <>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Estimasi Pengiriman (Kargo)</span>
                  <span className="text-gray-900 font-medium">Rp {formatPrice(shippingCost)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-[#b32633]">
                    <span>Diskon Pembelian Grosir</span>
                    <span className="font-semibold">- Rp {formatPrice(discount)}</span>
                  </div>
                )}
              </>
            )}
          </div>
          <hr className="border-gray-300 border-dashed" />
          <div className="flex justify-between items-end pb-2">
            <span className="text-base font-bold text-[#1A1A1A]">Total Pembayaran</span>
            <span className="text-xl font-extrabold text-[#7a0019]">Rp {formatPrice(finalTotal)}</span>
          </div>
          
          {/* Primary Action */}
          <Link href="/pembayaran" onClick={closeCart} className="w-full bg-[#7a0019] text-white py-4 px-8 rounded-xl font-semibold text-sm hover:bg-[#b32633] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer">
            <span>Bayar Sekarang</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
          <p className="text-center text-xs text-gray-400 mt-3">Pembayaran aman dengan enkripsi 256-bit</p>
        </div>
      </div>
    </div>
  );
}
