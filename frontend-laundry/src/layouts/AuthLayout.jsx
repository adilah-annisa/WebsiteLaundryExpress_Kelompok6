import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <img src="/IconLaundry.png" alt="" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Laundry<span className="text-blue-600">Express</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Management System</p>
        </div>
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          <Outlet />
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">© 2025 Laundry Express</p>
      </div>
    </div>
  );
}
