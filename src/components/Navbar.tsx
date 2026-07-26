"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Produk", href: "/produk" },
    { name: "Promo", href: "/promo" },
    { name: "Transaksi", href: "/transaksi" },
    { name: "Tentang", href: "/tentang" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer group">
            <img
              alt="BPM Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDBL54ay3_wH1MTRduKq7WuysfeSQbkXJTUCJgNiKCIPLKacTQTGY--R8yc5l1yZ0UKwLHhypDJz8pC9IvOs8_kTHavE67Ebjs3TvlQCb3D558xWtMD7gTTdbqZMUO8Da2T_u3DtfuS6NTIenP8pCtDspF_mK4uhwS4EfHM2NV8pymrf7C6qSb3MG7R34aqGeBoR9dxABZzbQDvnwhQ93TZsssPJSZF3Nq4maYwKDvDV460_eZfzPsCe7vwFQFWdBEXQ2JoH_FKqy_"
            />
            <span className="ml-3 font-bold text-xl tracking-tight text-[#51000d]">Bakso Pak Mul</span>
          </Link>

          {/* Central Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors py-1 ${
                    isActive
                      ? "font-bold text-[#51000d] border-b-2 border-[#51000d]"
                      : "font-medium text-gray-600 hover:text-[#51000d]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Functional Icons */}
          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block">
              <input
                className="w-48 bg-gray-100 border-transparent focus:bg-white focus:border-[#51000d] focus:ring-0 rounded-full py-2 pl-10 pr-4 text-xs transition-all duration-300 text-gray-800 placeholder-gray-400"
                placeholder="Cari koleksi..."
                type="text"
              />
              <i className="fas fa-search absolute left-3.5 top-2.5 text-gray-400 text-[10px]"></i>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profil" className="text-gray-600 hover:text-[#51000d] transition-colors flex items-center gap-1 font-bold text-xs" title="Profil Akun">
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-[#51000d] transition-colors" title="Admin Portal">
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </Link>
              <button
                type="button"
                className="relative text-gray-600 hover:text-[#51000d] transition-all flex items-center justify-center cursor-pointer p-2 rounded-full hover:bg-gray-100 active:scale-95 z-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openCart();
                }}
                title="Buka Keranjang Belanja"
              >
                <span className="material-symbols-outlined text-[24px] pointer-events-none">shopping_cart</span>
                <span 
                  key={totalItems}
                  className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-extrabold h-4 min-w-4 px-1 flex items-center justify-center rounded-full shadow-md border border-white animate-in zoom-in-50 duration-200 pointer-events-none"
                >
                  {totalItems}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
