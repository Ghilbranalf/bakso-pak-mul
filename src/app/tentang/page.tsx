"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased flex flex-col justify-between">
      {/* Top Navbar Component */}
      <Navbar />

      <main className="pt-20 flex-grow">
        {/* Hero Section */}
        <section className="relative h-[550px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2n7UvwKbPxin6tf5dP1vUosePWrTyzYkpG8waUemeNETCOs3A96JPvJNAqH_MMnWQe0WjI7sr0SkOVlT1GVzhGwcds5bJUNaCpbGmjQMq_ABDcw3lzTN5Of-yioLxd4GNcpPNHJKHPLBDfjNJkRQrIsFGQLRuYnmfMwmYiTcMWg8OclwrVUJ7p-g134PBmk1GwycF8yPV4RTShY-SCLyiOU85OcelE-a2we1ilTNiV1NdQJgUvAc0hyClXX2Tett1qwwfRhBeZtca')",
            }}
          ></div>
          <div className="absolute inset-0 bg-[#51000d]/60 backdrop-blur-[2px] z-10"></div>
          
          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-semibold uppercase tracking-widest mb-4">
              Sejarah &amp; Dedikasi
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Tentang Bakso Pak Mul
            </h1>
            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
              Warisan Kualitas Sejak 2000. Komitmen kami pada cita rasa otentik dan standar premium.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="h-1.5 w-24 bg-white/80 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <span className="text-[#51000d] font-bold text-xs tracking-widest uppercase bg-red-100/60 px-3.5 py-1.5 rounded-full">
                Perjalanan Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#51000d] leading-tight">
                Dari Dapur Kecil Menuju Standar Industri Premium
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Dimulai pada tahun 2000 dari sebuah dapur keluarga yang sederhana, Bakso Pak Mul lahir dari dedikasi untuk menyajikan bakso dengan kualitas tanpa kompromi. Apa yang dimulai sebagai usaha kecil, kini telah bertransformasi menjadi salah satu penyuplai bakso terpercaya untuk berbagai lini bisnis B2B dan pelanggan retail di seluruh wilayah.
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Konsistensi adalah kunci utama kami. Selama lebih dari dua dekade, kami tidak pernah mengubah resep inti, namun terus berinovasi dalam proses produksi untuk memastikan setiap butir bakso yang keluar dari fasilitas kami memenuhi standar higienis dan kualitas tertinggi.
              </p>
              <div className="pt-6 flex gap-10">
                <div>
                  <div className="text-[#51000d] font-black text-4xl md:text-5xl">24+</div>
                  <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mt-1">Tahun Pengalaman</div>
                </div>
                <div>
                  <div className="text-[#51000d] font-black text-4xl md:text-5xl">500+</div>
                  <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mt-1">Partner B2B</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[32px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border border-gray-100">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXspxaLg8lF-dIMJ7EfsjFMAu4OfHBrogPhc875xep-NBNKyXN9nYJwNaRgSCnXrZd7Ej0CihWA7X2a2nwgEMY3ykhFqgAmxRP8eKfL659pYxGbz2PjrvvFZ1NhN1IIA_Ws9uyRWE_SBxcaEryx8vB86YOnv2ADU2lg2Y8s8NUJVgJDUE6r5QxaJA3TPRR7UZbMbU7ZN0Gh-oNYt72khnLmtNEePBarYBloSn4N6OKqi_gOoVpLGkBtZUvaYhnRyYfZsu-Eh3z7pOU')",
                  }}
                ></div>
              </div>
              <div className="absolute -bottom-8 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block max-w-[300px]">
                <p className="italic text-gray-600 text-xs md:text-sm leading-relaxed">
                  &ldquo;Kualitas bukan hanya janji, melainkan tradisi yang kami jaga setiap hari.&rdquo;
                </p>
                <p className="mt-3 font-bold text-[#51000d] text-xs">&mdash; Pak Mul, Founder</p>
              </div>
            </div>
          </div>
        </section>

        {/* Visi & Misi Bento Grid */}
        <section className="bg-[#f3f3f3] py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#51000d] font-bold text-xs tracking-widest uppercase bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                Fokus Utama
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#51000d] mt-3 mb-2">Visi &amp; Misi</h2>
              <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto font-medium">
                Membangun ekosistem kuliner yang berkelanjutan melalui standar mutu tinggi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Visi Card */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#51000d] to-[#7a0019] text-white rounded-[24px] p-8 md:p-12 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="material-symbols-outlined text-5xl mb-6 text-red-200">visibility</span>
                  <h3 className="text-2xl font-bold mb-3">Visi Kami</h3>
                  <p className="text-sm md:text-base text-white/90 leading-relaxed font-normal">
                    Menjadi pemimpin industri pengolahan daging sapi premium yang dikenal karena integritas kualitasnya, serta menjadi pilihan utama bagi reseller dan konsumen akhir secara nasional.
                  </p>
                </div>
                <div className="mt-10 flex items-center gap-4">
                  <div className="h-px flex-grow bg-white/20"></div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">Future Excellence</span>
                </div>
              </div>

              {/* Misi B2B Card */}
              <div className="bg-white rounded-[24px] p-8 flex flex-col shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#7a0019] flex items-center justify-center text-white mb-6 shadow-md">
                  <span className="material-symbols-outlined">business_center</span>
                </div>
                <h3 className="text-xl font-bold text-[#51000d] mb-3">Misi B2B</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Mendukung pertumbuhan UMKM dan pengusaha kuliner dengan menyediakan pasokan produk berkualitas konsisten, sistem logistik efisien, dan harga yang kompetitif.
                </p>
              </div>

              {/* Misi Retail Card */}
              <div className="bg-white rounded-[24px] p-8 flex flex-col shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#7a0019] flex items-center justify-center text-white mb-6 shadow-md">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <h3 className="text-xl font-bold text-[#51000d] mb-3">Misi Retail</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Menghadirkan kelezatan bakso asli Indonesia ke setiap meja makan keluarga dengan kemasan praktis yang tetap menjaga kesegaran dan nilai gizi.
                </p>
              </div>

              {/* Quality Commitment Card */}
              <div className="md:col-span-2 bg-white rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-gray-100">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#51000d] mb-3">Komitmen Higienitas</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Setiap tahap produksi diawasi dengan ketat, mulai dari pemilihan bahan baku hingga proses pembekuan cepat (Flash Freeze) untuk mengunci rasa.
                  </p>
                </div>
                <div className="w-full md:w-64 h-36 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkwTb7Qx_AiwMC8gQ5YhBqrvdRFqLBA5yzolsf3HQ7TQiUDQ4QlKJMOmqe98PUaqC_FSx8eDKZozT9JfrugOu9LU4Qw_ggKuZk-5lp1U0ijo_ub4JICllVIRRakUbEd3Yd6aOzWB8lOZztfn3S4QQlLb666GYFt17ZSoSGvbRIooOTvG4xQ7ya2ZrC_0fkKXbnr7hMXh-xcD8WAeuwUOTPN8U1Lf11VOT7s8r02d9we-gBRUokPgG9O6YEQZ0HyEWj7GTSIP5W26iP')",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto text-center">
          <span className="text-[#51000d] font-bold text-xs tracking-widest uppercase bg-red-100/60 px-3.5 py-1.5 rounded-full">
            Prinsip Utama
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#51000d] mt-3 mb-16">Nilai-Nilai Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group p-6 rounded-2xl transition-all hover:bg-white hover:shadow-xl">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-red-50 text-[#51000d] flex items-center justify-center mb-6 group-hover:bg-[#51000d] group-hover:text-white transition-all duration-300 shadow-sm">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <h4 className="text-xl font-bold text-[#51000d] mb-2">100% Halal</h4>
              <p className="text-xs md:text-sm text-gray-600 px-4 leading-relaxed">
                Menjamin seluruh proses produksi sesuai dengan syariat dan sertifikasi resmi.
              </p>
            </div>

            <div className="group p-6 rounded-2xl transition-all hover:bg-white hover:shadow-xl">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-red-50 text-[#51000d] flex items-center justify-center mb-6 group-hover:bg-[#51000d] group-hover:text-white transition-all duration-300 shadow-sm">
                <span className="material-symbols-outlined text-4xl">eco</span>
              </div>
              <h4 className="text-xl font-bold text-[#51000d] mb-2">Tanpa Pengawet</h4>
              <p className="text-xs md:text-sm text-gray-600 px-4 leading-relaxed">
                Komitmen menggunakan bahan alami tanpa tambahan zat kimia berbahaya.
              </p>
            </div>

            <div className="group p-6 rounded-2xl transition-all hover:bg-white hover:shadow-xl">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-red-50 text-[#51000d] flex items-center justify-center mb-6 group-hover:bg-[#51000d] group-hover:text-white transition-all duration-300 shadow-sm">
                <span className="material-symbols-outlined text-4xl">award_star</span>
              </div>
              <h4 className="text-xl font-bold text-[#51000d] mb-2">Bahan Pilihan</h4>
              <p className="text-xs md:text-sm text-gray-600 px-4 leading-relaxed">
                Hanya menggunakan daging sapi kualitas atas dan bumbu rempah terbaik nusantara.
              </p>
            </div>
          </div>
        </section>

        {/* Partnership & Quality CTA */}
        <section className="py-12 pb-24 px-6">
          <div className="max-w-7xl mx-auto rounded-[36px] overflow-hidden bg-gradient-to-br from-[#51000d] to-[#7a0019] p-10 md:p-20 relative shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Siap Menjadi Bagian dari Kesuksesan Anda?
              </h2>
              <p className="text-sm md:text-lg text-white/80 mb-10 font-medium leading-relaxed">
                Kami membuka peluang kemitraan bagi reseller, rumah makan, dan distributor yang mengutamakan kualitas produk di atas segalanya.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#51000d] px-8 py-4 rounded-xl font-bold text-xs md:text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95 uppercase tracking-wider flex items-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp text-lg text-green-600"></i>
                  <span>Hubungi Tim Sales</span>
                </a>
                <Link
                  href="/produk"
                  className="border border-white/40 text-white px-8 py-4 rounded-xl font-bold text-xs md:text-sm hover:bg-white/10 transition-all active:scale-95 uppercase tracking-wider"
                >
                  Lihat Katalog Produk
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
