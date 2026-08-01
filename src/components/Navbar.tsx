"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openCart, totalItems } = useCart();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
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

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Produk", href: "/produk" },
    { name: "Transaksi", href: "/transaksi" },
    { name: "Lacak Pesanan", href: "/lacak" },
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
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-gray-100 border-transparent focus:bg-white focus:border-[#51000d] focus:ring-0 rounded-full py-2 pl-10 pr-4 text-xs transition-all duration-300 text-gray-800 placeholder-gray-400"
                placeholder="Cari koleksi..."
                type="text"
              />
              <button type="submit" className="absolute left-3.5 top-2.5 text-gray-400 text-[10px] cursor-pointer">
                <i className="fas fa-search"></i>
              </button>
            </form>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-2 relative group cursor-pointer">
                  <div className="bg-[#51000d] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Dropdown Logout */}
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                    <div className="px-4 py-2 text-[10px] text-gray-500 font-bold border-b border-gray-50 truncate">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Link href="/profil" className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 text-left">Profil Saya</Link>
                    <button onClick={async () => {
                      const { createClient } = await import('@/utils/supabase/client');
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      window.location.reload();
                    }} className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-gray-50 text-left cursor-pointer">Keluar</button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-[#51000d] transition-colors flex items-center p-1" title="Masuk / Akun">
                  <span className="material-symbols-outlined text-2xl">account_circle</span>
                </Link>
              )}

              <button
                onClick={openCart}
                className="relative text-gray-600 hover:text-[#51000d] transition-colors p-1 cursor-pointer"
                title="Keranjang"
              >
                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7a0019] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
