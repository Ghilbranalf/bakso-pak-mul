"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Send OTP Handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Silakan masukkan alamat email yang valid.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal mengirim kode OTP.");
      }

      setSuccessMessage(`Kode OTP 6-digit asli telah dikirim ke email ${email}. Silakan periksa inbox atau folder spam Anda.`);
      setStep("OTP");
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat mengirim OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP Handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMessage("Kode OTP harus terdiri dari 6 digit angka.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Kode OTP 6-digit salah atau kedaluwarsa.");
      }

      // Save logged in user info to local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setSuccessMessage("Login berhasil! Mengalihkan...");
      setTimeout(() => {
        router.push("/profil");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memverifikasi OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 flex min-h-[calc(100vh-80px)]">
        {/* Left Side: Branding */}
        <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden items-center justify-center bg-[#51000d]">
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 p-12 text-center max-w-lg flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center mb-8 border border-amber-300/30">
              <span className="material-symbols-outlined text-5xl text-[#51000d]">mark_email_read</span>
            </div>
            <h1 className="text-3xl lg:text-4xl text-white mb-4 font-black tracking-tight">
              Masuk Akun via Email OTP
            </h1>
            <p className="text-sm text-white/80 leading-relaxed max-w-md font-medium">
              Gunakan kode verifikasi **OTP 6-Digit Real** yang dikirim langsung ke Inbox Email Anda via Nodemailer SMTP.
            </p>
          </div>
        </div>

        {/* Right Side: Login OTP Form */}
        <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white">
          <div className="w-full max-w-md">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#51000d]/10 text-[#51000d] text-[10px] font-black rounded-full uppercase tracking-wider">
                  Nodemailer Real OTP System
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl text-gray-900 font-extrabold tracking-tight">
                {step === "EMAIL" ? "Masuk ke Akun Anda" : "Masukkan Kode OTP Email"}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">
                {step === "EMAIL"
                  ? "Masukkan alamat email Anda untuk menerima 6-digit kode OTP asli."
                  : `Kode verifikasi telah dikirim ke ${email}.`}
              </p>
            </div>

            {/* Error & Success Banners */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* STEP 1: INPUT EMAIL */}
            {step === "EMAIL" && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: budi@gmail.com"
                      className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#51000d] focus:ring-2 focus:ring-[#51000d]/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#51000d] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#7a0019] shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? "Mengirim OTP..." : "Kirim Kode OTP (Email)"}</span>
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </form>
            )}

            {/* STEP 2: INPUT OTP 6-DIGIT */}
            {step === "OTP" && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Kode Verifikasi (6-Digit)
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep("EMAIL")}
                      className="text-xs font-bold text-[#51000d] hover:underline cursor-pointer"
                    >
                      Ubah Email
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="w-full h-16 text-center font-mono text-2xl font-black tracking-[12px] bg-gray-50 border-2 border-[#51000d]/30 rounded-2xl text-gray-900 focus:bg-white focus:border-[#51000d] outline-none transition-all"
                  />
                  <p className="text-[11px] text-gray-400 text-center mt-1">
                    Silakan buka aplikasi Email Anda dan masukkan 6-digit kode OTP resmi dari Bakso Pak Mul.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="w-full h-14 bg-[#51000d] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#7a0019] shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? "Verifikasi..." : "Verifikasi & Masuk"}</span>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="text-xs font-bold text-gray-500 hover:text-[#51000d] transition-colors cursor-pointer"
                  >
                    Tidak menerima email? <span className="underline text-[#51000d]">Kirim Ulang OTP</span>
                  </button>
                </div>
              </form>
            )}

            {/* Footer Link */}
            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-500">
                Belum punya akun?{" "}
                <Link href="/register" className="text-[#51000d] font-black hover:underline ml-1">
                  Daftar sekarang
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
