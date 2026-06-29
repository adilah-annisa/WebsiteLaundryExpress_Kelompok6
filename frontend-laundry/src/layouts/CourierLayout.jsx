import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/Navbar";
import { courierMenuItems } from "../config/courierMenu";
import "../DashboardAdmin/assets/tailwind.css";

const PAGE_TITLES = {
  "/kurir": { title: "Dashboard Kurir", subtitle: "Ringkasan tugas hari ini" },
  "/kurir/jemput": { title: "Jadwal Jemput", subtitle: "Penjemputan laundry" },
  "/kurir/antar": { title: "Jadwal Antar", subtitle: "Pengantaran laundry" },
  "/kurir/bukti": { title: "Upload Bukti", subtitle: "Bukti pengantaran" },
  "/kurir/profil": { title: "Profil Kurir", subtitle: "Data akun kurir" },
};

export default function CourierLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = PAGE_TITLES[pathname] || { title: "Kurir", subtitle: "" };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} brand="Kurir Panel" menuItems={courierMenuItems} accent="indigo" />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Navbar title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setSidebarOpen(true)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
