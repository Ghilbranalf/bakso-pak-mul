"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AdminThemeProvider } from "@/context/AdminThemeContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      return;
    }
    const checkAdminRole = async () => {
      try {
        let email = "";
        let role = "";

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            email = parsed.email || "";
            role = parsed.role || "";
          } catch (_) {}
        }

        try {
          const { createClient } = await import("@/utils/supabase/client");
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            email = session.user.email || email;
            role = session.user.user_metadata?.role || role;
          }
        } catch (_) {}

        setUserEmail(email);

        const adminEmailList = [
          "baksopakmulmantap@gmail.com",
          "admin@baksopakmul.com",
          "admin2@baksopakmul.com",
          "staf@baksopakmul.com",
          "pengelola@baksopakmul.com",
        ];

        const isKnownAdminEmail =
          adminEmailList.includes(email.toLowerCase()) ||
          email.toLowerCase().includes("admin") ||
          email.toLowerCase().endsWith("@baksopakmul.com");

        const isAdmin = role.toUpperCase() === "ADMIN" || isKnownAdminEmail;

        if (isAdmin) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          setTimeout(() => router.push("/admin/login"), 1500);
        }
      } catch (err) {
        console.error("Admin Protection Check Error:", err);
        setIsAuthorized(false);
      }
    };

    checkAdminRole();
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-white/50">Memeriksa akses...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6 text-center">
        <div className="bg-[#1a1a1a] max-w-sm w-full p-8 rounded-2xl border border-white/10 space-y-5">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Akses Ditolak</h2>
            <p className="text-sm text-white/40 mt-1">
              Halaman ini hanya untuk Administrator Bakso Pak Mul.
            </p>
            {userEmail && (
              <p className="text-xs text-red-400 bg-red-500/10 py-2 px-3 rounded-lg mt-3 font-mono">
                {userEmail}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/admin/login"
              className="w-full py-3 bg-white text-gray-900 rounded-xl text-sm font-semibold transition-all text-center hover:bg-gray-100"
            >
              Login Admin
            </Link>
            <Link
              href="/"
              className="w-full py-3 text-white/40 hover:text-white/60 rounded-xl text-sm transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminThemeProvider>
      {children}
    </AdminThemeProvider>
  );
}
