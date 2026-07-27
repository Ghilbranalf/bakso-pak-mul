"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", name: "Dashboard", href: "/admin", icon: "dashboard" },
    { id: "inventory", name: "Inventory", href: "/admin/inventory", icon: "inventory_2" },
    { id: "orders", name: "Orders", href: "/transaksi", icon: "receipt_long" },
    { id: "promotions", name: "Promotions", href: "/admin/promotions", icon: "campaign" },
    { id: "settings", name: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-[280px] bg-white border-r border-gray-200 flex-col py-6 z-40 shadow-sm">
      {/* Brand Identity */}
      <Link href="/" className="px-6 mb-8 flex items-center gap-3 group">
        <div className="w-10 h-10 bg-[#7a0019] rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
          <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#51000d]">Admin Portal</h1>
          <p className="text-[11px] font-semibold text-gray-400">Enterprise Management</p>
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
          href="/admin/new-listing"
          className="w-full py-3.5 bg-[#7a0019] hover:bg-[#51000d] text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Listing</span>
        </Link>
      </div>

      {/* Footer Navigation */}
      <div className="px-4 mt-auto pt-4 border-t border-gray-200 space-y-1">
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-all"
        >
          <span className="material-symbols-outlined text-lg">help</span>
          <span>Support</span>
        </a>
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-all"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
