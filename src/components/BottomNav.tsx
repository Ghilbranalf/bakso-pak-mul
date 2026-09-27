"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide customer bottom nav on admin routes and auth/checkout routes
  const hiddenRoutes = ["/login", "/register", "/checkout", "/admin"];
  if (hiddenRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  const navItems = [
    { name: "Beranda", icon: "home", href: "/" },
    { name: "Produk", icon: "storefront", href: "/produk" },
    { name: "Pesanan", icon: "receipt_long", href: "/transaksi" },
    { name: "Lacak", icon: "local_shipping", href: "/lacak" },
    { name: "Profil", icon: "person", href: "/profil" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-red-600 font-semibold"
                  : "text-slate-400 hover:text-slate-700 font-medium"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? "bg-red-50 text-red-600" : "text-slate-500"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
