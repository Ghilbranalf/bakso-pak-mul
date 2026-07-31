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
    { id: "promotions", name: "Promosi & Diskon", href: "/admin/promotions", icon: "campaign" },
    { id: "settings", name: "Pengaturan", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-[280px] bg-white border-r border-gray-200 flex-col py-6 z-40 shadow-sm">
      {/* Brand Identity */}
      <Link href="/" className="px-6 mb-8 flex items-center gap-3 group">
        <div className="w-10 h-10 bg-[#7a0019] rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
          <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#51000d]">Portal Admin</h1>
          <p className="text-[11px] font-semibold text-gray-400">Manajemen Usaha</p>
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
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#51000d] text-white shadow-md translate-x-1"
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
          className="w-full py-3.5 bg-[#7a0019] hover:bg-[#51000d] text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
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
          className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-all"
        >
          <span className="material-symbols-outlined text-lg">help</span>
          <span>Bantuan CS</span>
        </a>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-all"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Keluar Admin</span>
        </Link>
      </div>
    </aside>
  );
}
