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
      setIsScrolled(window.scrollY > 15);
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
    { name: "Koleksi Menu", href: "/produk" },
    { name: "Promo", href: "/promo" },
    { name: "Lacak Pesanan", href: "/lacak" },
    { name: "Kisah Kami", href: "/tentang" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <nav
        className={`w-full transition-all duration-300 bg-[#200408]/95 backdrop-blur-md border-b border-[#420812] ${
          isScrolled ? "shadow-xl" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center gap-4">
            {/* Brand Logo (Consistent Light Variant on Dark Wine Bar) */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center cursor-pointer group"
              title="Bakso Pak Mul - Halaman Utama"
            >
              <BrandLogo size="md" variant="light" />
            </Link>

            {/* Central Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[11px] font-extrabold uppercase tracking-[0.2em] transition-colors relative py-1.5 ${
                      isActive
                        ? "text-[#e5a93c] font-black"
                        : "text-[#faf7f2]/85 hover:text-[#e5a93c]"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#e5a93c]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions & Utilities */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 xl:w-56 rounded-xl py-2 pl-9 pr-3 text-xs outline-none transition-all bg-[#36070e] text-white placeholder:text-stone-300 border border-[#59101f] focus:border-[#e5a93c]"
                  placeholder="Cari bakso, mie, bumbu..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none text-stone-300">
                  search
                </span>
              </form>

              {/* User Profile / Login */}
              {user ? (
                <div className="relative group">
                  <Link
                    href="/profil"
                    className="w-9 h-9 rounded-xl bg-[#51000d] text-[#e5a93c] border border-[#59101f] flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#7a0019] transition-colors"
                    title="Profil Saya"
                  >
                    {(user.user_metadata?.full_name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 flex flex-col p-1.5 z-50">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-[10px] text-[#51000d] uppercase tracking-wider font-bold">
                        Akun Terhubung
                      </p>
                      <p className="text-xs font-semibold text-[#1c1917] truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                    </div>
                    <Link
                      href="/profil"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#51000d] rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-[#51000d]">
                        person
                      </span>
                      Profil Saya
                    </Link>
                    <Link
                      href="/transaksi"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#51000d] rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-[#51000d]">
                        receipt_long
                      </span>
                      Riwayat Pesanan
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer w-full mt-1 border-t border-stone-100"
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
                  className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-2 rounded-xl transition-colors text-white hover:text-[#e5a93c] hover:bg-[#36070e]"
                >
                  <span className="material-symbols-outlined text-lg text-[#e5a93c]">
                    account_circle
                  </span>
                  <span className="hidden sm:inline">Masuk</span>
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors cursor-pointer shadow-2xs bg-[#36070e] border border-[#59101f] hover:border-[#e5a93c] text-white hover:text-[#e5a93c]"
                title="Buka Keranjang Belanja"
                aria-label="Keranjang Belanja"
              >
                <span className="material-symbols-outlined text-xl">
                  shopping_bag
                </span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#e5a93c] text-[#200408] font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-[#200408]">
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