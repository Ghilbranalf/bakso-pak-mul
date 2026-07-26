"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <main className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Left Side: Visual Storytelling */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        {/* Sophisticated Gradient Overlay */}
        <div className="absolute inset-0 z-10 vignette-overlay"></div>
        {/* High-Fidelity Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-105 object-cover"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDy3bdv1QVZFMLW2UU7qxgRXnq2jMHWkK8bk9dUm3e3maXqD6edfZcSU28fnTQzzPpKCvaX47rjCThuMQyOlrZRmGgNZmw_uH5JLcBeJ3uFVgSPXlsOLBAxrJot0y7P2ICtCb69hocvCaTJlXOqU45TEIYCkT6LS-YY21XMyE4-D1-p7TpO0VdiE8lOGwta3Tk66ipC7MlKmFf-3ofHdbgVDN1Q5rVWP4TWizcIhLhLWKS7hYD41I3X4_YNkh4bFpgn7BczB1actiem")',
          }}
        ></div>
        
        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col justify-between p-margin-desktop h-full w-full">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-glass-border">
              <img
                alt="Bakso Pak Mul Logo"
                className="h-12 w-12 object-contain brightness-0 invert"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1WjveNTS26Sz799h188fbaVtINKX9F305Sa__ErqVHojeE_eLl_3Y5xcwHxF30MLpOpou9MrCt46iG7_vaFRYF7gGq88RiWM4yT2j6eAYYl6-RSfw7Su2LSCbrT3b2LdSe108wZYUr53tXJTlgbNOggMaqdUKPkO-hWBUV90WKu7APoIeXxlIdr28JIF9SZgfDdLP1YNJTOAmAlmOMoZ5ahP5vSQGElqIUHvmfjsAOCqAL4ykThYhpRyiB4ltNY3DnSAHNQaXqRgY"
              />
            </div>
            <span className="font-headline-lg text-headline-lg text-white font-semibold tracking-tight">
              Bakso Pak Mul
            </span>
          </div>
          
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-white text-display-lg leading-[1.1] mb-stack-md font-bold">
              Masuk untuk Menikmati Cita Rasa Legendaris
            </h1>
            <p className="text-primary-fixed-dim/80 text-body-lg max-w-lg font-light leading-relaxed mx-auto">
              Masuk ke akun Anda untuk mulai memesan produk Bakso Pak Mul favorit Anda dengan mudah dan cepat.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="flex-1 flex flex-col p-6 md:p-12 lg:p-margin-desktop bg-surface-white">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          
          {/* Mobile/Tablet Brand Header */}
          <div className="lg:hidden mb-12 flex flex-col items-center">
            <div className="bg-primary/5 p-4 rounded-2xl mb-4">
              <img
                alt="Bakso Pak Mul"
                className="h-16 w-16 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1WjveNTS26Sz799h188fbaVtINKX9F305Sa__ErqVHojeE_eLl_3Y5xcwHxF30MLpOpou9MrCt46iG7_vaFRYF7gGq88RiWM4yT2j6eAYYl6-RSfw7Su2LSCbrT3b2LdSe108wZYUr53tXJTlgbNOggMaqdUKPkO-hWBUV90WKu7APoIeXxlIdr28JIF9SZgfDdLP1YNJTOAmAlmOMoZ5ahP5vSQGElqIUHvmfjsAOCqAL4ykThYhpRyiB4ltNY3DnSAHNQaXqRgY"
              />
            </div>
            <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-primary font-bold">
              Bakso Pak Mul
            </h2>
          </div>
          
          <header className="text-center mb-12">
            <h2 className="text-headline-xl text-text-primary mb-2">Selamat Datang</h2>
            <p className="text-body-md text-text-muted">Silakan masuk untuk melanjutkan akses ke portal mitra.</p>
          </header>
          
          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email / WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-label-md text-on-surface-variant px-1 font-semibold" htmlFor="identifier">
                Email atau Nomor WhatsApp
              </label>
              <div className="relative">
                <span 
                  className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: emailFocused ? '#7a0019' : '#9ca3af' }}
                >
                  alternate_email
                </span>
                <input
                  className="input-elegant w-full h-14 pl-12 pr-4 bg-white border border-outline-variant rounded-xl text-body-md placeholder:text-outline focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                  id="identifier"
                  placeholder="nama@email.com atau 0812..."
                  type="text"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </div>
            </div>
            
            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-label-md text-on-surface-variant font-semibold" htmlFor="password">
                  Kata Sandi
                </label>
                <Link className="text-label-sm font-semibold text-secondary hover:text-primary transition-colors" href="#">
                  Lupa Kata Sandi?
                </Link>
              </div>
              <div className="relative">
                <span 
                  className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: passwordFocused ? '#7a0019' : '#9ca3af' }}
                >
                  lock
                </span>
                <input
                  className="input-elegant w-full h-14 pl-12 pr-12 bg-white border border-outline-variant rounded-xl text-body-md placeholder:text-outline focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors flex items-center"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Remember Me */}
            <div className="flex items-center gap-2 px-1">
              <input
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 focus:ring-offset-0 cursor-pointer"
                id="remember"
                type="checkbox"
              />
              <label className="text-label-md text-on-surface-variant cursor-pointer select-none font-semibold" htmlFor="remember">
                Ingat saya
              </label>
            </div>
            
            {/* Actions */}
            <div className="space-y-4 pt-2">
              <button className="btn-premium w-full h-14 text-white font-semibold rounded-xl text-label-md">
                Masuk ke Akun
              </button>
              
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-4 text-gray-400 font-label-sm uppercase tracking-widest text-[10px]">
                  Atau
                </span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>
              
              <button className="w-full h-14 bg-white border border-gray-200 text-on-surface font-semibold rounded-xl text-label-md hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                Lanjutkan sebagai Tamu
              </button>
            </div>
          </form>
          
          <footer className="mt-10 text-center">
            <p className="text-body-sm text-text-muted">
              Belum punya akun?
              <Link className="text-secondary font-bold hover:text-primary transition-colors ml-1" href="/register">
                Daftar Sekarang
              </Link>
            </p>
          </footer>
        </div>
        
        {/* Simple Footer Links */}
        <div className="mt-auto flex flex-wrap justify-center gap-x-8 gap-y-4 md:justify-start border-t border-gray-100 py-6">
          <Link className="text-label-sm text-outline hover:text-primary transition-colors" href="#">
            Bantuan
          </Link>
          <Link className="text-label-sm text-outline hover:text-primary transition-colors" href="#">
            Kebijakan Privasi
          </Link>
          <Link className="text-label-sm text-outline hover:text-primary transition-colors" href="#">
            Syarat & Ketentuan
          </Link>
        </div>
      </section>
    </main>
  );
}
