"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openCart, totalItems } = useCart();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);

        supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });
      } catch (err) {
        console.warn("Supabase auth check bypassed:", err);
      }
    };
    checkUser();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produk?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Menu & Produk", href: "/produk" },
    { name: "Promo", href: "/promo" },
    { name: "Lacak Pesanan", href: "/lacak" },
    { name: "Tentang Kami", href: "/tentang" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 transition-all duration-200">
      <nav
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-18 items-center gap-4">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center cursor-pointer group"
              title="Bakso Pak Mul"
            >
              <BrandLogo size="md" />
            </Link>

            {/* Central Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium px-3.5 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "text-[#7a0019] bg-[#7a0019]/10 font-semibold"
                        : "text-slate-600 hover:text-[#7a0019] hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Actions & Utilities */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 xl:w-56 bg-slate-100 focus:bg-white border border-transparent focus:border-[#7a0019]/40 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                  placeholder="Cari bakso, mie, bumbu..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
                  search
                </span>
              </form>

              {/* User Profile / Login */}
              {user ? (
                <div className="relative group">
                  <Link
                    href="/profil"
                    className="w-9 h-9 rounded-xl bg-[#7a0019] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#51000d] transition-colors"
                    title="Profil Saya"
                  >
                    {(user.user_metadata?.full_name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 flex flex-col p-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        Akun Anda
                      </p>
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                    </div>
                    <Link
                      href="/profil"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-slate-400">
                        person
                      </span>
                      Profil Saya
                    </Link>
                    <Link
                      href="/transaksi"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-slate-400">
                        receipt_long
                      </span>
                      Riwayat Pesanan
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer w-full mt-1 border-t border-slate-100"
                    >
                      <span className="material-symbols-outlined text-base">
                        logout
                      </span>
                      Keluar
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#7a0019] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    account_circle
                  </span>
                  <span className="hidden sm:inline">Masuk</span>
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors cursor-pointer"
                title="Buka Keranjang Belanja"
                aria-label="Keranjang Belanja"
              >
                <span className="material-symbols-outlined text-xl">
                  shopping_bag
                </span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7a0019] text-white font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
