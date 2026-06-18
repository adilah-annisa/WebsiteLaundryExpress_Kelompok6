import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarPelanggan from "../components/SidebarPelanggan";
import Header from "../components/Header";
import "../DashboardAdmin/assets/tailwind.css";

export default function PelangganLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] font-poppins">
      <SidebarPelanggan open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-auto">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
      </main>
    </div>
  );
}
