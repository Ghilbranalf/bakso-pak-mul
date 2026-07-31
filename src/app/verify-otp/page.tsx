import Link from 'next/link'
import { verifyOtpAction } from '../auth/actions'
import Navbar from '@/components/Navbar'

export default async function VerifyOtpPage(props: {
  searchParams: Promise<{ email?: string, message?: string }>
}) {
  const searchParams = await props.searchParams
  
  if (!searchParams.email) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Akses Tidak Valid</h2>
            <Link href="/register" className="text-[#51000d] font-bold hover:underline">Kembali ke halaman pendaftaran</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <span className="material-symbols-outlined text-[#51000d] text-5xl mb-2">mark_email_read</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
              Cek Email Anda
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Kami telah mengirimkan 6 angka OTP ke <br/><strong className="text-gray-900">{searchParams.email}</strong>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/50 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#51000d] opacity-5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-400 opacity-5 rounded-full blur-2xl"></div>
            
            <form className="space-y-6" action={verifyOtpAction}>
              <input type="hidden" name="email" value={searchParams.email} />
              
              {searchParams?.message && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="material-symbols-outlined text-red-400 text-xl">error</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-bold text-red-800">{searchParams.message}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="token" className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 text-center">
                  Masukkan Kode OTP (6 Angka)
                </label>
                <div className="mt-1 relative">
                  <input
                    id="token"
                    name="token"
                    type="text"
                    required
                    maxLength={6}
                    className="appearance-none block w-full px-3 py-4 text-center text-2xl tracking-[0.5em] font-bold border border-gray-300 rounded-xl shadow-sm placeholder-gray-300 focus:outline-none focus:ring-[#51000d] focus:border-[#51000d] transition-all"
                    placeholder="------"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-[#51000d] hover:bg-[#7a0019] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#51000d] transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Verifikasi OTP
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
