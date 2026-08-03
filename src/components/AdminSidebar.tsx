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
    { id: "orders", name: "Pesanan", href: "/admin/orders", icon: "receipt_long" },
    { id: "promotions", name: "Diskon", href: "/admin/promotions", icon: "campaign" },
    { id: "settings", name: "Pengaturan", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <>
      {/* ==================== DESKTOP SIDEBAR (>= lg) ==================== */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[260px] bg-white border-r border-gray-200 flex-col py-6 z-40 shadow-xs">
        {/* Brand Identity */}
        <Link href="/" className="px-6 mb-8 flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#51000d] rounded-xl flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
          </div>
          <div>
            <h1 className="text-base font-black text-[#51000d]">Portal Admin</h1>
            <p className="text-[11px] font-semibold text-gray-400">Bakso Pak Mul</p>
          </div>
        </Link>

        {/* Primary Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${
                  isActive
                    ? "bg-[#51000d] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#51000d]"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Action */}
        <div className="px-4 mt-4">
          <Link
            href="/admin/inventory"
            className="w-full py-3 bg-[#51000d] hover:bg-[#380009] text-white rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Tambah Produk</span>
          </Link>
        </div>

        {/* Footer Navigation */}
        <div className="px-4 mt-auto pt-4 border-t border-gray-200 space-y-1">
          <a
            href="https://wa.me/6281298980252"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-lg">help</span>
            <span>Bantuan CS</span>
          </a>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Keluar Admin</span>
          </Link>
        </div>
      </aside>

      {/* ==================== MOBILE TOP BAR (< lg) ==================== */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#51000d] rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-lg">restaurant_menu</span>
          </div>
          <div>
            <span className="font-black text-sm text-[#51000d] block">Portal Admin</span>
            <span className="text-[10px] text-gray-400 font-semibold block -mt-1">Bakso Pak Mul</span>
          </div>
        </Link>

        <Link
          href="/"
          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Keluar</span>
        </Link>
      </header>

      {/* ==================== MOBILE BOTTOM BAR (< lg) ==================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? "text-[#51000d] font-black scale-105" : "text-gray-400 font-medium hover:text-gray-700"
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? "text-[#51000d]" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
