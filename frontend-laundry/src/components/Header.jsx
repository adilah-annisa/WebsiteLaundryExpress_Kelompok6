import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoNotificationsOutline, IoMenuOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/pesanan": "Kelola Pesanan",
  "/dashboard/jadwal": "Slot Waktu Penjemputan",
  "/dashboard/keuangan": "Keuangan",
  "/dashboard/laporan": "Laporan Pendapatan",
  "/dashboard/pelanggan-admin": "Kelola Pelanggan",

  "/pelanggan": "Dashboard Pelanggan",
  "/pelanggan/pemesanan": "Pesan Laundry",
  "/pelanggan/jadwal": "Jadwal Jemput",
  "/pelanggan/status": "Status Laundry",
  "/pelanggan/riwayat": "Riwayat Transaksi",
  "/pelanggan/bukti": "Bukti Pengantaran",

  "/kurir": "Dashboard Kurir",
  "/kurir/jemput": "Penjemputan",
  "/kurir/antar": "Pengantaran",
  "/kurir/bukti": "Upload Bukti",
};

const roleLabels = {
  admin: "Pemilik Laundry",
  pelanggan: "Pelanggan",
  kurir: "Kurir",
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = pageTitles[pathname] || "Dashboard";
  const role = roleLabels[user?.role] || "Pengguna";

  const [hasPageHeader, setHasPageHeader] = useState(false);

  useEffect(() => {
    const found = !!document.querySelector(".page-header");
    setHasPageHeader(found);
  }, [pathname]);

  return (
    <header className="flex items-center justify-between mb-6 md:mb-8 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors shrink-0"
            aria-label="Buka menu"
          >
            <IoMenuOutline className="text-xl text-gray-700" />
          </button>
        )}
        {!hasPageHeader && (
          <div className="min-w-0">
            <h1 className="font-inter-semibold text-xl md:text-2xl text-gray-800 truncate">{title}</h1>
            <p className="text-sm text-gray-500 mt-1 font-poppins">
              Selamat datang, {user?.name || role}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <button type="button" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <IoNotificationsOutline className="text-xl text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/iconAdmin.jpg"
            alt={role}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm"
          />
          <div className="hidden md:block">
            <p className="text-sm font-inter-semibold text-gray-800">{user?.name || role}</p>
            <p className="text-xs text-gray-500 font-poppins">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
