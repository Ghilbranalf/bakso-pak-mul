"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide customer bottom nav on admin routes and auth/checkout routes
  const hiddenRoutes = ["/login", "/register", "/checkout", "/admin"];
  if (hiddenRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  const publicNavItems = [
    { name: "Beranda", icon: "home", href: "/" },
    { name: "Produk", icon: "store", href: "/produk" },
    { name: "Transaksi", icon: "receipt_long", href: "/transaksi" },
    { name: "Profil", icon: "person", href: "/profil" },
    { name: "Tentang", icon: "info", href: "/tentang" },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center h-20 mx-auto">
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg rounded-full px-3 py-2 bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl shadow-[#51000d]/10 flex justify-around items-center h-20">
        {publicNavItems.map((item) => {
          const isActive = 
            item.href === '/'
              ? pathname === item.href 
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
                isActive
                  ? "bg-[#51000d] text-white rounded-full w-12 h-12 shadow-[0_0_15px_rgba(81,0,13,0.5)]"
                  : "text-black hover:text-black"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {!isActive && <span className="text-[10px] font-bold mt-1">{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
