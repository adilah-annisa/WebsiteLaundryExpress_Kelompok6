import { Outlet } from "react-router-dom";
import SidebarPelanggan from "../components/SidebarPelanggan";
import Header from "../components/Header";

export default function PelangganLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarPelanggan />

      <main className="flex-1">
        <Header
          title="Dashboard Pelanggan"
          subtitle="Selamat datang kembali, Pelanggan"
          role="Pelanggan"
          desc="User"
        />

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}