"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  activeMenu?: string;
}

export default function AdminSidebar({ activeMenu }: AdminSidebarProps = {}) {
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", name: "Dashboard", href: "/admin", icon: "dashboard" },
    { id: "inventory", name: "Stok & Produk", href: "/admin/inventory", icon: "inventory_2" },
    { id: "orders", name: "Pesanan Masuk", href: "/admin/orders", icon: "receipt_long" },
    { id: "promotions", name: "Promosi & Diskon", href: "/admin/promotions", icon: "campaign" },
    { id: "settings", name: "Pengaturan Store", href: "/admin/settings", icon: "tune" },
  ];

  return (
    <>
      {/* ==================== DESKTOP SIDEBAR (>= lg) ==================== */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[260px] bg-gradient-to-b from-[#3d000a] via-[#51000d] to-[#2c0007] text-white flex-col py-6 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.12)] border-r border-amber-500/10">
        {/* Brand Identity */}
        <Link href="/" className="px-6 mb-8 flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-[#51000d] shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-2xl font-bold">restaurant_menu</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-white">Bakso Pak Mul</h1>
            </div>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block -mt-0.5">
              Executive Portal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#51000d] font-black shadow-lg shadow-amber-500/25 translate-x-1"
                    : "text-amber-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${isActive ? "text-[#51000d]" : "text-amber-300/80"}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Action */}
        <div className="px-4 mt-4">
          <Link
            href="/admin/inventory"
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-[#51000d] rounded-2xl text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Tambah Produk</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="px-4 mt-auto pt-4 border-t border-white/10 space-y-1">
          <a
            href="https://wa.me/6281298980252"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-amber-200/70 hover:text-white hover:bg-white/10 rounded-xl text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-lg text-amber-400">help</span>
            <span>Bantuan CS</span>
          </a>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 rounded-xl text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Keluar Admin</span>
          </Link>
        </div>
      </aside>



      {/* ==================== MOBILE FLOATING GLASS BOTTOM BAR (< lg) ==================== */}
      <nav className="lg:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center h-20 mx-auto pointer-events-none">
        <div className="pointer-events-auto fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-full px-2 py-1.5 bg-[#51000d]/90 backdrop-blur-2xl border border-amber-400/30 shadow-[0_12px_35px_rgba(81,0,13,0.4)] flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#51000d] rounded-full w-11 h-11 shadow-[0_0_20px_rgba(245,158,11,0.5)] font-black"
                    : "text-amber-100/70 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {!isActive && <span className="text-[9px] font-bold mt-0.5">{item.name.split(" ")[0]}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
