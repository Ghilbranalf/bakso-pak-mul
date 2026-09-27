"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminTheme } from "@/context/AdminThemeContext";
import BrandLogo from "@/components/BrandLogo";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);
  const { isDark, toggleTheme } = useAdminTheme();

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.orders) {
          const pending = data.orders.filter(
            (o: any) =>
              o.status !== "COMPLETED" &&
              o.status !== "PAID" &&
              o.status !== "CANCELED" &&
              o.status !== "CANCELLED"
          ).length;
          setPendingCount(pending);
        }
      } catch (_) {}
    };
    fetchPending();
    const interval = setInterval(fetchPending, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (_) {}
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  const navItems = [
    { id: "dashboard", label: "Ringkasan", href: "/admin", icon: "dashboard" },
    {
      id: "orders",
      label: "Pesanan Masuk",
      href: "/admin/orders",
      icon: "receipt_long",
      badge: pendingCount,
    },
    {
      id: "inventory",
      label: "Stok Produk",
      href: "/admin/inventory",
      icon: "inventory_2",
    },
    {
      id: "promotions",
      label: "Promo & Kupon",
      href: "/admin/promotions",
      icon: "campaign",
    },
    {
      id: "settings",
      label: "Pengaturan",
      href: "/admin/settings",
      icon: "tune",
    },
  ];

  return (
    <>
      {/* ====== DESKTOP SIDEBAR (>= lg) ====== */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-full w-[240px] flex-col py-5 z-40 transition-colors select-none ${
          isDark
            ? "bg-[#121214] text-stone-200 border-r border-stone-800"
            : "bg-white text-stone-800 border-r border-stone-200 shadow-2xs"
        }`}
      >
        {/* Brand */}
        <div className="px-5 mb-6">
          <Link href="/admin" className="block group">
            <BrandLogo
              variant={isDark ? "light" : "dark"}
              size="sm"
              withSubtitle={false}
            />
            <div className="flex items-center gap-1.5 mt-2 pl-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-stone-400" : "text-stone-500"
                }`}
              >
                Panel Operasional
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              isDark ? "text-stone-500" : "text-stone-400"
            }`}
          >
            Menu Utama
          </div>
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? isDark
                      ? "bg-stone-800 text-white shadow-2xs ring-1 ring-stone-700"
                      : "bg-[#540b13] text-white shadow-xs"
                    : isDark
                    ? "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[19px] ${
                    isActive
                      ? isDark
                        ? "text-amber-400"
                        : "text-amber-300"
                      : isDark
                      ? "text-stone-400"
                      : "text-stone-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span
                    className={`min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                      isActive
                        ? "bg-amber-400 text-stone-900"
                        : "bg-amber-500/20 text-amber-500"
                    }`}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div
          className={`px-3 mt-auto pt-4 border-t space-y-1.5 ${
            isDark ? "border-stone-800" : "border-stone-200"
          }`}
        >
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isDark
                ? "bg-stone-800/50 border-stone-700 text-stone-300 hover:bg-stone-800"
                : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
            }`}
            title="Ganti Mode Tampilan"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-amber-500">
                {isDark ? "dark_mode" : "light_mode"}
              </span>
              <span>{isDark ? "Tema Gelap" : "Tema Terang"}</span>
            </div>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isDark ? "bg-stone-700 text-stone-300" : "bg-stone-200 text-stone-700"
              }`}
            >
              {isDark ? "Dark" : "Light"}
            </span>
          </button>

          {/* Quick CS */}
          <a
            href="https://wa.me/6281298980252"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
              isDark
                ? "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
            <span>Bantuan CS Warung</span>
          </a>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors text-rose-500 hover:bg-rose-500/10 cursor-pointer`}
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* ====== MOBILE TOP BAR (< lg) ====== */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-40 h-14 px-4 flex items-center justify-between backdrop-blur-md transition-colors ${
          isDark
            ? "bg-[#121214]/95 border-b border-stone-800"
            : "bg-white/95 border-b border-stone-200 shadow-2xs"
        }`}
      >
        <Link href="/admin" className="flex items-center gap-2">
          <BrandLogo
            variant={isDark ? "light" : "dark"}
            size="sm"
            withSubtitle={false}
          />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
              isDark
                ? "bg-stone-800 border-stone-700 text-amber-400"
                : "bg-stone-100 border-stone-200 text-stone-700"
            }`}
            title="Ubah Tema"
          >
            <span className="material-symbols-outlined text-base">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg text-rose-500 flex items-center justify-center hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Keluar"
          >
            <span className="material-symbols-outlined text-base">logout</span>
          </button>
        </div>
      </header>

      {/* ====== MOBILE BOTTOM DOCK (< lg) ====== */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-2 py-1 transition-colors safe-area-bottom ${
          isDark
            ? "bg-[#121214]/95 border-stone-800 text-white"
            : "bg-white/95 border-stone-200 text-stone-900 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                  isActive
                    ? isDark
                      ? "text-amber-400 font-bold"
                      : "text-[#540b13] font-bold"
                    : isDark
                    ? "text-stone-400 font-medium"
                    : "text-stone-500 font-medium"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center relative ${
                    isActive
                      ? isDark
                        ? "bg-stone-800 text-amber-400"
                        : "bg-[#540b13]/10 text-[#540b13]"
                      : ""
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {item.icon}
                  </span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
