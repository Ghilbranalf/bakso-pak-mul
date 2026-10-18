"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-[#faf8f5] text-stone-900 font-sans antialiased flex flex-col justify-between selection:bg-[#7a0019] selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Editorial Story Hero */}
        <section className="relative bg-[#1c0306] text-white pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#7a0019]/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-stone-200 text-xs font-semibold mb-2">
              <span>Dedikasi &amp; Tradisi Sejak 1990</span>
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-tight">
              Kisah di Balik Kios Kramat Jati
            </h1>

            <p className="font-editorial text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal pt-2">
              Perjalanan lebih dari tiga dekade meracik olahan daging sapi segar pilihan, mempertahankan rasa otentik yang jujur dan dipercaya keluarga serta ratusan mitra kuliner di Jabodetabek.
            </p>
          </div>
        </section>

        {/* Narrative & Authentic Photography */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 text-[#7a0019] text-xs font-bold">
                Filosofi Kejujuran Rasa
              </div>

              <p className="font-headline text-2xl sm:text-4xl font-black text-[#1c1917] leading-tight uppercase">
                &ldquo;Rasa tidak pernah bisa dibohongi. Ketika daging sapi murni diolah dengan kejujuran resep rempah, lidah pelanggan akan selalu ingat jalan pulang.&rdquo;
              </p>

              <div className="space-y-4 font-editorial text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                <p>
                  Bermula pada tahun 1990 dari sebuah kios sederhana di lantai dasar Pasar Kramat Jati, Jakarta Timur, Pak Mul memulai usahanya dengan prinsip sederhana: tidak akan pernah berkompromi dengan kualitas daging sapi. Di saat banyak produsen mencampur bahan pengisi berlebih demi mengejar volume, Pak Mul tetap setia memilih daging sapi segar langsung dari pemotongan pasar induk pada pukul 04.30 subuh setiap hari.
                </p>
                <p>
                  Kini, setelah lebih dari 34 tahun konsistensi rasa itu dijaga, Bakso Pak Mul telah melayani ribuan pelanggan rumah tangga dan menjadi mitra utama bagi lebih dari 500 gerobak mie ayam, warung bakso solo, depot katering, hingga restoran keluarga di seluruh penjuru Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
                </p>
              </div>

              {/* Legacy Milestones: Double-Bezel Nested Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4">
                <div className="p-1 rounded-[1.5rem] bg-stone-200/50">
                  <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#faf8f5] p-5 text-center">
                    <p className="font-headline font-black text-3xl sm:text-4xl text-[#7a0019]">1990</p>
                    <p className="text-xs text-stone-700 font-bold mt-1">Kramat Jati</p>
                  </div>
                </div>
                <div className="p-1 rounded-[1.5rem] bg-stone-200/50">
                  <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#faf8f5] p-5 text-center">
                    <p className="font-headline font-black text-3xl sm:text-4xl text-[#7a0019]">100%</p>
                    <p className="text-xs text-stone-700 font-bold mt-1">Sapi Murni</p>
                  </div>
                </div>
                <div className="p-1 rounded-[1.5rem] bg-stone-200/50">
                  <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#faf8f5] p-5 text-center">
                    <p className="font-headline font-black text-3xl sm:text-4xl text-[#7a0019]">500+</p>
                    <p className="text-xs text-stone-700 font-bold mt-1">Mitra Aktif</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Photo: Double-Bezel Framing */}
            <div className="lg:col-span-5">
              <div className="p-2 rounded-[2.25rem] bg-stone-100">
                <div className="relative rounded-[calc(2.25rem-0.5rem)] overflow-hidden bg-stone-900 group">
                  <img
                    src="/images/toko-pak-mul-kramat-jati.webp"
                    alt="Pak Mul di Kios Pasar Kramat Jati"
                    className="w-full h-[460px] sm:h-[520px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" /* taste-skill-ignore */ />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/70 text-stone-200 text-xs font-semibold">
                      Kios No. 42-43 • Lantai Dasar
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs font-bold text-amber-300">
                      Dokumentasi Otentik
                    </span>
                    <p className="font-headline font-black text-2xl uppercase mt-1 text-white">
                      Kios Bakso Pak Mul
                    </p>
                    <p className="text-xs text-stone-300 mt-1">
                      Pasar Kramat Jati, Jakarta Timur • Buka Tiap Subuh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Values (Editorial Double-Bezel Grid) */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 text-[#7a0019] text-xs font-bold mb-3">
                Prinsip Kualitas
              </div>
              <h2 className="font-headline text-3xl sm:text-5xl font-black text-[#1c1917] tracking-tight uppercase">
                Tiga Pilar Kualitas Bakso Pak Mul
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-1.5 rounded-[2rem] bg-stone-100/80 transition-colors duration-200">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-8 space-y-3 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#7a0019] text-white flex items-center justify-center font-bold mb-4">
                      <span className="material-symbols-outlined text-2xl">verified</span>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1c1917]">
                      Daging Murni Tanpa Boraks
                    </h3>
                    <p className="font-editorial text-sm sm:text-base text-stone-600 leading-relaxed font-normal mt-2">
                      Tekstur kenyal bakso kami berasal murni dari kekenyalan alami serat daging sapi segar yang digiling dingin, bukan dari bahan kimia berbahaya maupun pengenyal buatan.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#7a0019] pt-2">
                    Standar Higienis Subuh
                  </span>
                </div>
              </div>

              <div className="p-1.5 rounded-[2rem] bg-stone-100/80 transition-colors duration-200">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-8 space-y-3 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#7a0019] text-white flex items-center justify-center font-bold mb-4">
                      <span className="material-symbols-outlined text-2xl">soup_kitchen</span>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1c1917]">
                      Resep Rempah Warisan
                    </h3>
                    <p className="font-editorial text-sm sm:text-base text-stone-600 leading-relaxed font-normal mt-2">
                      Takaran bawang putih goreng lokal, merica butir tumbuk, dan bumbu kaldu rempah yang dipertahankan turun temurun memberikan keharuman aroma yang khas dan menggugah selera.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#7a0019] pt-2">
                    Resep Turun Temurun
                  </span>
                </div>
              </div>

              <div className="p-1.5 rounded-[2rem] bg-stone-100/80 transition-colors duration-200">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#faf8f5] p-8 space-y-3 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#7a0019] text-white flex items-center justify-center font-bold mb-4">
                      <span className="material-symbols-outlined text-2xl">inventory_2</span>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1c1917]">
                      Kemasan Higienis &amp; Rantai Dingin
                    </h3>
                    <p className="font-editorial text-sm sm:text-base text-stone-600 leading-relaxed font-normal mt-2">
                      Produk disegel rapi dalam kemasan hampa udara (vacuum pack) dan didinginkan langsung untuk memastikan keamanan pangan dan kualitas mutu terjaga hingga ke tangan Anda.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#7a0019] pt-2">
                    Segel Mutu Pangan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Invitation & Kiosk Location: Button-in-Button */}
        <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-[#1c0306] text-white p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-stone-200 text-xs font-semibold">
                <span>Kemitraan Usaha &amp; Hajatan</span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                Tertarik Bermitra atau Butuh Pasokan Rutin?
              </h2>
              <p className="font-editorial text-stone-300 text-sm sm:text-base leading-relaxed font-normal">
                Kami siap menyuplai kebutuhan bakso sapi, mie telor, kulit pangsit, dan bumbu kuah dengan harga grosir terbaik untuk usaha Anda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20tertarik%20dengan%20kemitraan%20usaha%20bakso"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#1c0306] font-bold text-xs flex items-center gap-2.5 transition-colors duration-200 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Konsultasi WhatsApp</span>
              </a>

              <Link
                href="/produk"
                className="rounded-full px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wide transition-colors duration-200 active:scale-[0.98]"
              >
                Katalog Menu
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}