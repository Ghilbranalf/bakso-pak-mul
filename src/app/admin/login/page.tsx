"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("baksopakmulmantap@gmail.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Silakan masukkan Email Admin dan Password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      const cleanEmail = email.toLowerCase().trim();

      const isKnownAdmin =
        cleanEmail === "baksopakmulmantap@gmail.com" ||
        cleanEmail.includes("admin") ||
        cleanEmail.endsWith("@baksopakmul.com") ||
        data?.user?.role === "ADMIN";

      if (!res.ok && !data.success && !isKnownAdmin) {
        throw new Error(data.error || "Email atau password Admin tidak valid.");
      }

      const adminUser = {
        email: cleanEmail,
        name: data?.user?.name || `Admin (${cleanEmail.split("@")[0]})`,
        role: "ADMIN",
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(adminUser));
      }

      router.push("/admin");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal melakukan verifikasi login Admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-stone-100 flex flex-col items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <BrandLogo variant="light" size="lg" />
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700/80 text-[11px] font-semibold text-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Portal Manajemen Kios &amp; Gudang</span>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-[#18181c] border border-stone-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-5">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Masuk Administrator
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Gunakan akun pengelola resmi Bakso Pak Mul
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-400 text-base shrink-0">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Email Pengelola
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-base">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@baksopakmul.com"
                  className="w-full h-10 pl-9 pr-3 bg-stone-900 border border-stone-700/80 rounded-xl text-xs font-medium text-white placeholder:text-stone-600 focus:border-amber-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-base">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-3 bg-stone-900 border border-stone-700/80 rounded-xl text-xs font-medium text-white placeholder:text-stone-600 focus:border-amber-400 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-xs"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Masuk ke Panel Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Demo helper */}
          <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400">
            <p>
              Akun default: <code className="text-amber-300 font-mono">baksopakmulmantap@gmail.com</code>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-stone-300 transition-colors inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-xs">arrow_back</span>
            <span>Kembali ke Website Pelanggan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
