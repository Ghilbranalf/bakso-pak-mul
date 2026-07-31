import Link from 'next/link'
import { login, loginWithGoogle } from '../auth/actions'
import Navbar from '@/components/Navbar'

export default async function LoginPage(props: {
  searchParams: Promise<{ message?: string, redirectTo?: string }>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="min-h-screen text-on-surface bg-surface-white font-sans">
      <Navbar />
      <main className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side: Visual/Branding Split */}
        <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden items-center justify-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0 scale-105" 
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbBv-Z2fFWVzqZLykwzH3RjoyKXMfQIlMEeUxaDF7KNz6WFlxdNgVdfLcWxZdmNCqN5ZcwddtaOEvq9c5g7-4b2vtviRpMZesPoVZA6BhB6yd6AJLLET1Gk7ENtLmkiiS4TQRksh4YxEuxPMZJxi5zKq4ejINzUGiPDnayhTqaWqrJAY299qSP9Q0ihspjNrka03DUcLJ0aMGIq8E10pyJjjntUj8DdD2g1YbNbE54qDhX72dgvHbZdJp9N6w4SpQIhnPRp-MR_xsr')",
              backgroundSize: 'cover', 
              backgroundPosition: 'center'
            }}
          ></div>
          {/* Branding Overlay */}
          <div className="absolute inset-0 z-10 visual-gradient"></div>
          <div className="relative z-20 p-12 text-center max-w-lg flex flex-col items-center">
            <div className="mb-12">
              <img 
                alt="Bakso Pak Mul Logo" 
                className="w-32 h-32 object-contain rounded-2xl bg-white p-4 shadow-2xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1WjveNTS26Sz799h188fbaVtINKX9F305Sa__ErqVHojeE_eLl_3Y5xcwHxF30MLpOpou9MrCt46iG7_vaFRYF7gGq88RiWM4yT2j6eAYYl6-RSfw7Su2LSCbrT3b2LdSe108wZYUr53tXJTlgbNOggMaqdUKPkO-hWBUV90WKu7APoIeXxlIdr28JIF9SZgfDdLP1YNJTOAmAlmOMoZ5ahP5vSQGElqIUHvmfjsAOCqAL4ykThYhpRyiB4ltNY3DnSAHNQaXqRgY" 
              />
            </div>
            <h1 className="text-4xl lg:text-5xl text-white mb-6 leading-tight font-bold">Selamat Datang Kembali</h1>
            <p className="text-lg text-white/90 leading-relaxed mb-10 max-w-md">Masuk untuk melanjutkan pengalaman berbelanja Anda dan nikmati promo menarik hari ini.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-surface-white">
          <div className="w-full max-w-[440px]">
            {/* Mobile Header */}
            <div className="lg:hidden mb-10 flex items-center gap-4">
              <img 
                alt="Logo" 
                className="w-14 h-14 rounded-xl shadow-md bg-white p-1" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1WjveNTS26Sz799h188fbaVtINKX9F305Sa__ErqVHojeE_eLl_3Y5xcwHxF30MLpOpou9MrCt46iG7_vaFRYF7gGq88RiWM4yT2j6eAYYl6-RSfw7Su2LSCbrT3b2LdSe108wZYUr53tXJTlgbNOggMaqdUKPkO-hWBUV90WKu7APoIeXxlIdr28JIF9SZgfDdLP1YNJTOAmAlmOMoZ5ahP5vSQGElqIUHvmfjsAOCqAL4ykThYhpRyiB4ltNY3DnSAHNQaXqRgY" 
              />
              <div>
                <h2 className="text-2xl text-primary font-bold">Bakso Pak Mul</h2>
                <p className="text-sm text-on-surface-variant">Masuk ke akun anda</p>
              </div>
            </div>

            <div className="mb-10 hidden lg:block">
              <h2 className="text-3xl text-on-surface font-bold">Masuk ke Akun Anda</h2>
              <p className="text-base text-on-surface-variant mt-3">Silakan masukkan email dan password untuk masuk.</p>
            </div>

            <form className="space-y-5" action={login}>
              {searchParams?.redirectTo && (
                <input type="hidden" name="redirectTo" value={searchParams.redirectTo} />
              )}
              
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface/80 block" htmlFor="email">Alamat Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-[20px]">alternate_email</span>
                  <input 
                    className="w-full h-14 pl-12 pr-4 bg-white border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 form-input-focus outline-none transition-all" 
                    id="email" 
                    name="email"
                    placeholder="budi@email.com" 
                    required 
                    type="email" 
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface/80 block" htmlFor="password">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                  <input 
                    className="w-full h-14 pl-12 pr-11 bg-white border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 form-input-focus outline-none transition-all" 
                    id="password" 
                    name="password"
                    placeholder="••••••••" 
                    required 
                    type="password" 
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-on-surface-variant cursor-pointer">
                    Ingat Saya
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-primary hover:underline">
                    Lupa sandi?
                  </a>
                </div>
              </div>

              {searchParams?.message && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {searchParams.message === '{}' ? 'Terjadi kesalahan saat masuk.' : searchParams.message}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full h-14 bg-primary-container text-white rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-primary hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-6"
              >
                Masuk Sekarang
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-[20px]">login</span>
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-10 flex items-center">
              <div className="flex-grow border-t border-outline-variant/60"></div>
              <span className="flex-shrink mx-4 text-[11px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Atau Masuk Lewat</span>
              <div className="flex-grow border-t border-outline-variant/60"></div>
            </div>

            {/* Social Options */}
            <div className="grid grid-cols-1 gap-4">
              <form action={loginWithGoogle}>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 h-14 border border-outline-variant rounded-xl bg-white hover:bg-surface-variant/30 hover:border-outline transition-all group cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.05 9.14 5 12 5z" fill="#EA4335"></path>
                    <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.74-2.38 3.58l3.66 2.84c2.14-1.98 3.38-4.9 3.38-8.66z" fill="#4285F4"></path>
                    <path d="M5.84 14.09l-3.66 2.84C3.99 20.53 7.7 23 12 23c2.97 0 5.46-1.09 7.28-2.93l-3.66-2.84c-1.01.67-2.31 1.09-3.62 1.09-2.86 0-5.29-2.05-6.16-4.91z" fill="#FBBC05"></path>
                    <path d="M12 23c4.3 0 8.01-2.47 9.82-6.07l-3.66-2.84c-.87 2.86-3.3 4.91-6.16 4.91-2.86 0-5.29-2.05-6.16-4.91l-3.66 2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  </svg>
                  <span className="text-sm font-semibold text-on-surface">Google</span>
                </button>
              </form>
            </div>

            {/* Footer Link */}
            <div className="mt-10 text-center">
              <p className="text-sm text-on-surface-variant">
                Belum punya akun? <Link href="/register" className="text-primary font-extrabold hover:underline ml-1">Daftar sekarang</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <button className="w-14 h-14 bg-primary-container text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
        </button>
      </div>
    </div>
  )
}
