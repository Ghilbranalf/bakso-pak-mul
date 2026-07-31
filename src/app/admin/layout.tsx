"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        let email = "";
        let role = "";

        // Check local storage user
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            email = parsed.email || "";
            role = parsed.role || "";
          } catch (e) {}
        }

        // Check Supabase session user
        try {
          const { createClient } = await import("@/utils/supabase/client");
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            email = session.user.email || email;
            role = session.user.user_metadata?.role || role;
          }
        } catch (e) {}

        setUserEmail(email);

        // Define Admin Access Rules:
        // 1. Role is explicitly "ADMIN"
        // 2. Email is official admin email: baksopakmulmantap@gmail.com
        // 3. Or developer demo admin mode (admin in localStorage)
        const isAdmin = 
          role.toUpperCase() === "ADMIN" || 
          email.toLowerCase() === "baksopakmulmantap@gmail.com" ||
          storedUser !== null; // Allow local logged-in session for testing

        if (isAdmin) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          setTimeout(() => {
            router.push("/login?message=" + encodeURIComponent("Akses ditolak. Silakan login sebagai Admin."));
          }, 2000);
        }
      } catch (err) {
        console.error("Admin Protection Check Error:", err);
        setIsAuthorized(false);
      }
    };

    checkAdminRole();
  }, [router]);

  // Loading state while checking permissions
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#51000d] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-gray-700">Memeriksa Hak Akses Admin...</p>
      </div>
    );
  }

  // Unauthorized Access Screen
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 text-center">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-red-100 space-y-5">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
            <span className="material-symbols-outlined text-4xl">lock</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">403 - Akses Ditolak</h2>
            <p className="text-xs text-gray-500 font-medium mt-2">
              Halaman ini hanya dapat diakses oleh **Administrator Resmi** Bakso Pak Mul.
            </p>
            {userEmail && (
              <p className="text-xs font-bold text-red-700 bg-red-50 py-2 px-3 rounded-xl mt-3">
                Akun aktif saat ini: {userEmail}
              </p>
            )}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              Login Sebagai Admin
            </Link>
            <Link
              href="/"
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard Pages if Authorized
  return <>{children}</>;
}
