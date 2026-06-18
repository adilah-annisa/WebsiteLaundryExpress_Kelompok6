import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Soft animated glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl animate-[pulse_5s_ease-in-out_infinite]"
      />

      <div className="relative w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left branding panel */}
          <aside className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-lg p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(59,130,246,0.35)]">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    <span className="text-blue-600">Laundry</span>
                    <span className="text-gray-800">Express</span>
                  </h1>
                  <p className="text-sm text-gray-600 mt-0.5">Login / Register cepat & rapi</p>
                </div>
              </div>

              <div className="mt-6 flex-1">
                <div className="h-1 w-16 bg-blue-600 rounded-full mb-5" />

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-gray-800">Masuk sesuai role</p>
                      <p className="text-xs text-gray-600">Admin • Pelanggan • Kurir</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-gray-800">Form interaktif</p>
                      <p className="text-xs text-gray-600">Loading, validasi, dan feedback jelas</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-gray-800">Desain konsisten</p>
                      <p className="text-xs text-gray-600">Seragam antara login & registrasi</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Auth • Laundry Express</p>
              </div>
            </div>
          </aside>

          {/* Right: page content card */}
          <section className="group rounded-3xl border border-white/70 bg-white/70 backdrop-blur-lg p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* animated gradient rim */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-blue-400/15 blur-2xl" />
              <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-indigo-400/15 blur-2xl" />
            </div>

            {/* mount animation */}
            <div className="flex flex-col items-stretch gap-4 animate-[authIn_420ms_ease-out_both] relative z-10">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

