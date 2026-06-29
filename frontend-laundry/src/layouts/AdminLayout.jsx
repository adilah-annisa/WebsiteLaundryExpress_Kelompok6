import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/Navbar";
import "../DashboardAdmin/assets/tailwind.css";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard Admin", subtitle: "Ringkasan operasional laundry" },
  "/dashboard/pesanan": { title: "Kelola Pesanan", subtitle: "Data pemesanan pelanggan" },
  "/dashboard/jadwal": { title: "Kelola Jadwal", subtitle: "Slot antar-jemput" },
  "/dashboard/keuangan": { title: "Kelola Transaksi", subtitle: "Pencatatan keuangan" },
  "/dashboard/laporan": { title: "Laporan", subtitle: "Analitik pendapatan" },
  "/dashboard/pelanggan-admin": { title: "Data Pelanggan", subtitle: "Informasi pelanggan" },
  "/dashboard/pengaturan": { title: "Pengaturan", subtitle: "Konfigurasi sistem" },
};

export default function AdminLayout({ sidebar: SidebarComponent, menuItems, brand = "Admin Panel", pageTitles = PAGE_TITLES }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = pageTitles[pathname] || { title: "Dashboard", subtitle: "" };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} brand={brand} menuItems={menuItems} />
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Navbar title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setSidebarOpen(true)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
